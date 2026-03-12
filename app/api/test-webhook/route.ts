import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Webhook Test Endpoint",
    webhook_url: "https://daimamkenyaafrica.com/api/notify-customers",
    server_time: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    sanity_project: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    sanity_dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    resend_configured: !!process.env.RESEND_API_KEY,
    test_email: process.env.TEST_EMAIL || "victor.dmaina@gmail.com",
    instructions: [
      "1. Go to Sanity Console → API → Webhooks",
      "2. Verify webhook URL points to: https://daimamkenyaafrica.com/api/notify-customers",
      "3. Ensure webhook triggers on 'create' and 'update' for 'productBatch'",
      "4. Check that webhook secret matches SANITY_WEBHOOK_SECRET in .env",
    ],
  });
}
