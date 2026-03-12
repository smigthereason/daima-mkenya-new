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

    // Fetch batch details with product information
    console.log("📦 Fetching batch details for ID:", body._id);
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

    // Send test email first to verify configuration (optional but recommended)
    console.log("🧪 Sending test email to verify configuration...");
    const testEmail = process.env.TEST_EMAIL || "victor.dmaina@gmail.com";

    try {
      const { data: testData, error: testError } = await resend.emails.send({
        from: "Daima Mkenya <info@daimamkenyaafrica.com>",
        to: [testEmail],
        subject: `TEST: New Collection: ${batchData.batchName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ff0000;">
            <h2 style="color: #ff0000;">🔧 TEST EMAIL - IGNORE</h2>
            <p>This is a test to verify email configuration.</p>
            <p><strong>Batch:</strong> ${batchData.batchName}</p>
            <p><strong>Would send to:</strong> ${emails.length} customers</p>
            <p><strong>Products:</strong> ${batchData.products?.length || 0}</p>
            <hr />
            <p style="color: #666;">If you received this, email configuration is working!</p>
          </div>
        `,
      });

      if (testError) {
        console.error("❌ Test email failed:", testError);
      } else {
        console.log("✅ Test email sent successfully to:", testEmail);
      }
    } catch (testErr) {
      console.error("❌ Test email exception:", testErr);
      // Continue anyway - don't block the main email blast
    }

    // Send email blast to all paid customers
    console.log(`🚀 Sending email blast to ${emails.length} customers...`);
    console.log("Email subject:", `New Collection: ${batchData.batchName}`);

    const { data, error } = await resend.emails.send({
      from: "Daima Mkenya <info@daimamkenyaafrica.com>",
      to: emails as string[],
      subject: `New Collection: ${batchData.batchName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h1 style="text-align: center; text-transform: uppercase;">${batchData.batchName}</h1>
          <p style="text-align: center;">We thought you'd like a first look at our newest additions.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <div style="display: grid; gap: 20px;">
            ${batchData.products
              ?.map(
                (p: any) => `
              <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px;">
                ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" style="width: 100%; max-height: 300px; object-fit: cover; margin-bottom: 10px;" />` : ""}
                <h3 style="margin: 10px 0 5px 0;">${p.name}</h3>
                <p style="font-weight: bold; font-size: 18px;">KSH ${p.price}</p>
              </div>
            `,
              )
              .join("")}
          </div>
          <div style="text-align: center; margin-top: 40px;">
            <a href="https://daimamkenyaafrica.com/products" style="background: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; letter-spacing: 1px; display: inline-block;">SHOP THE COLLECTION</a>
          </div>
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
            Daima Mkenya · Nairobi, Kenya
          </p>
        </div>
      `,
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
