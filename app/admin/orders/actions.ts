"use server";

import { serverClient } from "@/sanity/lib/server-client";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  buildInvoiceEmailHtml,
  buildInvoicePdfBase64,
  getInvoiceNumber,
  type InvoiceOrder,
} from "@/lib/orderInvoice";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const isAdmin = Boolean(
    (session?.user as { isAdmin?: boolean } | undefined)?.isAdmin,
  );

  if (!session?.user || !isAdmin) {
    throw new Error("Unauthorized");
  }
}

export async function updateOrderStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  if (!id || !status) return { error: "ID and Status required" };

  try {
    await requireAdmin();

    const result = await serverClient
      .patch(id)
      .set({ status, updatedAt: new Date().toISOString() })
      .commit({ visibility: "async" });

    revalidatePath("/admin/orders");

    return {
      success: true,
      verifiedStatus: result.status,
    };
  } catch (error) {
    console.error("Action error:", error);
    return {
      error: error instanceof Error && error.message === "Unauthorized"
        ? "You are not authorized to update orders"
        : "Failed to update",
    };
  }
}

export async function sendOrderInvoice(orderId: string) {
  if (!orderId) return { error: "Order ID is required" };

  try {
    await requireAdmin();

    const order = await serverClient.fetch<InvoiceOrder | null>(
      `*[_type == "order" && _id == $orderId][0]{
        orderNumber,
        amount,
        shippingFee,
        paymentStatus,
        paymentMethod,
        paymentConfirmedAt,
        transactionId,
        pesapalOrderTrackingId,
        _createdAt,
        customer { name, email, phone },
        deliveryDetails {
          method,
          city,
          pickupStationName,
          shippingAddress,
          additionalInfo
        },
        items[] { productName, quantity, price, size, color }
      }`,
      { orderId },
    );

    if (!order) return { error: "Order not found" };
    if (!order.orderNumber) return { error: "This order has no order number" };
    if (!order.customer?.email) return { error: "Customer email is missing" };
    if (!order.items?.length) return { error: "This order has no invoice items" };

    const invoiceNumber = getInvoiceNumber(order.orderNumber);
    const [pdfBase64, emailHtml] = await Promise.all([
      buildInvoicePdfBase64(order),
      buildInvoiceEmailHtml(order),
    ]);

    const info = await sendEmail({
      to: order.customer.email,
      replyTo: "info@daimamkenyaafrica.com",
      subject: `Your Daima Mkenya Africa Invoice - ${invoiceNumber}`,
      html: emailHtml,
      attachments: [
        {
          content: Buffer.from(pdfBase64, "base64"),
          filename: `${invoiceNumber}.pdf`,
          contentType: "application/pdf",
        },
      ],
    });

    const sentAt = new Date().toISOString();
    await serverClient
      .patch(orderId)
      .set({
        invoiceSentAt: sentAt,
        invoiceEmailId: info.messageId || "",
        updatedAt: sentAt,
      })
      .commit({ visibility: "async" });

    revalidatePath("/admin/orders");

    return {
      success: true,
      sentAt,
      emailId: info.messageId,
      recipient: order.customer.email,
    };
  } catch (error) {
    console.error("Send invoice action error:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "You are not authorized to send invoices" };
    }

    if (
      error instanceof Error &&
      error.message.includes("SMTP password is not configured")
    ) {
      return { error: "SMTP is not configured. Add SMTP_PASSWORD and restart the app." };
    }

    const smtpCode =
      typeof error === "object" && error && "code" in error
        ? String((error as { code?: unknown }).code || "")
        : "";

    if (smtpCode === "EAUTH") {
      return { error: "SMTP authentication failed. Check the Namecheap mailbox username/password." };
    }

    return { error: "Failed to send invoice. Check the server SMTP logs." };
  }
}
