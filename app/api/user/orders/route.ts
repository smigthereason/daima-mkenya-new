import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { client } from "@/sanity/lib/client";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 },
      );
    }

    console.log("Fetching orders for user email:", session.user.email);

    // Fetch orders for the logged-in user
    const orders = await client.fetch(
      `*[_type == "order" && userEmail == $email] | order(createdAt desc) {
        _id,
        orderNumber,
        status,
        paymentStatus,
        amount,
        createdAt,
        pesapalOrderTrackingId,
        transactionId,
        items[] {
          productName,
          quantity,
          price,
          size,
          color
        },
        customer,
        userEmail
      }`,
      { email: session.user.email },
    );

    console.log(`Found ${orders.length} orders for user ${session.user.email}`);

    // If no orders found by userEmail, try customer.email as fallback
    if (orders.length === 0) {
      const fallbackOrders = await client.fetch(
        `*[_type == "order" && customer.email == $email] | order(createdAt desc) {
          _id,
          orderNumber,
          status,
          paymentStatus,
          amount,
          createdAt,
          pesapalOrderTrackingId,
          transactionId,
          items[] {
            productName,
            quantity,
            price,
            size,
            color
          },
          customer,
          userEmail
        }`,
        { email: session.user.email },
      );

      console.log(`Found ${fallbackOrders.length} orders by customer email`);
      return NextResponse.json({ orders: fallbackOrders });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders. Please try again." },
      { status: 500 },
    );
  }
}
