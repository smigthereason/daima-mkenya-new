// app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: "Daima Mkenya <info@daimamkenyaafrica.com>",
      to: [process.env.TEST_EMAIL || "victor.dmaina@gmail.com"],
      subject: "Test Email - Daima Mkenya",
      html: "<p>Verification test from info@daimamkenyaafrica.com</p>",
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
