import { NextResponse } from "next/server";
import { getPesaPalAuthToken, registerIPN } from "@/lib/pesapal";
import { client } from "@/sanity/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// === Type Definition ===
type OrderItem = {
  _key: string;
  product: { _type: "reference"; _ref: string };
  productName: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, customer, email, items, deliveryDetails, shippingFee } =
      body;

    const name = customer?.name;
    const phoneNumber = customer?.phone;
    const customerEmail = customer?.email || email;

    if (!amount || !customerEmail || !name || !phoneNumber || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Find or create user
    let user = await client.fetch(
      `*[_type == "user" && email == $email][0]{ _id }`,
      { email: session.user.email },
    );

    if (!user) {
      const newUser = await client.create({
        _type: "user",
        email: session.user.email,
        name: session.user.name || name,
      });
      user = { _id: newUser._id };
    }

    const orderNumber = `ORD-${Date.now()}`;

    // === Map and filter with explicit typing ===
    const orderItems: OrderItem[] = items
      .map((item: any): OrderItem | null => {
        if (!item?.product?._ref) return null;

        return {
          _key: `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          product: { _type: "reference" as const, _ref: item.product._ref },
          productName: item.productName ?? "",
          quantity: item.quantity ?? 1,
          price: item.price ?? 0,
          size: item.size ?? "",
          color: item.color ?? "",
        };
      })
      .filter((item: OrderItem | null): item is OrderItem => item !== null);

    if (orderItems.length === 0) {
      return NextResponse.json({ error: "No valid items" }, { status: 400 });
    }

    // Update stock
    const stockUpdates: any[] = [];
    for (const item of orderItems) {
      try {
        const product = await client.fetch(
          `*[_type == "product" && _id == $productId][0]{ _id, stock, name }`,
          { productId: item.product._ref },
        );
        if (product) {
          const newStock = Math.max(0, (product.stock || 0) - item.quantity);
          await client.patch(product._id).set({ stock: newStock }).commit();
          stockUpdates.push({ success: true, productId: product._id });
        }
      } catch {
        // silently continue
      }
    }

    // Create order in Sanity
    const sanityOrder = await client.create({
      _type: "order",
      orderNumber,
      user: { _type: "reference", _ref: user._id },
      userEmail: session.user.email,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "pesapal",
      paymentDate: new Date().toISOString(),
      customer: { name, email: customerEmail, phone: phoneNumber },
      deliveryDetails: {
        method: "pickup",
        city: deliveryDetails?.city || "Nairobi",
        pickupStationName: deliveryDetails?.pickupStationName || "",
        pickupStationId: deliveryDetails?.pickupStationId || "",
        shippingAddress: deliveryDetails?.shippingAddress || "",
      },
      amount,
      shippingFee: shippingFee || 0,
      items: orderItems,
      stockUpdates,
      createdAt: new Date().toISOString(),
    });

    // PesaPal
    const token = await getPesaPalAuthToken();
    const ipnId = await registerIPN(token);

    const pesapalPayload = {
      id: orderNumber,
      currency: "KES",
      amount,
      description: "Daima Mkenya Purchase",
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?orderId=${sanityOrder._id}`,
      notification_id: ipnId,
      branch: "Daima Mkenya",
      redirect_mode: "TOP_WINDOW",
      billing_address: {
        email_address: customerEmail,
        phone_number: phoneNumber,
        country_code: "KE",
        first_name: name.split(" ")[0] || name,
        last_name: name.split(" ").slice(1).join(" ") || "",
        line_1: deliveryDetails?.shippingAddress || "Nairobi",
        city: deliveryDetails?.city || "Nairobi",
      },
    };

    const response = await fetch(
      `${process.env.PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(pesapalPayload),
      },
    );

    const result = await response.json();
    console.log("PesaPal Response:", JSON.stringify(result, null, 2));

    if (!result || (result.status !== "200" && result.status !== 200)) {
      const errorMessage =
        result?.message ||
        result?.error?.message ||
        result?.error ||
        "Failed to submit order to PesaPal";
      throw new Error(errorMessage);
    }

    await client
      .patch(sanityOrder._id)
      .set({
        pesapalOrderTrackingId: result.order_tracking_id,
        transactionId: result.order_tracking_id,
      })
      .commit();

    return NextResponse.json({
      redirect_url: result.redirect_url,
      order_tracking_id: result.order_tracking_id,
      orderId: sanityOrder._id,
    });
  } catch (error: any) {
    console.error("Register Order Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
