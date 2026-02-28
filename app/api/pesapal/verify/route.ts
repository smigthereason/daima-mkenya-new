// app/api/pesapal/verify/route.ts
import { NextResponse } from "next/server";
import { getPesaPalAuthToken, getTransactionStatus } from "@/lib/pesapal";
import { client } from "@/sanity/lib/client";

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

    console.log("Payment verification for:", orderTrackingId, statusData);

    // Try to find and update the order with this tracking ID
    try {
      const order = await client.fetch(
        `*[_type == "order" && pesapalOrderTrackingId == $trackingId][0] {
          _id
        }`,
        { trackingId: orderTrackingId },
      );

      if (order) {
        // Extract confirmation code
        let confirmationCode = statusData.confirmation_code;
        if (
          !confirmationCode &&
          statusData.payment_account &&
          statusData.payment_account.match(/^[A-Z0-9]{10}$/)
        ) {
          confirmationCode = statusData.payment_account;
        }

        await client
          .patch(order._id)
          .set({
            paymentDetails: {
              status_code: statusData.status_code,
              status: statusData.status,
              payment_status_description: statusData.payment_status_description,
              payment_method: statusData.payment_method,
              amount: statusData.amount,
              currency: statusData.currency,
              payment_account: statusData.payment_account,
              confirmation_code: confirmationCode,
            },
            paymentMethod: statusData.payment_method
              ?.toLowerCase()
              .includes("mpesa")
              ? "mpesa"
              : "pesapal",
          })
          .commit();

        console.log(
          `✅ Updated order ${order._id} with payment details from verify endpoint`,
        );
      }
    } catch (dbError) {
      console.error("Error updating order in verify endpoint:", dbError);
      // Don't fail the request if update fails
    }

    return NextResponse.json(statusData);
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
