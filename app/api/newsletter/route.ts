// app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { sendEmail } from "@/lib/email";
import { getActiveLogo, urlFor } from "@/lib/sanity/logo";


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

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 },
      );
    }

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

    await client.create({
      _type: "newsletter",
      email,
      subscribedAt: new Date().toISOString(),
      source: "website_footer",
    });

    // Normalized Base URL
    const baseUrl = (
      process.env.NEXT_PUBLIC_BASE_URL || "https://daimamkenyaafrica.com"
    ).replace(/\/$/, "");

    // Get active logo from Sanity
    const activeLogo = await getActiveLogo();
    const logoUrl = activeLogo?.imageUrl
      ? urlFor(activeLogo.imageUrl).width(200).url()
      : `${baseUrl}/assets/Logo_no-bg.png`; // Fallback to local asset

    const logoAlt = activeLogo?.alt || "Daima Mkenya Africa Logo";

    await sendEmail({
      to: email,
      subject: "A New Standard of Heritage",
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head>
          <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Times New Roman', Times, serif;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff;">
              <tr>
                <td align="center" style="padding: 60px 20px;">
                  <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #eeeeee;" cellspacing="0" cellpadding="0" border="0">
                    <tr><td height="4" style="background-color: #be1e2d;"></td></tr>
                    <tr>
                      <td style="padding: 80px 40px;">
                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td align="center" style="padding-bottom: 60px;">
                              <img src="${logoUrl}"
                                   alt="${logoAlt}"
                                   width="200"
                                   quality="100"
                                   priority
                                   style="display: block; width: 200px; height: auto; margin: 0 auto; border: 0;" />
                            </td>
                          </tr>
                        </table>
                        <h1 style="margin: 0 0 30px 0; color: #000000; font-size: 42px; line-height: 1.1; font-weight: normal; text-align: center; text-transform: uppercase; letter-spacing: 0.05em;">
                          Welcome to <br/>
                          <span style="display: inline-block; margin-top: 10px;">DAIMA MKENYA AFRICA</span>
                        </h1>
                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="padding: 20px 0 40px;">
                              <p style="margin: 0 auto; color: #444444; font-size: 16px; line-height: 1.8; text-align: center; letter-spacing: 0.02em; max-width: 450px;">
                                Thank you for subscribing to our newsletter. You'll now receive updates on new collections, exclusive offers, and events.
                              </p>
                            </td>
                          </tr>
                        </table>
                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td align="center">
                              <a href="${baseUrl}/products"
                                 style="display: inline-block; background-color: #000000; color: #ffffff; padding: 22px 60px; text-decoration: none; font-size: 11px; font-weight: bold; letter-spacing: 0.5em; text-transform: uppercase;">
                                SHOP FULL COLLECTION
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 40px 60px 40px; text-align: center;">
                        <a href="${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}"
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
        </html>`,
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
