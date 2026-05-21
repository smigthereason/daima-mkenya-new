// app/api/fix-orders/route.ts
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    // Find all pending orders
    const query = `*[_type == "order" && status == "pending"] {
      _id,
      orderNumber,
      paymentDetails
    }`;

    const orders = await client.fetch(query);

    console.log(`Found ${orders.length} pending orders`);

    const updatedOrders = [];

    for (const order of orders) {
      // Update all pending orders to completed (for testing)
      const updated = await client
        .patch(order._id)
        .set({
          status: "completed",
          paymentStatus: "paid",
          paymentConfirmedAt: new Date().toISOString(),
        })
        .commit();

      updatedOrders.push(order.orderNumber);
      console.log(`✅ Fixed order: ${order.orderNumber}`);
    }

    return NextResponse.json({
      success: true,
      fixedCount: updatedOrders.length,
      orders: updatedOrders,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fix orders" },
      { status: 500 },
    );
  }
}
