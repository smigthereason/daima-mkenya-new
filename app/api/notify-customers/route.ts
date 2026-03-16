import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { Resend } from "resend";
import { getActiveLogo, urlFor as getLogoUrl } from "@/lib/sanity/logo";

const resend = new Resend(process.env.RESEND_API_KEY);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-03-10",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

function generateEmailHTML(
  batchName: string,
  products: any[],
  logoUrl: string,
  logoAlt: string,
) {
  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || "https://daimamkenyaafrica.com"
  ).replace(/\/$/, "");

  const renderProductCard = (product: any) => {
    const productUrl = `${baseUrl}/products/${product.slug}`;

    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout: fixed;">
        <tr>
          <td style="padding-bottom: 40px;">
            <a href="${productUrl}" style="text-decoration: none; display: block; color: #000000;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e0e0e0; background-color: #ffffff;">
                <tr>
                  <td align="center" valign="middle" style="height: 350px;">
                    ${
                      product.imageUrl
                        ? `<img src="${product.imageUrl}" alt="${product.name}" width="100%" style="display: block; width: 100%; height: 350px; object-fit: cover;" />`
                        : `<div style="height: 350px; width: 100%; background-color: #F2F2F2;"></div>`
                    }
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 15px;">
                    <p style="margin: 0 0 8px 0; font-family: 'Playfair Display', 'Times New Roman', serif; font-size: 9px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.3em; color: #888888;">
                      ${product.category || "NEW ARRIVAL"}
                    </p>
                    <h3 style="margin: 0 0 6px 0; font-family: 'Playfair Display', 'Times New Roman', serif; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #000000; line-height: 1.2;">
                      ${product.name}
                    </h3>
                    <p style="margin: 0 0 15px 0; font-family: 'Playfair Display', 'Times New Roman', serif; font-size: 13px; font-weight: 400; color: #000000;">
                      ${product.price}
                    </p>
                    <div>
                      ${
                        product.colors && product.colors.length > 0
                          ? product.colors
                              .slice(0, 4)
                              .map(
                                (color: any) => `
                            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; background-color: ${color.hex} !important; border: 1px solid #e0e0e0;"></span>
                          `,
                              )
                              .join("")
                          : ""
                      }
                    </div>
                  </td>
                </tr>
              </table>
            </a>
          </td>
        </tr>
      </table>
    `;
  };

  let gridHTML = "";
  for (let i = 0; i < products.length; i += 2) {
    gridHTML += `
      <tr>
        <td width="50%" valign="top" style="padding: 0 10px;">
          ${renderProductCard(products[i])}
        </td>
        <td width="50%" valign="top" style="padding: 0 10px;">
          ${products[i + 1] ? renderProductCard(products[i + 1]) : ""}
        </td>
      </tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap" rel="stylesheet">
      <title>${batchName}</title>
      <style>
        body, table, td, a, p, h1, h3 {
          font-family: 'Playfair Display', 'Times New Roman', serif !important;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #e8e8e8; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e8e8e8;">
        <tr>
          <td align="center" style="padding: 60px 0;">
            <table width="640" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; width: 640px; margin: 0 auto; border-radius: 2px;">

              <tr>
                <td align="center" style="padding: 60px 0 60px 0;">
                  <img src="${logoUrl}" alt="${logoAlt}" width="160" style="display: block; width: 160px; height: auto;" />
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 0 30px 60px 30px;">
                  <p style="margin: 0 0 15px 0; font-size: 10px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.6em; color: #999999;">
                    The Selection
                  </p>
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3em; color: #000000;">
                    ${batchName}
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${gridHTML}
                  </table>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 40px 0 100px 0;">
                  <a href="${baseUrl}/products" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 22px 65px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4em; text-decoration: none;">
                    Explore All Pieces
                  </a>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 40px 20px; border-top: 1px solid #f0f0f0;">
                  <p style="margin: 0; font-size: 10px; color: #999999; text-transform: uppercase; letter-spacing: 0.3em; font-weight: 400;">
                    Daima Mkenya &middot; Nairobi, Kenya
                  </p>
                  <p style="margin: 15px 0 0 0; font-size: 9px; color: #bbbbbb; text-transform: uppercase; letter-spacing: 0.1em;">
                    &copy; ${new Date().getFullYear()} All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

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

    if (!body.triggerEmail || body.emailSent) {
      await client.patch(body._id).set({ triggerEmail: false }).commit();
      return NextResponse.json({ message: "Skipping email trigger" });
    }

    const paidOrders = await client.fetch(
      `*[_type == "order" && paymentStatus == "paid" && defined(customer.email)] { "email": customer.email }`,
    );
    const emails = [...new Set(paidOrders.map((order: any) => order.email))];

    if (emails.length === 0) {
      await client
        .patch(body._id)
        .set({
          emailSent: false,
          triggerEmail: false,
          emailError: "No paid customers",
        })
        .commit();
      return NextResponse.json({
        success: false,
        message: "No customers found",
      });
    }

    const batchData = await client.fetch(
      `*[_id == $id][0] {
        batchName,
        products[]->{
          name, price, category,
          "slug": slug.current,
          "imageUrl": images.hero.asset->url,
          colors[] { hex, name }
        }
      }`,
      { id: body._id },
    );

    const activeLogo = await getActiveLogo();
    const baseUrl = (
      process.env.NEXT_PUBLIC_BASE_URL || "https://daimamkenyaafrica.com"
    ).replace(/\/$/, "");
    const logoUrl = activeLogo?.imageUrl
      ? getLogoUrl(activeLogo.imageUrl).width(200).url()
      : `${baseUrl}/assets/Logo_no-bg.png`;
    const logoAlt = activeLogo?.alt || "Daima Mkenya Africa";

    const emailHTML = generateEmailHTML(
      batchData.batchName,
      batchData.products || [],
      logoUrl,
      logoAlt,
    );

    const { error } = await resend.emails.send({
      from: "Daima Mkenya <info@daimamkenyaafrica.com>",
      to: emails as string[],
      subject: `New Collection: ${batchData.batchName}`,
      html: emailHTML,
    });

    if (error) throw error;

    await client
      .patch(body._id)
      .set({
        emailSent: true,
        sentAt: new Date().toISOString(),
        triggerEmail: false,
        recipientCount: emails.length,
      })
      .commit();

    return NextResponse.json({ success: true, count: emails.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    timestamp: new Date().toISOString(),
  });
}
