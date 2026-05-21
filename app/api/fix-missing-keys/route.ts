// app/api/fix-missing-keys/route.ts
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    // Find all orders
    const orders = await client.fetch(`*[_type == "order"] {
      _id,
      orderNumber,
      items,
      stockUpdates
    }`);

    let fixedOrders = 0;

    for (const order of orders) {
      let needsUpdate = false;
      const updates: any = {};

      // Fix items array
      if (order.items && Array.isArray(order.items)) {
        const fixedItems = order.items.map((item: any, index: number) => {
          if (!item._key) {
            needsUpdate = true;
            return {
              ...item,
              _key: `${order.orderNumber}_item_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            };
          }
          return item;
        });
        if (needsUpdate) {
          updates.items = fixedItems;
        }
      }

      // Fix stockUpdates array
      if (order.stockUpdates && Array.isArray(order.stockUpdates)) {
        let needsStockUpdate = false;
        const fixedStockUpdates = order.stockUpdates.map(
          (update: any, index: number) => {
            if (!update._key) {
              needsStockUpdate = true;
              return {
                ...update,
                _key: `${order.orderNumber}_stock_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              };
            }
            return update;
          },
        );
        if (needsStockUpdate) {
          updates.stockUpdates = fixedStockUpdates;
          needsUpdate = true;
        }
      }

      // Apply updates
      if (needsUpdate) {
        await client.patch(order._id).set(updates).commit();
        fixedOrders++;
        console.log(`✅ Fixed keys for order: ${order.orderNumber}`);
      }
    }

    // Also fix carts
    const carts = await client.fetch(`*[_type == "cart"] {
      _id,
      items
    }`);

    let fixedCarts = 0;

    for (const cart of carts) {
      if (cart.items && Array.isArray(cart.items)) {
        let needsUpdate = false;
        const fixedItems = cart.items.map((item: any, index: number) => {
          if (!item._key) {
            needsUpdate = true;
            return {
              ...item,
              _key: `cart_${cart._id}_item_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            };
          }
          return item;
        });

        if (needsUpdate) {
          await client.patch(cart._id).set({ items: fixedItems }).commit();
          fixedCarts++;
          console.log(`✅ Fixed keys for cart: ${cart._id}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      fixedOrders,
      fixedCarts,
      message: `Fixed ${fixedOrders} orders and ${fixedCarts} carts`,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fix keys" }, { status: 500 });
  }
}
