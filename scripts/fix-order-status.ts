// scripts/fix-order-status.ts
import { client } from "@/sanity/lib/client";

async function fixOrderStatus() {
  const orderId = "YOUR_ORDER_ID_HERE"; // Replace with your order ID

  try {
    const result = await client
      .patch(orderId)
      .set({
        paymentStatus: "paid",
        status: "completed",
        // Add payment details if you have them
        paymentDetails: {
          amount: 2,
          confirmation_code: "UC67F8NX1I",
          currency: "KES",
          payment_account: "2547xxx98723",
          payment_method: "MpesaKE",
          payment_status_description: "Completed",
          status: "200",
          status_code: 1,
        },
      })
      .commit();

    console.log("✅ Order updated:", result);
  } catch (error) {
    console.error("Error updating order:", error);
  }
}

fixOrderStatus();
