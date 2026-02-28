import { NextResponse } from "next/server";
import { getPesaPalAuthToken, registerIPN } from "@/lib/pesapal";
import { client } from "@/sanity/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 },
      );
    }

    const { amount, email, name, items, shippingAddress, phoneNumber } =
      await req.json();

    // Log received data
    console.log("Register order received:", {
      amount,
      email,
      name,
      phoneNumber,
      shippingAddress,
      itemCount: items?.length,
    });

    // Validate required fields
    if (!amount || !email || !name || !items) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate phone number
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required for payment" },
        { status: 400 },
      );
    }

    // Find the user in Sanity by email
    let user = await client.fetch(
      `*[_type == "user" && email == $email][0] {
        _id,
        email,
        name
      }`,
      { email: session.user.email },
    );

    if (!user) {
      console.log("User not found in Sanity, creating user document...");

      // Create user in Sanity if they don't exist
      const newUser = await client.create({
        _type: "user",
        email: session.user.email,
        name: session.user.name || name,
        image: session.user.image || "",
      });

      user = { _id: newUser._id, email: newUser.email };
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Format items for Sanity
    const orderItems = items.map((item: any, index: number) => ({
      _key: `item-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      size: item.selectedSize,
      color: item.selectedColor.label,
    }));

    // Create order in Sanity with user reference
    const orderData = {
      _type: "order",
      orderNumber,
      user: {
        _type: "reference",
        _ref: user._id,
      },
      userEmail: session.user.email,
      status: "completed", // We set to completed initially, IPN will verify
      paymentStatus: "paid", // We set to paid initially, IPN will verify
      paymentMethod: "pesapal",
      paymentDate: new Date().toISOString(),
      customer: {
        name,
        email,
        phone: phoneNumber, // CRITICAL: Store the phone number
        address: shippingAddress || "",
      },
      amount,
      items: orderItems,
      createdAt: new Date().toISOString(),
    };

    const sanityOrder = await client.create(orderData);
    console.log("Order created in Sanity with user reference:", {
      id: sanityOrder._id,
      orderNumber,
      userEmail: session.user.email,
      userId: user._id,
      phoneNumber: phoneNumber, // Should now show the phone number
    });

    // Authenticate with PesaPal V3
    const token = await getPesaPalAuthToken();

    // Register IPN (Instant Payment Notification)
    const ipnId = await registerIPN(token);

    // Prepare PesaPal Order Payload
    const pesapalOrderData = {
      id: orderNumber,
      currency: "KES",
      amount: amount,
      description: "Daima Mkenya Purchase",
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?orderId=${sanityOrder._id}`,
      notification_id: ipnId,
      branch: "Daima Mkenya",
      redirect_mode: "TOP_WINDOW",
      billing_address: {
        email_address: email,
        phone_number: phoneNumber, // CRITICAL: Include phone number for PesaPal
        country_code: "KE",
        first_name: name.split(" ")[0] || name,
        middle_name: "",
        last_name: name.split(" ").slice(1).join(" ") || "",
        line_1: shippingAddress || "Nairobi",
        line_2: "",
        city: "Nairobi",
        state: "",
        postal_code: "",
        zip_code: "",
      },
    };

    console.log("Sending to PesaPal:", {
      ...pesapalOrderData,
      billing_address: {
        ...pesapalOrderData.billing_address,
        phone_number: phoneNumber, // Log to verify
      },
    });

    // Submit Order to PesaPal
    const response = await fetch(
      `${process.env.PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(pesapalOrderData),
      },
    );

    const result = await response.json();

    if (result.status !== "200" && result.status !== 200) {
      console.error("PesaPal Order Submission Error:", result);
      throw new Error(result.message || "Order submission failed");
    }

    // Update the Sanity order with PesaPal tracking IDs
    await client
      .patch(sanityOrder._id)
      .set({
        pesapalOrderTrackingId: result.order_tracking_id,
        transactionId: result.order_tracking_id,
      })
      .commit();

    // Return the redirect_url for the frontend
    return NextResponse.json({
      redirect_url: result.redirect_url,
      order_tracking_id: result.order_tracking_id,
      merchant_reference: result.merchant_reference || orderNumber,
      orderId: sanityOrder._id,
    });
  } catch (error: any) {
    console.error("Internal Server Error in Register Order:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
