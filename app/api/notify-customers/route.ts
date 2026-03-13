// import { NextResponse } from "next/server";
// import { createClient } from "@sanity/client";
// import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// const client = createClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
//   apiVersion: "2026-03-10",
//   token: process.env.SANITY_WRITE_TOKEN,
//   useCdn: false,
// });

// export async function POST(req: Request) {
//   try {
//     // Parse the webhook payload
//     const body = await req.json();
//     console.log("=".repeat(50));
//     console.log("🔔 WEBHOOK RECEIVED");
//     console.log("=".repeat(50));
//     console.log("Batch ID:", body._id);
//     console.log("Batch Name:", body.batchName);
//     console.log("Trigger Email:", body.triggerEmail);
//     console.log("Email Already Sent:", body.emailSent);
//     console.log("Timestamp:", new Date().toISOString());

//     // Verify webhook signature
//     const signature = req.headers.get(SIGNATURE_HEADER_NAME);
//     const secret = process.env.SANITY_WEBHOOK_SECRET!;

//     if (
//       !signature ||
//       !isValidSignature(JSON.stringify(body), signature, secret)
//     ) {
//       console.log("❌ Invalid signature - Unauthorized");
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
//     console.log("✅ Signature verified successfully");

//     // Check if we should trigger the email
//     if (!body.triggerEmail) {
//       console.log("⏭️ Skipping - triggerEmail is false, no action needed");
//       return NextResponse.json({
//         message: "Not triggered - triggerEmail is false",
//       });
//     }

//     if (body.emailSent) {
//       console.log("⏭️ Skipping - email already sent for this batch");
//       return NextResponse.json({
//         message: "Not triggered - email already sent",
//       });
//     }

//     console.log("📊 Fetching paid customers from orders...");

//     // Fetch unique emails from paid orders
//     const paidOrders = await client.fetch(`
//       *[_type == "order" && paymentStatus == "paid" && defined(customer.email)] {
//         "email": customer.email
//       }
//     `);

//     console.log(`📧 Found ${paidOrders.length} paid order records`);

//     // Extract unique emails (customers with multiple orders get one email)
//     const emails = [...new Set(paidOrders.map((order: any) => order.email))];
//     console.log(`👥 Unique customer emails: ${emails.length}`);

//     if (emails.length > 0) {
//       console.log("Sample emails:", emails.slice(0, 3));
//     }

//     // Handle case with no customers
//     if (emails.length === 0) {
//       console.log("⚠️ No customers with paid orders found");

//       // Update batch to show no recipients found
//       await client
//         .patch(body._id)
//         .set({
//           emailSent: false,
//           sentAt: new Date().toISOString(),
//           triggerEmail: false,
//           recipientCount: 0,
//           emailError: "No paid customers found",
//         })
//         .commit();

//       console.log("✅ Batch updated - no recipients found");

//       return NextResponse.json({
//         success: false,
//         message: "No customers with paid orders found.",
//       });
//     }

//     // Fetch batch details with product information
//     console.log("📦 Fetching batch details for ID:", body._id);
//     const batchData = await client.fetch(
//       `*[_id == $id][0] {
//         batchName,
//         products[]->{
//           name,
//           price,
//           "imageUrl": images.hero.asset->url
//         }
//       }`,
//       { id: body._id },
//     );

//     if (!batchData) {
//       console.log("❌ Batch data not found");

//       await client
//         .patch(body._id)
//         .set({
//           emailError: "Batch data not found",
//           triggerEmail: false,
//         })
//         .commit();

//       return NextResponse.json(
//         { error: "Batch data not found" },
//         { status: 404 },
//       );
//     }

//     console.log("✅ Batch data retrieved:", batchData.batchName);
//     console.log(`📦 Products in batch: ${batchData.products?.length || 0}`);

//     // Send test email first to verify configuration (optional but recommended)
//     console.log("🧪 Sending test email to verify configuration...");
//     const testEmail = process.env.TEST_EMAIL || "victor.dmaina@gmail.com";

//     try {
//       const { data: testData, error: testError } = await resend.emails.send({
//         from: "Daima Mkenya <info@daimamkenyaafrica.com>",
//         to: [testEmail],
//         subject: `TEST: New Collection: ${batchData.batchName}`,
//         html: `
//           <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ff0000;">
//             <h2 style="color: #ff0000;">🔧 TEST EMAIL - IGNORE</h2>
//             <p>This is a test to verify email configuration.</p>
//             <p><strong>Batch:</strong> ${batchData.batchName}</p>
//             <p><strong>Would send to:</strong> ${emails.length} customers</p>
//             <p><strong>Products:</strong> ${batchData.products?.length || 0}</p>
//             <hr />
//             <p style="color: #666;">If you received this, email configuration is working!</p>
//           </div>
//         `,
//       });

//       if (testError) {
//         console.error("❌ Test email failed:", testError);
//       } else {
//         console.log("✅ Test email sent successfully to:", testEmail);
//       }
//     } catch (testErr) {
//       console.error("❌ Test email exception:", testErr);
//       // Continue anyway - don't block the main email blast
//     }

//     // Send email blast to all paid customers
//     console.log(`🚀 Sending email blast to ${emails.length} customers...`);
//     console.log("Email subject:", `New Collection: ${batchData.batchName}`);

//     const { data, error } = await resend.emails.send({
//       from: "Daima Mkenya <info@daimamkenyaafrica.com>",
//       to: emails as string[],
//       subject: `New Collection: ${batchData.batchName}`,
//       html: `
//         <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
//           <h1 style="text-align: center; text-transform: uppercase;">${batchData.batchName}</h1>
//           <p style="text-align: center;">We thought you'd like a first look at our newest additions.</p>
//           <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
//           <div style="display: grid; gap: 20px;">
//             ${batchData.products
//               ?.map(
//                 (p: any) => `
//               <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px;">
//                 ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" style="width: 100%; max-height: 300px; object-fit: cover; margin-bottom: 10px;" />` : ""}
//                 <h3 style="margin: 10px 0 5px 0;">${p.name}</h3>
//                 <p style="font-weight: bold; font-size: 18px;">KSH ${p.price}</p>
//               </div>
//             `,
//               )
//               .join("")}
//           </div>
//           <div style="text-align: center; margin-top: 40px;">
//             <a href="https://daimamkenyaafrica.com/products" style="background: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; letter-spacing: 1px; display: inline-block;">SHOP THE COLLECTION</a>
//           </div>
//           <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
//             Daima Mkenya · Nairobi, Kenya
//           </p>
//         </div>
//       `,
//     });

//     // Handle Resend API error
//     if (error) {
//       console.error("❌ Resend API error:", error);

//       // Update batch with error
//       await client
//         .patch(body._id)
//         .set({
//           emailSent: false,
//           sentAt: new Date().toISOString(),
//           triggerEmail: false,
//           recipientCount: emails.length,
//           emailError: error.message,
//         })
//         .commit();

//       console.log("✅ Batch updated with error status");

//       return NextResponse.json(
//         {
//           success: false,
//           error: error.message,
//           recipientCount: emails.length,
//         },
//         { status: 500 },
//       );
//     }

//     // Success! Update batch with sent status
//     console.log("✅ Email blast sent successfully!");
//     console.log("Resend response:", data);

//     await client
//       .patch(body._id)
//       .set({
//         emailSent: true,
//         sentAt: new Date().toISOString(),
//         triggerEmail: false,
//         recipientCount: emails.length,
//       })
//       .commit();

//     console.log("✅ Sanity document updated with emailSent: true");
//     console.log("=".repeat(50));
//     console.log("🎉 BATCH COMPLETE");
//     console.log("=".repeat(50));

//     return NextResponse.json({
//       success: true,
//       count: emails.length,
//       message: `Email blast sent to ${emails.length} customers`,
//       batchId: body._id,
//       batchName: batchData.batchName,
//       sentAt: new Date().toISOString(),
//     });
//   } catch (err: any) {
//     console.error("💥 CRITICAL ERROR IN WEBHOOK:");
//     console.error("Error message:", err.message);
//     console.error("Error stack:", err.stack);

//     // Try to update the batch with error if we have the ID
//     try {
//       const body = await req.json().catch(() => ({}));
//       if (body._id) {
//         await client
//           .patch(body._id)
//           .set({
//             emailSent: false,
//             sentAt: new Date().toISOString(),
//             triggerEmail: false,
//             emailError: err.message.substring(0, 200), // Limit error length
//           })
//           .commit();
//         console.log("✅ Batch updated with critical error");
//       }
//     } catch (patchErr) {
//       console.error("Failed to update batch with error:", patchErr);
//     }

//     return NextResponse.json(
//       {
//         error: err.message,
//         stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//       },
//       { status: 500 },
//     );
//   }
// }

// // Add GET handler for testing
// export async function GET() {
//   return NextResponse.json({
//     message: "Notify customers endpoint is running",
//     status: "active",
//     webhook_url: "https://daimamkenyaafrica.com/api/notify-customers",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV,
//     hasResendKey: !!process.env.RESEND_API_KEY,
//     hasSanityToken: !!process.env.SANITY_WRITE_TOKEN,
//   });
// }
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
    }

    /* Typography - matching ProductGrid.tsx */
    .product-category {
      font-size: 10px;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: #999999;
      font-weight: 700;
      margin-bottom: 8px;
      display: block;
    }

    .product-name {
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #111111;
      line-height: 1.3;
      margin: 8px 0 4px 0;
      min-height: 2.6em;
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
      font-size: 12px;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      color: #999999;
      font-weight: 700;
      margin-bottom: 16px;
      text-align: center;
    }

    .collection-title {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #111111;
      text-align: center;
      margin: 20px 0 10px 0;
    }

    /* Product grid layout */
    .product-grid {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
    }

    .product-card {
      width: 50%;
      padding: 15px;
      vertical-align: top;
    }

    /* Image container - matching aspect-3/4 */
    .image-container {
      width: 100%;
      padding-bottom: 133.33%; /* 4:3 aspect ratio (3/4 = 0.75, so height is 133.33% of width) */
      position: relative;
      background-color: #F9F9F9;
      margin-bottom: 16px;
      border: 1px solid #f0f0f0;
      transition: border-color 0.7s ease;
    }

    .image-container:hover {
      border-color: #999999;
    }

    .product-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 20px;
      box-sizing: border-box;
    }

    /* Color swatches */
    .color-swatches {
      margin-top: 12px;
      text-align: center;
    }

    .color-swatch {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin: 0 4px;
      border: 1px solid rgba(0,0,0,0.1);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    /* Buttons */
    .shop-button {
      display: inline-block;
      background-color: #111111;
      color: #ffffff !important;
      padding: 18px 40px;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      text-decoration: none;
      border: 2px solid #111111;
      margin: 20px 0;
    }

    .shop-button:hover {
      background-color: #ffffff;
      color: #111111 !important;
    }

    /* Divider */
    .divider {
      height: 2px;
      background-color: #e0e0e0;
      width: 50px;
      margin: 40px auto;
    }

    /* Footer */
    .footer-text {
      font-size: 11px;
      color: #999999;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      text-align: center;
      margin: 30px 0 10px 0;
    }

    /* Responsive */
    @media screen and (max-width: 480px) {
      .product-card {
        width: 100% !important;
        display: block;
        padding: 10px 0;
      }

      .product-grid, .product-grid tbody, .product-grid tr {
        display: block;
        width: 100%;
      }

      .collection-title {
        font-size: 20px;
      }

      .image-container {
        max-width: 100%;
      }
    }
  </style>
</head>
<body style="background-color: #ffffff; margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif;">
  <div class="email-wrapper" style="background-color: #ffffff; width: 100%;">
    <div class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">

      <!-- Header Section - Matching ProductGrid.tsx -->
      <div style="text-align: center; padding: 40px 0 20px 0; border-bottom: 2px solid #e0e0e0;">
        <span class="section-title" style="font-size: 11px; letter-spacing: 0.5em; color: #999999; font-weight: 700; display: block; margin-bottom: 15px;">
          THE SELECTION
        </span>
        <h1 class="collection-title" style="font-size: 24px; font-weight: 900; letter-spacing: 0.2em; color: #111111; text-transform: uppercase; margin: 0 0 10px 0;">
          ${batchName}
        </h1>
        <p style="font-size: 12px; color: #666666; letter-spacing: 0.1em; margin: 10px 0;">
          A first look at our newest additions
        </p>
      </div>

      <!-- Product Grid -->
      <table class="product-grid" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: 100%; margin: 30px 0;">
        <tr>
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

              // Add product card
              html += `
                <td class="product-card" style="width: 50%; padding: 15px; vertical-align: top; background-color: #ffffff;" bgcolor="#ffffff">
                  <div style="background-color: #ffffff;">
                    <!-- Image Container - Matching aspect ratio from ProductGrid -->
                    <a href="https://daimamkenyaafrica.com/products/${product.slug}" style="text-decoration: none; display: block;">
                      <div class="image-container" style="width: 100%; padding-bottom: 133.33%; position: relative; background-color: #F9F9F9; margin-bottom: 16px; border: 1px solid #f0f0f0;">
                        ${
                          product.imageUrl
                            ? `<img src="${product.imageUrl}" alt="${product.name}" class="product-image" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; padding: 20px; box-sizing: border-box;" />`
                            : ""
                        }
                      </div>
                    </a>

                    <!-- Product Info -->
                    <div style="text-align: center;">
                      <span class="product-category" style="font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #999999; font-weight: 700; display: block; margin-bottom: 8px;">
                        ${product.category || "NEW ARRIVAL"}
                      </span>
                      <a href="https://daimamkenyaafrica.com/products/${product.slug}" style="text-decoration: none;">
                        <h3 class="product-name" style="font-size: 13px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: #111111; line-height: 1.3; margin: 8px 0 4px 0; min-height: 2.6em;">
                          ${product.name}
                        </h3>
                      </a>
                      <p class="product-price" style="font-size: 14px; font-weight: 500; letter-spacing: 0.1em; color: #111111; margin: 4px 0;">
                        KSH ${product.price}
                      </p>
                    </div>

                    <!-- Color Swatches (placeholder colors) -->
                    <div class="color-swatches" style="margin-top: 12px; text-align: center;">
                      <span class="color-swatch" style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin: 0 4px; background-color: #000000; border: 1px solid rgba(0,0,0,0.1);"></span>
                      <span class="color-swatch" style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin: 0 4px; background-color: #808080; border: 1px solid rgba(0,0,0,0.1);"></span>
                      <span class="color-swatch" style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin: 0 4px; background-color: #964B00; border: 1px solid rgba(0,0,0,0.1);"></span>
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
        </tr>
      </table>

      <!-- Divider -->
      <div class="divider" style="height: 2px; background-color: #e0e0e0; width: 50px; margin: 40px auto;"></div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="https://daimamkenyaafrica.com/products" class="shop-button" style="display: inline-block; background-color: #111111; color: #ffffff !important; padding: 18px 40px; font-size: 12px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; text-decoration: none; border: 2px solid #111111;">
          SHOP THE COLLECTION
        </a>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 30px 0 20px 0; border-top: 1px solid #e0e0e0;">
        <p class="footer-text" style="font-size: 11px; color: #999999; letter-spacing: 0.2em; text-transform: uppercase; margin: 5px 0;">
          Daima Mkenya · Nairobi, Kenya
        </p>
        <p style="font-size: 10px; color: #cccccc; margin: 10px 0;">
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

    // Fetch batch details with product information including slug and category
    console.log("📦 Fetching batch details for ID:", body._id);
    const batchData = await client.fetch(
      `*[_id == $id][0] {
        batchName,
        products[]->{
          name,
          price,
          category,
          "slug": slug.current,
          "imageUrl": images.hero.asset->url
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
            emailError: err.message.substring(0, 200), // Limit error length
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
