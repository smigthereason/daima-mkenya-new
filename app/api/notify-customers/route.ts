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

// // Function to generate the email HTML with fixed grid layout
// function generateEmailHTML(batchName: string, products: any[]) {
//   // Function to render a product card with fixed dimensions
//   const renderProductCard = (product: any) => {
//     return `
//       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; width: 100%; table-layout: fixed;">
//         <tr>
//           <td style="background-color: #ffffff; padding: 0;">
//             <!-- Image Container - Fixed height 200px -->
//             <a href="https://daimamkenyaafrica.com/products/${product.slug}" style="text-decoration: none; display: block;">
//               <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F9F9F9; border: 1px solid #f0f0f0; height: 200px;">
//                 <tr>
//                   <td style="background-color: #F9F9F9; padding: 15px; text-align: center; vertical-align: middle; height: 200px;">
//                     ${
//                       product.imageUrl
//                         ? `<img src="${product.imageUrl}" alt="${product.name}" width="100%" style="max-width: 100%; max-height: 170px; width: auto; height: auto; display: block; margin: 0 auto;" />`
//                         : '<div style="height: 170px; width: 100%; background-color: #F9F9F9;"></div>'
//                     }
//                   </td>
//                 </tr>
//               </table>
//             </a>

//             <!-- Product Info - Fixed height 100px -->
//             <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; margin-top: 12px; height: 80px;">
//               <tr>
//                 <td style="background-color: #ffffff; text-align: center; padding: 0 5px; vertical-align: top;">
//                   <span style="font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #999999; font-weight: 700; display: block; margin-bottom: 6px; line-height: 12px;">
//                     ${product.category ? product.category.substring(0, 20) : "NEW ARRIVAL"}
//                   </span>
//                   <a href="https://daimamkenyaafrica.com/products/${product.slug}" style="text-decoration: none;">
//                     <h3 style="font-size: 13px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: #111111; line-height: 1.3; margin: 6px 0 4px 0; max-height: 34px; overflow: hidden;">
//                       ${product.name ? product.name.substring(0, 30) : "Product Name"}
//                     </h3>
//                   </a>
//                   <p style="font-size: 14px; font-weight: 500; letter-spacing: 0.1em; color: #111111; margin: 4px 0; line-height: 16px;">
//                     ${product.price || "Price"}
//                   </p>
//                 </td>
//               </tr>
//             </table>

//             <!-- Color Swatches - Fixed height 30px -->
//             <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; margin-top: 8px; height: 24px;">
//               <tr>
//                 <td style="background-color: #ffffff; text-align: center; vertical-align: top;">
//                   ${
//                     product.colors && product.colors.length > 0
//                       ? product.colors
//                           .slice(0, 4)
//                           .map(
//                             (color: any) =>
//                               `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin: 0 3px; background-color: ${color.hex || "#000000"} !important; border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 1px 2px rgba(0,0,0,0.1);"></span>`,
//                           )
//                           .join("")
//                       : '<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin: 0 3px; background-color: #000000 !important; border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 1px 2px rgba(0,0,0,0.1);"></span>'
//                   }
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>
//       </table>
//     `;
//   };

//   // Build the grid using nested tables for perfect alignment
//   let gridHTML = "";

//   for (let i = 0; i < products.length; i += 2) {
//     gridHTML += `
//       <tr>
//         <td style="width: 50%; vertical-align: top; background-color: #ffffff; padding: 12px;" valign="top">
//           ${products[i] ? renderProductCard(products[i]) : '<div style="height: 0;"></div>'}
//         </td>
//         <td style="width: 50%; vertical-align: top; background-color: #ffffff; padding: 12px;" valign="top">
//           ${products[i + 1] ? renderProductCard(products[i + 1]) : '<div style="height: 0;"></div>'}
//         </td>
//       </tr>
//     `;
//   }

//   return `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <meta name="color-scheme" content="light only">
//   <meta name="supported-color-schemes" content="light only">
//   <title>New Collection: ${batchName}</title>
//   <style>
//     /* Force white background on all elements */
//     body, table, td, div, p, h1, h2, h3, h4, h5, h6, span, a {
//       background-color: #ffffff !important;
//     }

//     body {
//       margin: 0 !important;
//       padding: 0 !important;
//       font-family: Arial, Helvetica, sans-serif;
//       -webkit-text-size-adjust: 100%;
//       -ms-text-size-adjust: 100%;
//     }

//     /* Email container */
//     .email-wrapper {
//       width: 100%;
//       background-color: #ffffff !important;
//     }

//     .email-container {
//       max-width: 600px;
//       margin: 0 auto;
//       background-color: #ffffff !important;
//       padding: 20px;
//     }

//     /* Typography */
//     .section-title {
//       font-size: 11px;
//       letter-spacing: 0.5em;
//       text-transform: uppercase;
//       color: #999999 !important;
//       font-weight: 700;
//       margin-bottom: 15px;
//       text-align: center;
//       display: block;
//     }

//     .collection-title {
//       font-size: 22px;
//       font-weight: 900;
//       letter-spacing: 0.2em;
//       text-transform: uppercase;
//       color: #111111 !important;
//       text-align: center;
//       margin: 15px 0 8px 0;
//     }

//     /* Product grid - fixed layout */
//     .product-grid {
//       width: 100%;
//       border-collapse: collapse;
//       margin: 20px 0;
//       background-color: #ffffff !important;
//       table-layout: fixed;
//     }

//     .product-grid td {
//       background-color: #ffffff !important;
//       padding: 12px;
//       vertical-align: top;
//     }

//     /* Ensure all product cards have equal height */
//     .product-grid table {
//       table-layout: fixed;
//     }

//     /* Buttons */
//     .shop-button {
//       display: inline-block;
//       background-color: #111111 !important;
//       color: #ffffff !important;
//       padding: 14px 30px;
//       font-size: 11px;
//       font-weight: 900;
//       letter-spacing: 0.3em;
//       text-transform: uppercase;
//       text-decoration: none;
//       border: 2px solid #111111;
//       margin: 15px 0;
//     }

//     /* Divider */
//     .divider {
//       height: 2px;
//       background-color: #e0e0e0 !important;
//       width: 40px;
//       margin: 30px auto;
//     }

//     /* Footer */
//     .footer-text {
//       font-size: 10px;
//       color: #999999 !important;
//       letter-spacing: 0.2em;
//       text-transform: uppercase;
//       text-align: center;
//       margin: 20px 0 8px 0;
//     }

//     /* Fix image alignment */
//     img {
//       display: block;
//       margin: 0 auto;
//     }

//     /* Responsive */
//     @media screen and (max-width: 480px) {
//       .email-container {
//         padding: 15px !important;
//       }

//       .product-grid,
//       .product-grid tbody,
//       .product-grid tr,
//       .product-grid td {
//         display: block !important;
//         width: 100% !important;
//         box-sizing: border-box;
//       }

//       .product-grid td {
//         padding: 15px 0 !important;
//       }

//       .collection-title {
//         font-size: 18px;
//       }

//       img {
//         max-width: 100% !important;
//         height: auto !important;
//       }
//     }
//   </style>
// </head>
// <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, Helvetica, sans-serif;">
//   <div class="email-wrapper" style="background-color: #ffffff; width: 100%;">
//     <div class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">

//       <!-- Header Section -->
//       <div style="text-align: center; padding: 30px 0 15px 0; border-bottom: 2px solid #e0e0e0; background-color: #ffffff;">
//         <span class="section-title" style="font-size: 11px; letter-spacing: 0.5em; color: #999999; font-weight: 700; display: block; margin-bottom: 12px;">
//           THE SELECTION
//         </span>
//         <h1 class="collection-title" style="font-size: 22px; font-weight: 900; letter-spacing: 0.2em; color: #111111; text-transform: uppercase; margin: 0 0 8px 0;">
//           ${batchName}
//         </h1>
//         <p style="font-size: 11px; color: #666666; letter-spacing: 0.1em; margin: 8px 0;">
//           A first look at our newest additions
//         </p>
//       </div>

//       <!-- Product Grid - Fixed Layout with Equal Heights -->
//       <table class="product-grid" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: 100%; margin: 20px 0; background-color: #ffffff; table-layout: fixed;">
//         <tbody>
//           ${gridHTML}
//         </tbody>
//       </table>

//       <!-- Divider -->
//       <div class="divider" style="height: 2px; background-color: #e0e0e0; width: 40px; margin: 30px auto;"></div>

//       <!-- CTA Button -->
//       <div style="text-align: center; margin: 30px 0; background-color: #ffffff;">
//         <a href="https://daimamkenyaafrica.com/products" class="shop-button" style="display: inline-block; background-color: #111111; color: #ffffff; padding: 14px 30px; font-size: 11px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; text-decoration: none; border: 2px solid #111111;">
//           SHOP THE COLLECTION
//         </a>
//       </div>

//       <!-- Footer -->
//       <div style="text-align: center; padding: 20px 0 15px 0; border-top: 1px solid #e0e0e0; background-color: #ffffff;">
//         <p class="footer-text" style="font-size: 10px; color: #999999; letter-spacing: 0.2em; text-transform: uppercase; margin: 5px 0;">
//           Daima Mkenya · Nairobi, Kenya
//         </p>
//         <p style="font-size: 9px; color: #cccccc; margin: 8px 0;">
//           © ${new Date().getFullYear()} Daima Mkenya. All rights reserved.
//         </p>
//       </div>
//     </div>
//   </div>
// </body>
// </html>
//   `;
// }

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
//     console.log("Scheduled For:", body.scheduledFor || "Immediate");
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

//       // Reset triggerEmail to false
//       await client.patch(body._id).set({ triggerEmail: false }).commit();

//       return NextResponse.json({
//         message: "Not triggered - triggerEmail is false",
//       });
//     }

//     if (body.emailSent) {
//       console.log("⏭️ Skipping - email already sent for this batch");

//       // Reset triggerEmail to false
//       await client.patch(body._id).set({ triggerEmail: false }).commit();

//       return NextResponse.json({
//         message: "Not triggered - email already sent",
//       });
//     }

//     // Check if scheduled
//     if (body.scheduledFor && new Date(body.scheduledFor) > new Date()) {
//       console.log("⏰ Scheduled for future:", body.scheduledFor);

//       // Reset triggerEmail to false
//       await client.patch(body._id).set({ triggerEmail: false }).commit();

//       return NextResponse.json({
//         message: "Scheduled for future date",
//         scheduledFor: body.scheduledFor,
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

//     // Extract unique emails
//     const emails = [...new Set(paidOrders.map((order: any) => order.email))];
//     console.log(`👥 Unique customer emails: ${emails.length}`);

//     if (emails.length === 0) {
//       console.log("⚠️ No customers with paid orders found");

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
//           category,
//           "slug": slug.current,
//           "imageUrl": images.hero.asset->url,
//           colors[] {
//             hex,
//             name
//           }
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

//     // Send email blast
//     console.log(`🚀 Sending email blast to ${emails.length} customers...`);
//     console.log("Email subject:", `New Collection: ${batchData.batchName}`);

//     const emailHTML = generateEmailHTML(
//       batchData.batchName,
//       batchData.products || [],
//     );

//     const { data, error } = await resend.emails.send({
//       from: "Daima Mkenya <info@daimamkenyaafrica.com>",
//       to: emails as string[],
//       subject: `New Collection: ${batchData.batchName}`,
//       html: emailHTML,
//     });

//     if (error) {
//       console.error("❌ Resend API error:", error);

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

//       return NextResponse.json(
//         {
//           success: false,
//           error: error.message,
//           recipientCount: emails.length,
//         },
//         { status: 500 },
//       );
//     }

//     // Success!
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

//     try {
//       const body = await req.json().catch(() => ({}));
//       if (body._id) {
//         await client
//           .patch(body._id)
//           .set({
//             emailSent: false,
//             sentAt: new Date().toISOString(),
//             triggerEmail: false,
//             emailError: err.message.substring(0, 200),
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

// Function to generate SDG Commitment-style email HTML with 2x1 grid
function generateEmailHTML(batchName: string, products: any[]) {
  // Function to render SDG-style product card
  const renderProductCard = (product: any, idx: number) => {
    const colors = [
      "#000000", // ELEGANT - Black
      "#BB0000", // INNOVATIVE - Red
      "#008000", // DELUXE - Green
      "#E8E8E8", // ACTIVE - Light gray
    ];

    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1F2937; width: 100%; table-layout: fixed; position: relative;">
        <tr>
          <td style="background-color: #1F2937; padding: 0;">
            <!-- Full bleed background image -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 1;">
              ${
                product.imageUrl
                  ? `<img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 1s; opacity: 0.6;" />`
                  : '<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #1F2937 0%, #374151 100%);"></div>'
              }
            </div>

            <!-- Content overlay -->
            <div style="position: relative; z-index: 10; height: 280px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px;">
              <!-- Product Title -->
              <h3 style="font-size: 24px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: #FFFFFF; margin: 0 0 8px 0; line-height: 1.1; font-family: serif;">
                ${product.name ? product.name.substring(0, 25) : "Product Name"}
              </h3>

              <!-- Category Tag -->
              <span style="font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #D1D5DB; font-weight: 700; margin-bottom: 12px; display: block; line-height: 1;">
                ${product.category ? product.category.substring(0, 20) : "NEW ARRIVAL"}
              </span>

              <!-- Price -->
              <p style="font-size: 16px; font-weight: 600; letter-spacing: 0.1em; color: #FFFFFF; margin: 8px 0 16px 0; opacity: 0.9;">
                ${product.price || "Price"}
              </p>
            </div>

            <!-- Animated accent bar at bottom -->
            <div style="position: absolute; bottom: 0; left: 0; width: 0%; height: 4px; background-color: ${colors[idx % colors.length]}; transition: width 0.7s ease-out; z-index: 20;"></div>

            <!-- Clickable overlay link -->
            <a href="https://daimamkenyaafrica.com/products/${product.slug}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 30; text-decoration: none; display: block;"></a>
          </td>
        </tr>
      </table>
    `;
  };

  // Build 2x1 horizontal grid matching SDG Commitment style
  let gridHTML = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F3F4F6; border-top: 1px solid #E5E7EB; border-bottom: 1px solid #E5E7EB; margin: 32px 0;">
      <tr>
  `;

  products.slice(0, 2).forEach((product: any, idx: number) => {
    gridHTML += `
        <td style="width: 50%; vertical-align: top; padding: 8px;" valign="top">
          ${renderProductCard(product, idx)}
        </td>
    `;
  });

  // Fill empty slots if less than 2 products
  const emptyCount = 2 - products.slice(0, 2).length;
  for (let i = 0; i < emptyCount; i++) {
    gridHTML += `
        <td style="width: 50%; vertical-align: top; padding: 8px;" valign="top">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1F2937; height: 280px;"></table>
        </td>
    `;
  }

  gridHTML += `
      </tr>
    </table>
  `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>New Collection: ${batchName}</title>
  <style>
    /* Force consistent rendering */
    body, table, td, div, p, h1, h2, h3, h4, h5, h6, span, a {
      background-color: #F9FAFB !important;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #F9FAFB !important;
    }
    .section-title {
      font-size: 11px;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      color: #9CA3AF !important;
      font-weight: 700;
      margin-bottom: 15px;
      text-align: center;
    }
    .collection-title {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #111827 !important;
      text-align: center;
      margin: 15px 0 12px 0;
      font-family: serif;
    }
    .shop-button {
      display: inline-block;
      background-color: #111111 !important;
      color: #FFFFFF !important;
      padding: 16px 36px;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      text-decoration: none;
      border: 2px solid #111111;
      margin: 20px 0;
      transition: all 0.3s;
    }
    .divider {
      height: 2px;
      background-color: #D1D5DB !important;
      width: 48px;
      margin: 36px auto;
    }
    .footer-text {
      font-size: 10px;
      color: #9CA3AF !important;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      text-align: center;
    }
    @media screen and (max-width: 480px) {
      .email-container { padding: 15px !important; }
      .collection-title { font-size: 22px; letter-spacing: 0.1em; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB;">
  <div class="email-wrapper" style="background-color: #F9FAFB; width: 100%;">
    <div class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #F9FAFB; padding: 24px;">

      <!-- Header -->
      <div style="text-align: center; padding: 36px 0 24px 0; border-bottom: 2px solid #E5E7EB;">
        <span class="section-title" style="font-size: 11px; letter-spacing: 0.5em; color: #9CA3AF; font-weight: 700; display: block; margin-bottom: 16px;">
          THE SELECTION
        </span>
        <h1 class="collection-title" style="font-size: 28px; font-weight: 900; letter-spacing: 0.15em; color: #111827; text-transform: uppercase; margin: 0 0 12px 0; font-family: serif;">
          ${batchName}
        </h1>
        <p style="font-size: 12px; color: #6B7280; letter-spacing: 0.05em; margin: 0;">
          A first look at our newest additions
        </p>
      </div>

      <!-- SDG Commitment Style 2x1 Product Grid -->
      ${gridHTML}

      <!-- CTA & Footer -->
      <div class="divider" style="height: 2px; background-color: #D1D5DB; width: 48px; margin: 48px auto;"></div>

      <div style="text-align: center; margin: 36px 0;">
        <a href="https://daimamkenyaafrica.com/products" class="shop-button" style="display: inline-block; background-color: #111111; color: #FFFFFF; padding: 16px 36px; font-size: 11px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; text-decoration: none; border: 2px solid #111111;">
          SHOP THE COLLECTION
        </a>
      </div>

      <div style="text-align: center; padding: 24px 0; border-top: 1px solid #E5E7EB;">
        <p class="footer-text" style="font-size: 10px; color: #9CA3AF; letter-spacing: 0.2em; text-transform: uppercase; margin: 0 0 8px 0;">
          Daima Mkenya · Nairobi, Kenya
        </p>
        <p style="font-size: 9px; color: #D1D5DB; margin: 0;">
          © ${new Date().getFullYear()} Daima Mkenya. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Rest of the webhook logic remains exactly the same...
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("=".repeat(50));
    console.log("🔔 WEBHOOK RECEIVED");
    console.log("=".repeat(50));
    console.log("Batch ID:", body._id);
    console.log("Batch Name:", body.batchName);
    console.log("Trigger Email:", body.triggerEmail);
    console.log("Email Already Sent:", body.emailSent);
    console.log("Scheduled For:", body.scheduledFor || "Immediate");
    console.log("Timestamp:", new Date().toISOString());

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

    if (!body.triggerEmail) {
      console.log("⏭️ Skipping - triggerEmail is false, no action needed");
      await client.patch(body._id).set({ triggerEmail: false }).commit();
      return NextResponse.json({
        message: "Not triggered - triggerEmail is false",
      });
    }

    if (body.emailSent) {
      console.log("⏭️ Skipping - email already sent for this batch");
      await client.patch(body._id).set({ triggerEmail: false }).commit();
      return NextResponse.json({
        message: "Not triggered - email already sent",
      });
    }

    if (body.scheduledFor && new Date(body.scheduledFor) > new Date()) {
      console.log("⏰ Scheduled for future:", body.scheduledFor);
      await client.patch(body._id).set({ triggerEmail: false }).commit();
      return NextResponse.json({
        message: "Scheduled for future date",
        scheduledFor: body.scheduledFor,
      });
    }

    console.log("📊 Fetching paid customers from orders...");
    const paidOrders = await client.fetch(`
      *[_type == "order" && paymentStatus == "paid" && defined(customer.email)] {
        "email": customer.email
      }
    `);

    console.log(`📧 Found ${paidOrders.length} paid order records`);
    const emails = [...new Set(paidOrders.map((order: any) => order.email))];
    console.log(`👥 Unique customer emails: ${emails.length}`);

    if (emails.length === 0) {
      console.log("⚠️ No customers with paid orders found");
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

      return NextResponse.json({
        success: false,
        message: "No customers with paid orders found.",
      });
    }

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

    console.log(`🚀 Sending email blast to ${emails.length} customers...`);
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

    if (error) {
      console.error("❌ Resend API error:", error);
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

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          recipientCount: emails.length,
        },
        { status: 500 },
      );
    }

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
