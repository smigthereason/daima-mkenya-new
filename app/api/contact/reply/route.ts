import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getActiveLogo, urlFor } from "@/lib/sanity/logo";


export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = Boolean(
      (session?.user as { isAdmin?: boolean } | undefined)?.isAdmin,
    );

    if (!session?.user || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { to, name, subject, message, originalMessage } = body;

    if (!to || !name || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

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
                  <!-- Red accent bar -->
                  <tr>
                    <td height="4" style="background-color: #be1e2d;"></td>
                  </tr>

                  <!-- Logo section -->
                  <tr>
                    <td style="padding: 60px 40px 40px 40px;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td align="center" style="padding-bottom: 20px;">
                            <img src="${logoUrl}"
                                 alt="${logoAlt}"
                                 width="180"
                                 style="display: block; width: 180px; height: auto; margin: 0 auto; border: 0;" />
                          </td>
                        </tr>
                      </table>

                      <!-- Subject line as header -->
                      <h1 style="margin: 0 0 15px 0; color: #000000; font-size: 28px; line-height: 1.2; font-weight: normal; text-align: center; text-transform: uppercase; letter-spacing: 0.05em;">
                        ${subject}
                      </h1>

                      <!-- Thin divider -->
                      <div style="width: 60px; height: 1px; background-color: #be1e2d; margin: 25px auto;"></div>
                    </td>
                  </tr>

                  <!-- Main content -->
                  <tr>
                    <td style="padding: 0 40px 40px 40px;">
                      <!-- Salutation -->
                      <p style="margin: 0 0 25px 0; color: #000000; font-size: 16px; line-height: 1.6; letter-spacing: 0.02em;">
                        Dear ${name},
                      </p>

                      <!-- Message body -->
                      <div style="margin: 30px 0;">
                        <p style="margin: 0 0 20px 0; color: #444444; font-size: 15px; line-height: 1.8; letter-spacing: 0.02em;">
                          ${message.replace(/\n/g, "</p><p style='margin: 0 0 20px 0; color: #444444; font-size: 15px; line-height: 1.8; letter-spacing: 0.02em;'>")}
                        </p>
                      </div>

                      ${
                        originalMessage
                          ? `<!-- Original message block -->
                      <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 40px 0;">
                        <tr>
                          <td style="background-color: #f9f9f9; padding: 25px; border-left: 3px solid #be1e2d;">
                            <p style="margin: 0 0 10px 0; color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: normal;">
                              YOUR ORIGINAL MESSAGE
                            </p>
                            <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6; font-style: italic; letter-spacing: 0.02em;">
                              "${originalMessage.replace(/\n/g, "<br/>")}"
                            </p>
                          </td>
                        </tr>
                      </table>`
                          : ""
                      }

                      <!-- Signature -->
                      <div style="margin-top: 50px;">
                        <p style="margin: 0 0 5px 0; color: #000000; font-size: 15px; line-height: 1.6; letter-spacing: 0.02em;">
                          Warm regards,
                        </p>
                        <p style="margin: 0; color: #000000; font-size: 16px; line-height: 1.6; font-weight: bold; letter-spacing: 0.02em;">
                          Daima Mkenya Africa
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer with contact details -->
                  <tr>
                    <td style="padding: 30px 40px 40px 40px; border-top: 1px solid #eeeeee;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td align="center" style="padding-bottom: 20px;">
                            <p style="margin: 0; color: #999999; font-size: 11px; line-height: 1.8; text-transform: uppercase; letter-spacing: 0.2em;">
                              P.O Box 63023, 00200 • Nairobi, Kenya
                            </p>
                            <p style="margin: 5px 0 0 0; color: #999999; font-size: 11px; line-height: 1.8; text-transform: uppercase; letter-spacing: 0.2em;">
                              <a href="tel:+254721888887" style="color: #999999; text-decoration: none;">+254 721 888 887</a>
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding-top: 15px;">
                            <a href="${baseUrl}"
                               style="color: #666666; font-size: 10px; text-decoration: underline; text-transform: uppercase; letter-spacing: 0.2em;">
                              VISIT OUR WEBSITE
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Small red accent at bottom -->
                  <tr>
                    <td height="2" style="background-color: #be1e2d;"></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const info = await sendEmail({
      to,
      replyTo: "info@daimamkenyaafrica.com",
      subject,
      html: emailContent,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Reply sent successfully",
        id: info.messageId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reply email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
