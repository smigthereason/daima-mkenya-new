import { NextResponse } from "next/server";
import { getPesaPalAuthToken } from "@/lib/pesapal";

export async function POST(req: Request) {
  try {
    const { amount, phone, email, name } = await req.json();
    const token = await getPesaPalAuthToken();

    const orderData = {
      id: `ORDER-${Date.now()}`, // Unique tracking ID
      amount: amount,
      currency: "KES",
      description: "Daima Mkenya Purchase",
      callback_url: "http://localhost:3000/checkout/success", // Where user goes after paying
      notification_id: "YOUR_IPN_ID", // You get this from PesaPal Sandbox Dashboard
      billing_address: {
        email_address: email,
        phone_number: phone,
        first_name: name,
      },
    };

    const response = await fetch("https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    return NextResponse.json(result); 
  } catch (error) {
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}