// app/api/admin/orders/update/route.ts
import { serverClient } from "@/sanity/lib/server-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Update the order - commit() returns the updated document
    // We use { visibility: 'async' } to ensure the write is acknowledged immediately
    const result = await serverClient
      .patch(id)
      .set({ status })
      .commit({ visibility: "async" });

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      oldStatus: status, // The target status we just set
      newStatus: status,
      verifiedStatus: result.status, // The actual status from the returned document
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
