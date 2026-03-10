// app/api/notify-customers/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-03-10",
  token: process.env.SANITY_WRITE_TOKEN, // Needs 'Write' permissions
  useCdn: false,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const signature = req.headers.get(SIGNATURE_HEADER_NAME);
    const secret = process.env.SANITY_WEBHOOK_SECRET!;

    if (
      !signature ||
      !isValidSignature(JSON.stringify(body), signature, secret)
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch unique emails from your existing 'order' documents
    const customers = await client.fetch(`
      *[_type == "order" && defined(customer.email)] { "email": customer.email }
    `);

    const emails = [...new Set(customers.map((c: any) => c.email))];

    if (emails.length > 0) {
      // TODO: Integration with your email provider (Resend, Postmark, etc.) goes here
      console.log(`Simulating email to: ${emails.length} customers`);

      // Update the batch so it doesn't trigger again
      await client
        .patch(body._id)
        .set({
          emailSent: true,
          sentAt: new Date().toISOString(),
          triggerEmail: false,
        })
        .commit();
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
