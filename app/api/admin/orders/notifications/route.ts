import { serverClient } from "@/sanity/lib/server-client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isAdmin = token?.isAdmin === true || token?.role === "admin";

    if (!token || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await serverClient.fetch(
      `*[_type == "order" && paymentStatus in ["paid", "pending"]] {
        _id,
        "notificationAt": select(
          paymentStatus == "paid" => coalesce(paymentConfirmedAt, _createdAt),
          _createdAt
        )
      } | order(notificationAt desc)[0...100]`,
    );

    return NextResponse.json(
      { orders },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch order notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch order notifications" },
      { status: 500 },
    );
  }
}
