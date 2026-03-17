// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { client } from "@/sanity/lib/client";
import { generateSanityKey } from "@/lib/utils/sanity";

const resend = new Resend(process.env.RESEND_API_KEY);

const subjectTemplates: Record<string, string> = {
  general: "General Enquiry",
  order: "Order / Shipment Query",
  wholesale: "Wholesale / Bulk Order Enquiry",
  partnership: "Partnership / Media Enquiry",
  support: "Account / Support Request",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, phone, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const subjectLine = subjectTemplates[subject] || "Contact Form Submission";

    // Prepare email content with newsletter styling
    const baseUrl = (
      process.env.NEXT_PUBLIC_BASE_URL || "https://daimamkenyaafrica.com"
    ).replace(/\/$/, "");

    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        </head>
        <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Times New Roman', Times, serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff;">
            <tr>
              <td align="center" style="padding: 60px 20px;">
                <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #eeeeee;" cellspacing="0" cellpadding="0" border="0">
                  <tr><td height="4" style="background-color: #be1e2d;"></td></tr>
                  <tr>
                    <td style="padding: 60px 40px 40px 40px;">
                      <h1 style="margin: 0 0 15px 0; color: #000000; font-size: 32px; line-height: 1.2; font-weight: normal; text-align: center; text-transform: uppercase; letter-spacing: 0.05em;">
                        New Contact Form Submission
                      </h1>
                      <div style="width: 60px; height: 1px; background-color: #be1e2d; margin: 25px auto;"></div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 40px 40px 40px;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px;">
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                            <span style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; display: inline-block; width: 100px;">Name:</span>
                            <span style="color: #000000; font-size: 15px; letter-spacing: 0.02em; margin-left: 20px;">${name}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                            <span style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; display: inline-block; width: 100px;">Email:</span>
                            <span style="color: #000000; font-size: 15px; letter-spacing: 0.02em; margin-left: 20px;">${email}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                            <span style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; display: inline-block; width: 100px;">Subject:</span>
                            <span style="color: #000000; font-size: 15px; letter-spacing: 0.02em; margin-left: 20px;">${subjectLine}</span>
                          </td>
                        </tr>
                        ${
                          phone
                            ? `
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                            <span style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; display: inline-block; width: 100px;">Phone:</span>
                            <span style="color: #000000; font-size: 15px; letter-spacing: 0.02em; margin-left: 20px;">${phone}</span>
                          </td>
                        </tr>
                        `
                            : ""
                        }
                      </table>

                      <div style="margin-top: 30px;">
                        <p style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 10px;">Message:</p>
                        <div style="background-color: #f9f9f9; padding: 25px; border-left: 3px solid #be1e2d;">
                          <p style="margin: 0; color: #444444; font-size: 15px; line-height: 1.8; letter-spacing: 0.02em; font-style: italic;">
                            "${message.replace(/\n/g, "<br/>")}"
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 40px 40px 40px; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0; color: #999999; font-size: 11px; text-align: center; text-transform: uppercase; letter-spacing: 0.2em;">
                        Sent: ${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi", hour12: true, hour: "2-digit", minute: "2-digit", day: "2-digit", month: "long", year: "numeric" })} (EAT)
                      </p>
                    </td>
                  </tr>
                  <tr><td height="2" style="background-color: #be1e2d;"></td></tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Daima Mkenya Africa <info@daimamkenyaafrica.com>",
      to: ["info@daimamkenyaafrica.com"],
      replyTo: email,
      subject: `Contact Form: ${subjectLine} - ${name}`,
      html: emailContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    // Store in Sanity with empty notes array (will be populated later via admin)
    try {
      await client.create({
        _type: "contactSubmission",
        name,
        email,
        phone: phone || "",
        subject,
        subjectLabel: subjectLine,
        message,
        status: "new",
        submittedAt: new Date().toISOString(),
        notes: [], // Initialize empty notes array
      });
    } catch (sanityError) {
      console.error("Failed to store in Sanity:", sanityError);
      // Don't fail the request if Sanity storage fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        id: data?.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
