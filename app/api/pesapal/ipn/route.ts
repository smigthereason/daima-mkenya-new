// // // app/api/pesapal/ipn/route.ts

// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const OrderTrackingId = searchParams.get("OrderTrackingId");
//   const OrderMerchantReference = searchParams.get("OrderMerchantReference");

//   console.log("PesaPal IPN Received:", {
//     OrderTrackingId,
//     OrderMerchantReference,
//   });

//   // Just acknowledge receipt - order already marked as completed
//   return NextResponse.json({
//     orderNotificationType: "IPN",
//     orderTrackingId: OrderTrackingId,
//     orderMerchantReference: OrderMerchantReference,
//     status: 200,
//   });
// }

// export async function POST(req: Request) {
//   return GET(req);
// }
import { NextResponse } from "next/server";
import { getPesaPalAuthToken, getTransactionStatus } from "@/lib/pesapal";
import { client } from "@/sanity/lib/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const OrderTrackingId = searchParams.get("OrderTrackingId");
  const OrderMerchantReference = searchParams.get("OrderMerchantReference");

  console.log("PesaPal IPN Received:", {
    OrderTrackingId,
    OrderMerchantReference,
  });

  if (!OrderTrackingId || !OrderMerchantReference) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  try {
    // Verify the transaction status with PesaPal
    const token = await getPesaPalAuthToken();
    const statusData = await getTransactionStatus(token, OrderTrackingId);

    console.log("Transaction status from PesaPal:", statusData);

    // Find the order in Sanity using the order number (merchant reference)
    const order = await client.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]`,
      { orderNumber: OrderMerchantReference },
    );

    if (order) {
      // Only update if the order isn't already marked as completed/paid
      // This prevents overriding our initial status
      if (order.status !== "completed" || order.paymentStatus !== "paid") {
        // Update payment status based on PesaPal response
        // PesaPal status codes: 1 = Success, 0 = Pending, 2 = Failed
        const paymentStatus =
          statusData.status_code === 1
            ? "paid"
            : statusData.status_code === 2
              ? "unpaid"
              : order.paymentStatus;

        const orderStatus =
          statusData.status_code === 1
            ? "completed"
            : statusData.status_code === 2
              ? "failed"
              : order.status;

        await client
          .patch(order._id)
          .set({
            paymentStatus: paymentStatus,
            status: orderStatus,
            paymentDate:
              statusData.status_code === 1
                ? new Date().toISOString()
                : order.paymentDate,
            paymentDetails: {
              status_code: statusData.status_code,
              status: statusData.status,
              payment_status_description: statusData.payment_status_description,
              payment_method: statusData.payment_method,
              amount: statusData.amount,
              currency: statusData.currency,
            },
          })
          .commit();

        console.log(
          `Order ${OrderMerchantReference} updated with payment status: ${paymentStatus}`,
        );
      } else {
        console.log(
          `Order ${OrderMerchantReference} already completed, skipping update`,
        );
      }
    } else {
      console.log(
        `Order not found for merchant reference: ${OrderMerchantReference}`,
      );
    }

    // Acknowledge receipt to PesaPal
    return NextResponse.json({
      orderNotificationType: "IPN",
      orderTrackingId: OrderTrackingId,
      orderMerchantReference: OrderMerchantReference,
      status: 200,
    });
  } catch (error) {
    console.error("IPN processing failed:", error);
    return NextResponse.json(
      { error: "IPN processing failed" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  return GET(req);
}
