import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, orderTrackingId } = await req.json();

    if (!orderId && !orderTrackingId) {
      return NextResponse.json(
        { error: "Order ID or Tracking ID required" },
        { status: 400 },
      );
    }

    // Find the order with product references - ensure we fetch product references
    let order;
    if (orderId) {
      order = await client.fetch(
        `*[_type == "order" && _id == $orderId][0] {
          _id,
          orderNumber,
          items[] {
            _key,
            productName,
            quantity,
            price,
            size,
            color,
            "productId": product->_ref,
            "product": product-> {
              _id,
              name,
              stock
            }
          }
        }`,
        { orderId },
      );
    } else if (orderTrackingId) {
      order = await client.fetch(
        `*[_type == "order" && pesapalOrderTrackingId == $trackingId][0] {
          _id,
          orderNumber,
          items[] {
            _key,
            productName,
            quantity,
            price,
            size,
            color,
            "productId": product->_ref,
            "product": product-> {
              _id,
              name,
              stock
            }
          }
        }`,
        { trackingId: orderTrackingId },
      );
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log(
      `Found order ${order.orderNumber} with ${order.items?.length || 0} items`,
    );

    if (!order.items || order.items.length === 0) {
      return NextResponse.json(
        { error: "Order has no items" },
        { status: 400 },
      );
    }

    // Update stock for each product in the order
    const updateResults = [];
    const updatePromises = order.items.map(async (item: any) => {
      if (!item.productId) {
        console.log(`No productId for item: ${item.productName}`);
        return {
          productName: item.productName,
          success: false,
          reason: "No productId - product reference missing",
        };
      }

      try {
        // Get current product stock
        const product = await client.fetch(
          `*[_type == "product" && _id == $productId][0] {
            _id,
            stock,
            name
          }`,
          { productId: item.productId },
        );

        if (product) {
          const currentStock = product.stock || 0;
          const newStock = Math.max(0, currentStock - item.quantity);

          // Update the product stock
          await client.patch(product._id).set({ stock: newStock }).commit();

          console.log(
            `✓ Updated product ${product.name} (${product._id}) stock from ${currentStock} to ${newStock} (sold: ${item.quantity})`,
          );

          return {
            productId: product._id,
            productName: product.name,
            previousStock: currentStock,
            newStock,
            quantitySold: item.quantity,
            success: true,
          };
        } else {
          console.log(`✗ Product not found: ${item.productId}`);
          return {
            productId: item.productId,
            productName: item.productName,
            success: false,
            reason: "Product not found in database",
          };
        }
      } catch (error) {
        console.error(
          `✗ Error updating stock for product ${item.productId}:`,
          error,
        );
        return {
          productId: item.productId,
          productName: item.productName,
          success: false,
          reason: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    const results = await Promise.all(updatePromises);
    const allSuccessful = results.every((r) => r.success);

    console.log("Stock update results:", results);

    return NextResponse.json({
      success: allSuccessful,
      message: allSuccessful
        ? "Stock updated successfully for all products"
        : "Some products failed to update",
      results,
      orderId: order._id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      {
        error: "Failed to update stock",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
