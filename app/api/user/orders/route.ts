import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { client } from "@/sanity/lib/client";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = session.user.email;
    const query = `*[_type == "order" && (userEmail == $email || customer.email == $email)] | order(createdAt desc) {
        _id,
        orderNumber,
        status,
        paymentStatus,
        amount,
        createdAt,
        pesapalOrderTrackingId,
        transactionId,
        deliveryDetails,
        items[] {
          productName,
          quantity,
          price,
          size,
          color
        },
        customer
      }`;

    const orders = await client.fetch(query, { email });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId, orderTrackingId } = await req.json();

    // Fetch order and include product reference for stock update
    const order = await client.fetch(
      `*[_type == "order" && (_id == $orderId || pesapalOrderTrackingId == $trackingId)][0] {
        _id,
        items[] {
          quantity,
          productName,
          "productId": product._ref
        }
      }`,
      { orderId: orderId || "", trackingId: orderTrackingId || "" },
    );

    if (!order || !order.items)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const results = await Promise.all(
      order.items.map(async (item: any) => {
        if (!item.productId)
          return {
            name: item.productName,
            success: false,
            reason: "No Reference",
          };

        try {
          const product = await client.fetch(
            `*[_type == "product" && _id == $id][0]{_id, stock}`,
            { id: item.productId },
          );
          if (!product) return { name: item.productName, success: false };

          const newStock = Math.max(0, (product.stock || 0) - item.quantity);
          await client.patch(product._id).set({ stock: newStock }).commit();

          return { name: item.productName, success: true, newStock };
        } catch (e) {
          return { name: item.productName, success: false };
        }
      }),
    );

    // Log the update results back to the order for admin visibility
    await client
      .patch(order._id)
      .set({
        stockUpdates: results.map(
          (r) => `${r.name}: ${r.success ? "Success" : "Failed"}`,
        ),
      })
      .commit();

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ error: "Stock update failed" }, { status: 500 });
  }
}
