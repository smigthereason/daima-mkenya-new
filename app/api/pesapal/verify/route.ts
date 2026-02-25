// app/api/pesapal/verify/route.ts

import { NextResponse } from "next/server";
import { getPesaPalAuthToken, getTransactionStatus } from "@/lib/pesapal";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderTrackingId = searchParams.get("orderTrackingId");

  if (!orderTrackingId) {
    return NextResponse.json(
      { error: "Order tracking ID required" },
      { status: 400 },
    );
  }

  try {
    const token = await getPesaPalAuthToken();
    const statusData = await getTransactionStatus(token, orderTrackingId);

    // Log for debugging
    console.log("Payment verification for:", orderTrackingId, statusData);

    return NextResponse.json(statusData);
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
