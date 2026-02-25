// app/api/user/orders/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { client } from "@/sanity/lib/client";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch orders for the logged-in user
    const orders = await client.fetch(
      `*[_type == "order" && customer.email == $email] | order(createdAt desc) {
        _id,
        orderNumber,
        status,
        amount,
        createdAt,
        pesapalOrderTrackingId,
        items[] {
          productName,
          quantity,
          price,
          size,
          color
        },
        customer
      }`,
      { email: session.user.email },
    );

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
