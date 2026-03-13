import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-03-10",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return new NextResponse(
        `<html>
          <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Times New Roman', Times, serif; display: flex; align-items: center; justify-content: center; height: 100vh;">
            <div style="text-align: center; border: 1px solid #f0f0f0; padding: 60px; max-width: 400px;">
              <h2 style="color: #be1e2d; text-transform: uppercase; letter-spacing: 0.3em; font-size: 14px; margin: 0 0 20px 0;">Identification Required</h2>
              <p style="color: #666; font-size: 14px; margin-bottom: 30px;">No email address was provided for this request.</p>
              <a href="/" style="color: #000; text-decoration: none; border-bottom: 1px solid #000; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">Return to Home</a>
            </div>
          </body>
        </html>`,
        {
          status: 400,
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    const subscriber = await client.fetch(
      `*[_type == "newsletter" && email == $email][0]`,
      { email },
    );

    if (subscriber) {
      await client
        .patch(subscriber._id)
        .set({
          unsubscribedAt: new Date().toISOString(),
          status: "unsubscribed",
          isActive: false,
        })
        .commit();

      console.log(
        `✅ Unsubscribed: ${email} - Status set to unsubscribed, isActive: false`,
      );
    } else {
      console.log(`❌ Subscriber not found: ${email}`);
    }

    // High-End White Confirmation Page
    return new NextResponse(
      `<html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Membership Updated | Daima Mkenya</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Times New Roman', Times, serif;">
          <table role="presentation" width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; position: absolute; top: 0; left: 0; right: 0; bottom: 0;">
            <tr>
              <td align="center" valign="middle" style="padding: 20px;">

                <table role="presentation" width="100%" style="max-width: 500px; background-color: #ffffff; border: 1px solid #f2f2f2; box-shadow: 0 20px 50px rgba(0,0,0,0.03);" cellspacing="0" cellpadding="0" border="0">

                  <tr>
                    <td height="4" style="background-color: #be1e2d;"></td>
                  </tr>

                  <tr>
                    <td style="padding: 60px 40px;">

                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td align="center" style="padding-bottom: 40px;">
                            <p style="margin: 0; color: #000000; font-size: 12px; letter-spacing: 0.8em; text-transform: uppercase; font-weight: bold;">
                              DAIMA MKENYA
                            </p>
                          </td>
                        </tr>
                      </table>

                      <h1 style="margin: 0; color: #000000; font-size: 34px; line-height: 1.1; font-weight: normal; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #f2f2f2; padding-bottom: 30px;">
                        Profile <br/>
                        <span style="color: #be1e2d; font-style: italic;">Updated</span>
                      </h1>

                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="padding: 40px 0 30px;">
                            <p style="margin: 0; color: #666666; font-size: 15px; line-height: 1.8; text-align: center;">
                              The address <span style="color: #000000; font-weight: bold;">${email}</span> has been successfully removed from our editorial mailing list.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td align="center">
                            <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://daimamkenyaafrica.com"}"
                               style="display: inline-block; background-color: #000000; color: #ffffff; padding: 18px 50px; text-decoration: none; font-size: 10px; font-weight: bold; letter-spacing: 0.5em; text-transform: uppercase;">
                              Return Home
                            </a>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 50px; border-top: 1px solid #f2f2f2; padding-top: 25px;">
                        <tr>
                          <td style="text-align: center;">
                            <p style="margin: 0; color: #aaaaaa; font-size: 8px; text-transform: uppercase; letter-spacing: 0.2em;">
                              Daima Mkenya Africa &bull; Est. 2026
                            </p>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      },
    );
  } catch (error) {
    console.error("Unsubscribe error:", error);

    return new NextResponse(
      `<html>
        <body style="font-family: 'Times New Roman', serif; background: #ffffff; color: #000; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="text-align: center; max-width: 400px; padding: 40px; border: 1px solid #f0f0f0;">
            <h2 style="color: #be1e2d; text-transform: uppercase; letter-spacing: 0.2em; font-size: 14px;">Process Error</h2>
            <p style="color: #666; font-size: 14px; margin: 20px 0;">We were unable to process your request at this time. Please try again later.</p>
            <a href="/" style="color: #000; text-decoration: none; border-bottom: 1px solid #000; padding-bottom: 2px; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;">Back to Store</a>
          </div>
        </body>
      </html>`,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      },
    );
  }
}
