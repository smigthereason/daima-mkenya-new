// // app/api/pesapal/ipn/route.ts
// import { NextResponse } from "next/server";
// import { getPesaPalAuthToken, getTransactionStatus } from "@/lib/pesapal";
// import { client } from "@/sanity/lib/client";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const OrderTrackingId = searchParams.get("OrderTrackingId");
//   const OrderMerchantReference = searchParams.get("OrderMerchantReference");

//   console.log("PesaPal IPN Received:", {
//     OrderTrackingId,
//     OrderMerchantReference,
//   });

//   if (!OrderTrackingId || !OrderMerchantReference) {
//     return NextResponse.json(
//       { error: "Missing required parameters" },
//       { status: 400 },
//     );
//   }

//   try {
//     // Verify the transaction status with PesaPal
//     const token = await getPesaPalAuthToken();
//     const statusData = await getTransactionStatus(token, OrderTrackingId);

//     console.log(
//       "Transaction status from PesaPal:",
//       JSON.stringify(statusData, null, 2),
//     );

//     // Find the order in Sanity
//     const order = await client.fetch(
//       `*[_type == "order" && orderNumber == $orderNumber][0] {
//         _id,
//         status,
//         paymentStatus
//       }`,
//       { orderNumber: OrderMerchantReference },
//     );

//     if (order) {
//       // Extract confirmation code from payment_account if needed
//       // Sometimes PesaPal sends the confirmation code in payment_account
//       let confirmationCode = statusData.confirmation_code;

//       // If no confirmation_code but payment_account looks like a code
//       if (
//         !confirmationCode &&
//         statusData.payment_account &&
//         statusData.payment_account.match(/^[A-Z0-9]{10}$/)
//       ) {
//         confirmationCode = statusData.payment_account;
//       }

//       // Update payment details with all available fields
//       await client
//         .patch(order._id)
//         .set({
//           paymentDetails: {
//             status_code: statusData.status_code,
//             status: statusData.status,
//             payment_status_description:
//               statusData.payment_status_description ||
//               statusData.paymentStatusDescription,
//             payment_method: statusData.payment_method,
//             amount: statusData.amount,
//             currency: statusData.currency,
//             payment_account: statusData.payment_account,
//             confirmation_code: confirmationCode || statusData.confirmation_code,
//           },
//           // Also update the main payment method field
//           paymentMethod: statusData.payment_method
//             ?.toLowerCase()
//             .includes("mpesa")
//             ? "mpesa"
//             : "pesapal",
//           // Update transaction ID if needed
//           transactionId: statusData.order_tracking_id || OrderTrackingId,
//         })
//         .commit();

//       console.log(
//         `✅ Order ${OrderMerchantReference} payment details updated:`,
//         {
//           status_code: statusData.status_code,
//           payment_method: statusData.payment_method,
//           confirmation_code: confirmationCode || statusData.confirmation_code,
//           payment_account: statusData.payment_account,
//         },
//       );
//     } else {
//       console.log(
//         `Order not found for merchant reference: ${OrderMerchantReference}`,
//       );
//     }

//     // Acknowledge receipt to PesaPal
//     return NextResponse.json({
//       orderNotificationType: "IPN",
//       orderTrackingId: OrderTrackingId,
//       orderMerchantReference: OrderMerchantReference,
//       status: 200,
//     });
//   } catch (error) {
//     console.error("IPN processing failed:", error);
//     return NextResponse.json(
//       { error: "IPN processing failed" },
//       { status: 500 },
//     );
//   }
// }

// export async function POST(req: Request) {
//   return GET(req);
// }
// app/api/pesapal/ipn/route.ts
import { NextResponse } from "next/server";
import { getPesaPalAuthToken, getTransactionStatus } from "@/lib/pesapal";
import { client } from "@/sanity/lib/client";
import { sendOrderNotificationEmail } from "@/lib/email";

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

    console.log(
      "Transaction status from PesaPal:",
      JSON.stringify(statusData, null, 2),
    );

    // Determine if payment was successful
    const isSuccessful =
      statusData.status === "COMPLETED" ||
      statusData.status_code === 1 ||
      statusData.payment_status_description === "PAID";

    // Find the order in Sanity
    const order = await client.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0] {
        _id,
        orderNumber,
        status,
        paymentStatus,
        amount,
        shippingFee,
        customer,
        deliveryDetails,
        items[] { productName, quantity, price, size, color }
      }`,
      { orderNumber: OrderMerchantReference },
    );

    if (order) {
      // Extract confirmation code from payment_account if needed
      let confirmationCode = statusData.confirmation_code;

      // If no confirmation_code but payment_account looks like a code
      if (
        !confirmationCode &&
        statusData.payment_account &&
        statusData.payment_account.match(/^[A-Z0-9]{10}$/)
      ) {
        confirmationCode = statusData.payment_account;
      }

      // CRITICAL FIX: Update the main order status fields
      await client
        .patch(order._id)
        .set({
          // Update main status fields that ProfilePage checks
          status: isSuccessful ? "completed" : "pending",
          paymentStatus: isSuccessful ? "paid" : "unpaid",

          // Also update payment details for reference
          paymentDetails: {
            status_code: statusData.status_code,
            status: statusData.status,
            payment_status_description:
              statusData.payment_status_description ||
              statusData.paymentStatusDescription,
            payment_method: statusData.payment_method,
            amount: statusData.amount,
            currency: statusData.currency,
            payment_account: statusData.payment_account,
            confirmation_code: confirmationCode || statusData.confirmation_code,
          },
          // Also update the main payment method field
          paymentMethod: statusData.payment_method
            ?.toLowerCase()
            .includes("mpesa")
            ? "mpesa"
            : "pesapal",
          // Update transaction ID if needed
          transactionId: statusData.order_tracking_id || OrderTrackingId,

          // Add timestamp for when payment was confirmed
          paymentConfirmedAt: new Date().toISOString(),
        })
        .commit();

      console.log(`✅ Order ${OrderMerchantReference} updated:`, {
        orderId: order._id,
        status: isSuccessful ? "completed" : "pending",
        paymentStatus: isSuccessful ? "paid" : "unpaid",
        status_code: statusData.status_code,
        payment_method: statusData.payment_method,
        confirmation_code: confirmationCode || statusData.confirmation_code,
      });

      // Notify the store inbox only once the payment has actually gone
      // through - and only on the transition into "paid", so a repeat IPN
      // ping for an order that was already confirmed doesn't send a
      // duplicate email.
      if (isSuccessful && order.paymentStatus !== "paid") {
        try {
          await sendOrderNotificationEmail({
            orderNumber: order.orderNumber,
            amount: order.amount,
            shippingFee: order.shippingFee,
            customer: order.customer,
            deliveryDetails: order.deliveryDetails,
            items: order.items || [],
          });
        } catch (emailError) {
          console.error(
            "❌ Failed to send order-paid notification email:",
            emailError,
          );
          // Order status update still stands even if the email fails
        }
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
