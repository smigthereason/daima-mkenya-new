// app/api/fix-order-data/route.ts
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    // Get all orders
    const orders = await client.fetch(`*[_type == "order"] {
      _id,
      orderNumber,
      customer,
      deliveryDetails,
      items,
      amount,
      subtotal,
      shippingFee
    }`);

    console.log(`Found ${orders.length} orders to check`);

    const updatedOrders = [];

    for (const order of orders) {
      const updates: any = {};
      let needsUpdate = false;

      // Fix customer info if missing
      if (!order.customer && order.userEmail) {
        updates.customer = {
          email: order.userEmail,
          name: order.userEmail?.split("@")[0] || "Customer",
          phone: "Not provided",
        };
        needsUpdate = true;
      }

      // Fix delivery details if missing
      if (!order.deliveryDetails) {
        updates.deliveryDetails = {
          method: "shipping",
          city: "Nairobi",
          shippingAddress: "Address not provided",
        };
        needsUpdate = true;
      }

      // Fix items with missing fields
      if (order.items && order.items.length > 0) {
        const fixedItems = order.items.map((item: any) => ({
          ...item,
          productId: item.productId || item.product?._id || "unknown",
          colorHex: item.colorHex || "#000000",
        }));

        if (JSON.stringify(fixedItems) !== JSON.stringify(order.items)) {
          updates.items = fixedItems;
          needsUpdate = true;
        }
      }

      // Calculate subtotal if missing
      if (!order.subtotal && order.items) {
        updates.subtotal = order.items.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0,
        );
        needsUpdate = true;
      }

      // Add updated timestamp
      if (needsUpdate) {
        updates.updatedAt = new Date().toISOString();

        const updated = await client.patch(order._id).set(updates).commit();

        updatedOrders.push({
          orderNumber: order.orderNumber,
          updates: Object.keys(updates),
        });

        console.log(
          `✅ Fixed order: ${order.orderNumber}`,
          Object.keys(updates),
        );
      }
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
