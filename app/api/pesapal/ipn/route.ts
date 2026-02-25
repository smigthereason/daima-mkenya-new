// // app/api/pesapal/ipn/route.ts

// import { NextResponse } from "next/server";
// import { getPesaPalAuthToken, getTransactionStatus } from "@/lib/pesapal";
// import { client } from "@/sanity/lib/client";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const OrderTrackingId = searchParams.get("OrderTrackingId");
//   const OrderMerchantReference = searchParams.get("OrderMerchantReference");

//   if (!OrderTrackingId || !OrderMerchantReference) {
//     return NextResponse.json(
//       { error: "Missing required parameters" },
//       { status: 400 }
//     );
//   }

//   try {
//     const token = await getPesaPalAuthToken();

//     // Verify transaction status
//     const statusData = await getTransactionStatus(token, OrderTrackingId);

//     // PesaPal status codes: 1 = Success, 0 = Pending, 2 = Failed
//     if (statusData.status_code === 1 || statusData.status === "SUCCESS") {
//       console.log("Payment Successful for:", OrderMerchantReference);

//       // Update order in Sanity
//       try {
//         // Find and update the order
//         const existingOrder = await client.fetch(
//           `*[_type == "order" && orderReference == $ref][0]`,
//           { ref: OrderMerchantReference }
//         );

//         if (existingOrder) {
//           await client
//             .patch(existingOrder._id)
//             .set({
//               paymentStatus: "paid",
//               paymentMethod: statusData.payment_method || "pesapal",
//               paymentDate: new Date().toISOString(),
//               transactionId: OrderTrackingId,
//               paymentDetails: statusData,
//             })
//             .commit();
//         }
//       } catch (dbError) {
//         console.error("Failed to update order in database:", dbError);
//       }
//     } else if (statusData.status_code === 0) {
//       console.log("Payment Pending for:", OrderMerchantReference);
//     } else {
//       console.log("Payment Failed for:", OrderMerchantReference);
//     }

//     // PesaPal expects a specific response to acknowledge the IPN
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
//       { status: 500 }
//     );
//   }
// }
//
// // app/api/pesapal/ipn/route.ts

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const OrderTrackingId = searchParams.get("OrderTrackingId");
  const OrderMerchantReference = searchParams.get("OrderMerchantReference");

  console.log("PesaPal IPN Received:", {
    OrderTrackingId,
    OrderMerchantReference,
  });

  // Just acknowledge receipt - order already marked as completed
  return NextResponse.json({
    orderNotificationType: "IPN",
    orderTrackingId: OrderTrackingId,
    orderMerchantReference: OrderMerchantReference,
    status: 200,
  });
}

export async function POST(req: Request) {
  return GET(req);
}
