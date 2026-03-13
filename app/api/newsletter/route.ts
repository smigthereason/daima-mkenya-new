import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-03-10",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 },
      );
    }

    // Check if already subscribed
    const existing = await client.fetch(
      `*[_type == "newsletter" && email == $email][0]`,
      { email },
    );

    if (existing) {
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 200 },
      );
    }

    // Save to Sanity
    await client.create({
      _type: "newsletter",
      email,
      subscribedAt: new Date().toISOString(),
      source: "website_footer",
    });

    // High-End White Editorial Welcome Email
    await resend.emails.send({
      from: "Daima Mkenya <info@daimamkenyaafrica.com>",
      to: email,
      subject: "A New Standard of Heritage",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Times New Roman', Times, serif;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff;">
              <tr>
                <td align="center" style="padding: 60px 20px;">
                  <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #eeeeee;" cellspacing="0" cellpadding="0" border="0">

                    <tr>
                      <td height="4" style="background-color: #be1e2d;"></td>
                    </tr>

                    <tr>
                      <td style="padding: 80px 40px;">

                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td align="center" style="padding-bottom: 60px;">
                              <p style="margin: 0; color: #000000; font-size: 15px; letter-spacing: 0.9em; text-transform: uppercase; font-weight: bold;">
                                DAIMA MKENYA AFRICA
                              </p>

                            </td>
                          </tr>
                        </table>

                        <h1 style="margin: 0; color: #000000; font-size: 42px; line-height: 0.95; font-weight: normal; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #f5f5f5; padding-bottom: 40px;">
                          Welcome to <br/>
                          <span>DAIMA MKENYA AFRICA</span>
                        </h1>

                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="padding: 50px 0;">
                              <p style="margin: 0 auto; color: #444444; font-size: 16px; line-height: 1.8; text-align: center; letter-spacing: 0.02em; max-width: 450px;">
                              Thank you for subscribing to our newsletter. You'll now receive updates on new collections, exclusive offers, and events.
                              </p>
                            </td>
                          </tr>
                        </table>

                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td align="center">
                              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/products"
                                 style="display: inline-block; background-color: #000000; color: #ffffff; padding: 22px 60px; text-decoration: none; font-size: 11px; font-weight: bold; letter-spacing: 0.5em; text-transform: uppercase;">
                                SHOP FULL COLLECTION
                              </a>
                            </td>
                          </tr>
                        </table>

                        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 100px; border-top: 1px solid #f5f5f5; padding-top: 30px;">
                          <tr>
                            <td style="text-align: left;">
                              <p style="margin: 0; color: #999999; font-size: 9px; text-transform: uppercase; letter-spacing: 0.3em;">Est. 2026</p>
                            </td>
                            <td style="text-align: right;">
                              <p style="margin: 0; color: #999999; font-size: 9px; text-transform: uppercase; letter-spacing: 0.3em;">@DaimaMkenyaAfrica</p>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 0 40px 60px 40px; text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}"
                           style="color: #bcbcbc; font-size: 9px; text-decoration: underline; text-transform: uppercase; letter-spacing: 0.2em;">
                          UNSUBSCRIBE FROM NEWSLETTER
                        </a>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Successfully subscribed!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
