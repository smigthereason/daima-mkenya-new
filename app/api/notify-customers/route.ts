import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-03-10",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Function to generate the email HTML with white background and product cards
function generateEmailHTML(batchName: string, products: any[]) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>New Collection: ${batchName}</title>
  <style>
    /* Reset styles */
    body, table, td, p, a, div, span {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }

    /* Force white background */
    body, html {
      background-color: #ffffff !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      margin: 0;
      padding: 0;
      width: 100% !important;
    }

    /* Email container */
    .email-wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #ffffff !important;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff !important;
      padding: 20px;
    }

    /* Typography - matching ProductGrid.tsx */
    .product-category {
      font-size: 10px;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: #999999;
      font-weight: 700;
      margin-bottom: 6px;
      display: block;
    }

    .product-name {
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #111111;
      line-height: 1.3;
      margin: 6px 0 4px 0;
      text-decoration: none;
    }

    .product-price {
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.1em;
      color: #111111;
      margin: 4px 0;
    }

    .section-title {
      font-size: 11px;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      color: #999999;
      font-weight: 700;
      margin-bottom: 15px;
      text-align: center;
      display: block;
    }

    .collection-title {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #111111;
      text-align: center;
      margin: 15px 0 8px 0;
    }

    /* Product grid layout - improved responsive sizing */
    .product-grid {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    .product-card {
      width: 50%;
      padding: 10px;
      vertical-align: top;
    }

    /* Image container - optimized size for email */
    .image-container {
      width: 100%;
      padding-bottom: 125%; /* Slightly less tall than 4:3 for better email viewing */
      position: relative;
      background-color: #F9F9F9;
      margin-bottom: 12px;
      border: 1px solid #f0f0f0;
    }

    .product-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 15px;
      box-sizing: border-box;
    }

    /* Color swatches */
    .color-swatches {
      margin-top: 8px;
      text-align: center;
    }

    .color-swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin: 0 3px;
      border: 1px solid rgba(0,0,0,0.1);
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    /* Buttons */
    .shop-button {
      display: inline-block;
      background-color: #111111;
      color: #ffffff !important;
      padding: 14px 30px;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      text-decoration: none;
      border: 2px solid #111111;
      margin: 15px 0;
    }

    /* Divider */
    .divider {
      height: 2px;
      background-color: #e0e0e0;
      width: 40px;
      margin: 30px auto;
    }

    /* Footer */
    .footer-text {
      font-size: 10px;
      color: #999999;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      text-align: center;
      margin: 20px 0 8px 0;
    }

    /* Responsive improvements */
    @media screen and (max-width: 480px) {
      .email-container {
        padding: 15px !important;
      }

      .product-card {
        width: 100% !important;
        display: block;
        padding: 8px 0 !important;
      }

      .product-grid, .product-grid tbody, .product-grid tr {
        display: block;
        width: 100%;
      }

      .collection-title {
        font-size: 18px;
        letter-spacing: 0.15em;
      }

      .image-container {
        max-width: 280px;
        margin-left: auto;
        margin-right: auto;
        padding-bottom: 115%;
      }

      .product-category {
        font-size: 9px;
        letter-spacing: 0.3em;
      }

      .product-name {
        font-size: 12px;
      }

      .product-price {
        font-size: 13px;
      }

      .shop-button {
        padding: 12px 24px;
        font-size: 10px;
      }
    }

    /* Desktop fine-tuning */
    @media screen and (min-width: 481px) {
      .product-card {
        padding: 12px;
      }

      .image-container {
        padding-bottom: 120%;
      }
    }
  </style>
</head>
<body style="background-color: #ffffff; margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif;">
  <div class="email-wrapper" style="background-color: #ffffff; width: 100%;">
    <div class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">

      <!-- Header Section -->
      <div style="text-align: center; padding: 30px 0 15px 0; border-bottom: 2px solid #e0e0e0;">
        <span class="section-title" style="font-size: 11px; letter-spacing: 0.5em; color: #999999; font-weight: 700; display: block; margin-bottom: 12px;">
          THE SELECTION
        </span>
        <h1 class="collection-title" style="font-size: 22px; font-weight: 900; letter-spacing: 0.2em; color: #111111; text-transform: uppercase; margin: 0 0 8px 0;">
          ${batchName}
        </h1>
        <p style="font-size: 11px; color: #666666; letter-spacing: 0.1em; margin: 8px 0;">
          A first look at our newest additions
        </p>
      </div>

      <!-- Product Grid -->
      <table class="product-grid" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        ${products
          ?.map((product, index) => {
            // Close previous row and open new row every 2 products
            const isEven = index % 2 === 0;
            const isOdd = index % 2 === 1;
            const isLast = index === products.length - 1;

            let html = "";

            // Start new row for even-indexed products
            if (isEven) {
              html += "<tr>";
            }

            // Generate color swatches HTML from product.colors
            const colorSwatches =
              product.colors && product.colors.length > 0
                ? product.colors
                    .slice(0, 4)
                    .map(
                      (color: any) =>
                        `<span class="color-swatch" style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin: 0 3px; background-color: ${color.hex || "#000000"}; border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 1px 2px rgba(0,0,0,0.1);"></span>`,
                    )
                    .join("")
                : '<span class="color-swatch" style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin: 0 3px; background-color: #000000; border: 1px solid rgba(0,0,0,0.1);"></span>';

            // Add product card
            html += `
              <td class="product-card" style="width: 50%; padding: 12px; vertical-align: top; background-color: #ffffff;" bgcolor="#ffffff">
                <div style="background-color: #ffffff;">
                  <!-- Image Container -->
                  <a href="https://daimamkenyaafrica.com/products/${product.slug}" style="text-decoration: none; display: block;">
                    <div class="image-container" style="width: 100%; padding-bottom: 120%; position: relative; background-color: #F9F9F9; margin-bottom: 12px; border: 1px solid #f0f0f0;">
                      ${
                        product.imageUrl
                          ? `<img src="${product.imageUrl}" alt="${product.name}" class="product-image" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; padding: 15px; box-sizing: border-box;" />`
                          : ""
                      }
                    </div>
                  </a>

                  <!-- Product Info -->
                  <div style="text-align: center;">
                    <span class="product-category" style="font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #999999; font-weight: 700; display: block; margin-bottom: 6px;">
                      ${product.category || "NEW ARRIVAL"}
                    </span>
                    <a href="https://daimamkenyaafrica.com/products/${product.slug}" style="text-decoration: none;">
                      <h3 class="product-name" style="font-size: 13px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: #111111; line-height: 1.3; margin: 6px 0 4px 0;">
                        ${product.name}
                      </h3>
                    </a>
                    <p class="product-price" style="font-size: 14px; font-weight: 500; letter-spacing: 0.1em; color: #111111; margin: 4px 0;">
                      KSH ${product.price}
                    </p>
                  </div>

                  <!-- Color Swatches -->
                  <div class="color-swatches" style="margin-top: 8px; text-align: center;">
                    ${colorSwatches}
                  </div>
                </div>
              </td>
            `;

            // Close row for odd-indexed products or if last product
            if (isOdd || isLast) {
              html += "</tr>";
            }

            return html;
          })
          .join("")}
      </table>

      <!-- Divider -->
      <div class="divider" style="height: 2px; background-color: #e0e0e0; width: 40px; margin: 30px auto;"></div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://daimamkenyaafrica.com/products" class="shop-button" style="display: inline-block; background-color: #111111; color: #ffffff !important; padding: 14px 30px; font-size: 11px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; text-decoration: none; border: 2px solid #111111;">
          SHOP THE COLLECTION
        </a>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px 0 15px 0; border-top: 1px solid #e0e0e0;">
        <p class="footer-text" style="font-size: 10px; color: #999999; letter-spacing: 0.2em; text-transform: uppercase; margin: 5px 0;">
          Daima Mkenya · Nairobi, Kenya
        </p>
        <p style="font-size: 9px; color: #cccccc; margin: 8px 0;">
          © ${new Date().getFullYear()} Daima Mkenya. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function POST(req: Request) {
  try {
    // Parse the webhook payload
    const body = await req.json();
    console.log("=".repeat(50));
    console.log("🔔 WEBHOOK RECEIVED");
    console.log("=".repeat(50));
    console.log("Batch ID:", body._id);
    console.log("Batch Name:", body.batchName);
    console.log("Trigger Email:", body.triggerEmail);
    console.log("Email Already Sent:", body.emailSent);
    console.log("Timestamp:", new Date().toISOString());

    // Verify webhook signature
    const signature = req.headers.get(SIGNATURE_HEADER_NAME);
    const secret = process.env.SANITY_WEBHOOK_SECRET!;

    if (
      !signature ||
      !isValidSignature(JSON.stringify(body), signature, secret)
    ) {
      console.log("❌ Invalid signature - Unauthorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log("✅ Signature verified successfully");

    // Check if we should trigger the email
    if (!body.triggerEmail) {
      console.log("⏭️ Skipping - triggerEmail is false, no action needed");
      return NextResponse.json({
        message: "Not triggered - triggerEmail is false",
      });
    }

    if (body.emailSent) {
      console.log("⏭️ Skipping - email already sent for this batch");
      return NextResponse.json({
        message: "Not triggered - email already sent",
      });
    }

    console.log("📊 Fetching paid customers from orders...");

    // Fetch unique emails from paid orders
    const paidOrders = await client.fetch(`
      *[_type == "order" && paymentStatus == "paid" && defined(customer.email)] {
        "email": customer.email
      }
    `);

    console.log(`📧 Found ${paidOrders.length} paid order records`);

    // Extract unique emails (customers with multiple orders get one email)
    const emails = [...new Set(paidOrders.map((order: any) => order.email))];
    console.log(`👥 Unique customer emails: ${emails.length}`);

    if (emails.length > 0) {
      console.log("Sample emails:", emails.slice(0, 3));
    }

    // Handle case with no customers
    if (emails.length === 0) {
      console.log("⚠️ No customers with paid orders found");

      // Update batch to show no recipients found
      await client
        .patch(body._id)
        .set({
          emailSent: false,
          sentAt: new Date().toISOString(),
          triggerEmail: false,
          recipientCount: 0,
          emailError: "No paid customers found",
        })
        .commit();

      console.log("✅ Batch updated - no recipients found");

      return NextResponse.json({
        success: false,
        message: "No customers with paid orders found.",
      });
    }

    // Fetch batch details with product information including slug, category, and colors
    console.log("📦 Fetching batch details for ID:", body._id);
    const batchData = await client.fetch(
      `*[_id == $id][0] {
        batchName,
        products[]->{
          name,
          price,
          category,
          "slug": slug.current,
          "imageUrl": images.hero.asset->url,
          colors[] {
            hex,
            name
          }
        }
      }`,
      { id: body._id },
    );

    if (!batchData) {
      console.log("❌ Batch data not found");

      await client
        .patch(body._id)
        .set({
          emailError: "Batch data not found",
          triggerEmail: false,
        })
        .commit();

      return NextResponse.json(
        { error: "Batch data not found" },
        { status: 404 },
      );
    }

    console.log("✅ Batch data retrieved:", batchData.batchName);
    console.log(`📦 Products in batch: ${batchData.products?.length || 0}`);

    // Send email blast to all paid customers
    console.log(`🚀 Sending email blast to ${emails.length} customers...`);
    console.log("Email subject:", `New Collection: ${batchData.batchName}`);

    // Generate the email HTML with product cards
    const emailHTML = generateEmailHTML(
      batchData.batchName,
      batchData.products || [],
    );

    const { data, error } = await resend.emails.send({
      from: "Daima Mkenya <info@daimamkenyaafrica.com>",
      to: emails as string[],
      subject: `New Collection: ${batchData.batchName}`,
      html: emailHTML,
    });

    // Handle Resend API error
    if (error) {
      console.error("❌ Resend API error:", error);

      // Update batch with error
      await client
        .patch(body._id)
        .set({
          emailSent: false,
          sentAt: new Date().toISOString(),
          triggerEmail: false,
          recipientCount: emails.length,
          emailError: error.message,
        })
        .commit();

      console.log("✅ Batch updated with error status");

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          recipientCount: emails.length,
        },
        { status: 500 },
      );
    }

    // Success! Update batch with sent status
    console.log("✅ Email blast sent successfully!");
    console.log("Resend response:", data);

    await client
      .patch(body._id)
      .set({
        emailSent: true,
        sentAt: new Date().toISOString(),
        triggerEmail: false,
        recipientCount: emails.length,
      })
      .commit();

    console.log("✅ Sanity document updated with emailSent: true");
    console.log("=".repeat(50));
    console.log("🎉 BATCH COMPLETE");
    console.log("=".repeat(50));

    return NextResponse.json({
      success: true,
      count: emails.length,
      message: `Email blast sent to ${emails.length} customers`,
      batchId: body._id,
      batchName: batchData.batchName,
      sentAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("💥 CRITICAL ERROR IN WEBHOOK:");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);

    // Try to update the batch with error if we have the ID
    try {
      const body = await req.json().catch(() => ({}));
      if (body._id) {
        await client
          .patch(body._id)
          .set({
            emailSent: false,
            sentAt: new Date().toISOString(),
            triggerEmail: false,
            emailError: err.message.substring(0, 200),
          })
          .commit();
        console.log("✅ Batch updated with critical error");
      }
    } catch (patchErr) {
      console.error("Failed to update batch with error:", patchErr);
    }

    return NextResponse.json(
      {
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 },
    );
  }
}

// Add GET handler for testing
export async function GET() {
  return NextResponse.json({
    message: "Notify customers endpoint is running",
    status: "active",
    webhook_url: "https://daimamkenyaafrica.com/api/notify-customers",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasSanityToken: !!process.env.SANITY_WRITE_TOKEN,
  });
}
