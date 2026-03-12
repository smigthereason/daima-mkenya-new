// // app/api/notify-customers/route.ts
// import { NextResponse } from "next/server";
// import { createClient } from "@sanity/client";
// import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
// import { Resend } from "resend";

// // Initialize Resend with the API key
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
//     const body = await req.json();
//     console.log("🔔 Webhook received for batch:", body._id);
//     console.log("Webhook payload:", JSON.stringify(body, null, 2));

//     const signature = req.headers.get(SIGNATURE_HEADER_NAME);
//     const secret = process.env.SANITY_WEBHOOK_SECRET!;

//     // Verify webhook signature
//     if (
//       !signature ||
//       !isValidSignature(JSON.stringify(body), signature, secret)
//     ) {
//       console.log("❌ Invalid signature");
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     console.log("✅ Signature verified");

//     // TARGETING: Fetch emails ONLY from customers who have made purchases (paymentStatus == "paid")
//     console.log("📊 Fetching paid customers...");
//     const paidCustomers = await client.fetch(`
//       *[_type == "order" && paymentStatus == "paid" && defined(customer.email)] | order(_createdAt desc) {
//         "email": customer.email
//       }
//     `);

//     console.log(`📧 Found ${paidCustomers.length} paid customer records`);

//     // Get unique emails
//     const emails = [...new Set(paidCustomers.map((c: any) => c.email))];
//     console.log(`👥 Unique customer emails: ${emails.length}`);
//     if (emails.length > 0) {
//       console.log("Sample emails:", emails.slice(0, 3));
//     }

//     // Fetch Batch Details and related Products for the email content
//     console.log("📦 Fetching batch details for ID:", body._id);
//     const batchData = await client.fetch(
//       `
//       *[_id == $id][0] {
//         batchName,
//         products[]->{
//           name,
//           price,
//           "imageUrl": images.hero.asset->url
//         }
//       }
//     `,
//       { id: body._id },
//     );

//     console.log(
//       "✅ Batch data retrieved:",
//       batchData ? batchData.batchName : "Not found",
//     );

//     if (!batchData) {
//       console.log("❌ Batch not found");
//       return NextResponse.json({ error: "Batch not found" }, { status: 404 });
//     }

//     if (emails.length === 0) {
//       console.log("⚠️ No customers with paid orders found");

//       // Still mark as attempted but with note
//       await client
//         .patch(body._id)
//         .set({
//           emailSent: false,
//           sentAt: new Date().toISOString(),
//           triggerEmail: false,
//           emailError: "No paid customers found",
//         })
//         .commit();

//       return NextResponse.json({
//         success: false,
//         message: "No paid customers found to send emails to",
//       });
//     }

//     // Send test email to verify configuration
//     console.log("🧪 Sending test email to verify configuration...");
//     const testEmail = process.env.TEST_EMAIL || "victor.dmaina@gmail.com"; // Add this to your .env

//     try {
//       const { data: testData, error: testError } = await resend.emails.send({
//         from: "Daima Mkenya <info@daimamkenyaafrica.com>",
//         to: [testEmail],
//         subject: `TEST: New Drop: ${batchData.batchName}`,
//         html: `
//           <div style="font-family: 'Helvetica', sans-serif; padding: 20px;">
//             <h2>Test Email - Daima Mkenya</h2>
//             <p>This is a test to verify email configuration.</p>
//             <p>Batch: ${batchData.batchName}</p>
//             <p>Products: ${batchData.products?.length || 0} items</p>
//             <hr />
//             <p style="color: #666; font-size: 12px;">If you received this, email configuration is working!</p>
//           </div>
//         `,
//       });

//       if (testError) {
//         console.error("❌ Test email failed:", testError);
//         return NextResponse.json({ error: testError }, { status: 500 });
//       }

//       console.log("✅ Test email sent successfully:", testData);
//     } catch (testErr) {
//       console.error("❌ Test email exception:", testErr);
//       return NextResponse.json(
//         { error: "Failed to send test email" },
//         { status: 500 },
//       );
//     }

//     // Now send to all paid customers
//     console.log(`🚀 Sending email blast to ${emails.length} customers...`);

//     try {
//       const { data, error } = await resend.emails.send({
//         from: "Daima Mkenya <info@daimamkenyaafrica.com>",
//         to: emails as string[],
//         subject: `New Drop: ${batchData.batchName}`,
//         html: `
//           <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #000;">
//             <h1 style="text-align: center; text-transform: uppercase; letter-spacing: 4px;">${batchData.batchName}</h1>
//             <p style="text-align: center; color: #666;">Exclusively for our returning patrons.</p>
//             <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
//             <div style="display: block;">
//               ${batchData.products
//                 ?.map(
//                   (p: any) => `
//                 <div style="margin-bottom: 30px; text-align: center;">
//                   ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" style="width: 100%; max-height: 400px; object-fit: cover;" />` : ""}
//                   <h3 style="margin: 10px 0 5px 0; text-transform: uppercase;">${p.name}</h3>
//                   <p style="font-weight: bold;">${p.price}</p>
//                 </div>
//               `,
//                 )
//                 .join("")}
//             </div>
//             <div style="text-align: center; margin-top: 40px;">
//               <a href="https://daimamkenya.africa" style="background: #000; color: #fff; padding: 15px 40px; text-decoration: none; font-weight: bold; font-size: 12px; letter-spacing: 2px;">SHOP THE COLLECTION</a>
//             </div>
//             <p style="text-align: center; color: #999; font-size: 10px; margin-top: 30px;">
//               Daima Mkenya · Nairobi, Kenya
//             </p>
//           </div>
//         `,
//       });

//       if (error) {
//         console.error("❌ Resend API error:", error);

//         // Mark as failed in Sanity
//         await client
//           .patch(body._id)
//           .set({
//             emailSent: false,
//             sentAt: new Date().toISOString(),
//             triggerEmail: false,
//             emailError: error.message,
//           })
//           .commit();

//         return NextResponse.json({ error }, { status: 500 });
//       }

//       console.log("✅ Email blast sent successfully:", data);

//       // Mark as sent in Sanity
//       await client
//         .patch(body._id)
//         .set({
//           emailSent: true,
//           sentAt: new Date().toISOString(),
//           triggerEmail: false,
//           recipientCount: emails.length,
//         })
//         .commit();

//       console.log("✅ Sanity document updated");

//       return NextResponse.json({
//         success: true,
//         message: `Email blast sent to ${emails.length} customers`,
//         data: {
//           batchId: body._id,
//           batchName: batchData.batchName,
//           recipientCount: emails.length,
//           sentAt: new Date().toISOString(),
//         },
//       });
//     } catch (sendErr: any) {
//       console.error("❌ Email sending failed:", sendErr);

//       // Mark as failed in Sanity
//       await client
//         .patch(body._id)
//         .set({
//           emailSent: false,
//           sentAt: new Date().toISOString(),
//           triggerEmail: false,
//           emailError: sendErr.message,
//         })
//         .commit();

//       return NextResponse.json({ error: sendErr.message }, { status: 500 });
//     }
//   } catch (err: any) {
//     console.error("💥 Critical error in webhook:", err);
//     console.error("Error stack:", err.stack);

//     return NextResponse.json(
//       {
//         error: err.message,
//         stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//       },
//       { status: 500 },
//     );
//   }
// }

// // Optional: Add a GET handler for testing
// export async function GET() {
//   return NextResponse.json({
//     message: "Notify customers endpoint is running",
//     status: "active",
//     timestamp: new Date().toISOString(),
//   });
// }
// app/api/notify-customers/route.ts
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

    // TARGETING: Fetch unique emails ONLY from customers with successful (paid) orders
    const paidOrders = await client.fetch(`
      *[_type == "order" && paymentStatus == "paid" && defined(customer.email)] {
        "email": customer.email
      }
    `);

    // Extract unique emails to avoid spamming customers who have multiple orders
    const emails = [...new Set(paidOrders.map((order: any) => order.email))];

    if (emails.length === 0) {
      return NextResponse.json({
        message: "No customers with paid orders found.",
      });
    }

    const batchData = await client.fetch(
      `*[_id == $id][0] {
        batchName,
        products[]->{
          name,
          price,
          "imageUrl": images.hero.asset->url
        }
      }`,
      { id: body._id },
    );

    if (!batchData) {
      return NextResponse.json(
        { error: "Batch data not found" },
        { status: 404 },
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Daima Mkenya <info@daimamkenyaafrica.com>",
      to: emails as string[],
      subject: `New Collection: ${batchData.batchName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h1 style="text-align: center; text-transform: uppercase;">${batchData.batchName}</h1>
          <p style="text-align: center;">We thought you'd like a first look at our newest additions.</p>
          <hr />
          <div style="display: grid; gap: 20px;">
            ${batchData.products
              ?.map(
                (p: any) => `
              <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px;">
                ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" style="width: 100%; max-height: 300px; object-fit: cover;" />` : ""}
                <h3>${p.name}</h3>
                <p style="font-weight: bold;">KSH ${p.price}</p>
              </div>
            `,
              )
              .join("")}
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://daimamkenyaafrica.com" style="background: #000; color: #fff; padding: 12px 25px; text-decoration: none; font-weight: bold;">SHOP NOW</a>
          </div>
        </div>
      `,
    });

    if (error) {
      await client
        .patch(body._id)
        .set({
          emailSent: false,
          triggerEmail: false,
          emailError: error.message,
        })
        .commit();
      return NextResponse.json({ error }, { status: 500 });
    }

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
