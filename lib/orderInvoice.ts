import { jsPDF } from "jspdf";
import fs from "node:fs/promises";
import path from "node:path";
import { getActiveLogo, urlFor } from "@/lib/sanity/logo";

export type InvoiceOrderItem = {
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
};

export type InvoiceOrder = {
  orderNumber: string;
  amount: number;
  shippingFee?: number;
  paymentStatus?: string;
  paymentMethod?: string;
  paymentConfirmedAt?: string;
  transactionId?: string;
  pesapalOrderTrackingId?: string;
  _createdAt: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  deliveryDetails?: {
    method?: "pickup" | "shipping";
    city?: string;
    pickupStationName?: string;
    shippingAddress?: string;
    additionalInfo?: string;
  };
  items: InvoiceOrderItem[];
};

const formatMoney = (value: number) => `KES ${Math.round(value || 0).toLocaleString("en-KE")}`;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeZone: "Africa/Nairobi",
  }).format(new Date(value));

const escapeHtml = (value: string | number | undefined | null) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getBaseUrl = () =>
  (process.env.NEXT_PUBLIC_BASE_URL || "https://daimamkenyaafrica.com").replace(/\/$/, "");

const WEBSITE_FALLBACK_LOGO = "/assets/Logo_no-bg.png";

async function getInvoiceLogoUrl() {
  try {
    const activeLogo = await getActiveLogo();
    if (activeLogo?.imageUrl) {
      return {
        url: urlFor(activeLogo.imageUrl).width(280).format("png").url(),
        alt: activeLogo?.alt || "Daima Mkenya Africa Logo",
      };
    }
  } catch (error) {
    console.error("Unable to load active invoice logo:", error);
  }

  return {
    url: `${getBaseUrl()}${WEBSITE_FALLBACK_LOGO}`,
    alt: "Daima Mkenya Africa Logo",
  };
}

async function readFallbackLogoAsDataUrl() {
  try {
    const logoPath = path.join(process.cwd(), "public", "assets", "Logo_no-bg.png");
    const bytes = await fs.readFile(logoPath);
    return `data:image/png;base64,${bytes.toString("base64")}`;
  } catch (error) {
    console.error("Unable to read fallback logo file:", error);
    return null;
  }
}

async function getInvoiceLogoDataUrl() {
  const { url } = await getInvoiceLogoUrl();

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") || "image/png";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("Unable to fetch invoice logo URL; falling back to local asset:", error);
    return await readFallbackLogoAsDataUrl();
  }
}

export const getInvoiceNumber = (orderNumber: string) =>
  orderNumber.startsWith("ORD-")
    ? `INV-${orderNumber.slice(4)}`
    : `INV-${orderNumber}`;

function getDeliveryText(order: InvoiceOrder) {
  if (order.deliveryDetails?.method === "pickup") {
    const location = [order.deliveryDetails.pickupStationName, order.deliveryDetails.city]
      .filter(Boolean)
      .join(" • ");
    return `Pickup station${location ? `: ${location}` : ""}`;
  }

  const location = [order.deliveryDetails?.shippingAddress, order.deliveryDetails?.city]
    .filter(Boolean)
    .join(", ");

  return `Home delivery${location ? `: ${location}` : ""}`;
}

export async function buildInvoiceEmailHtml(order: InvoiceOrder) {
  const invoiceNumber = getInvoiceNumber(order.orderNumber);
  const shippingFee = order.shippingFee || 0;
  const subtotal = Math.max(0, order.amount - shippingFee);
  const delivery = getDeliveryText(order);
  const { url: logoUrl, alt: logoAlt } = await getInvoiceLogoUrl();

  const itemRows = order.items
    .map((item) => {
      const lineTotal = (item.price || 0) * (item.quantity || 1);
      const variants = [item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
        .filter(Boolean)
        .join(" · ");

      return `
        <tr>
          <td style="padding:16px 0;border-bottom:1px solid #ececec;vertical-align:top;">
            <div style="font-size:15px;line-height:1.5;color:#111111;font-weight:bold;">
              ${escapeHtml(item.productName)}
            </div>
            ${variants ? `<div style="margin-top:6px;font-size:12px;line-height:1.6;color:#666666;">${escapeHtml(variants)}</div>` : ""}
          </td>
          <td style="padding:16px 0;border-bottom:1px solid #ececec;text-align:center;vertical-align:top;font-size:14px;color:#333333;">
            ${item.quantity}
          </td>
          <td style="padding:16px 0;border-bottom:1px solid #ececec;text-align:right;vertical-align:top;font-size:14px;color:#333333;">
            ${formatMoney(item.price)}
          </td>
          <td style="padding:16px 0;border-bottom:1px solid #ececec;text-align:right;vertical-align:top;font-size:14px;color:#111111;font-weight:bold;">
            ${formatMoney(lineTotal)}
          </td>
        </tr>`;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body style="margin:0;padding:0;background-color:#ffffff;font-family:'Times New Roman', Times, serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;">
          <tr>
            <td align="center" style="padding:60px 20px;">
              <table role="presentation" width="100%" style="max-width:600px;background-color:#ffffff;border:1px solid #eeeeee;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td height="4" style="background-color:#be1e2d;"></td>
                </tr>

                <tr>
                  <td style="padding:60px 40px 30px 40px;">
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" style="padding-bottom:20px;">
                          <img src="${logoUrl}"
                               alt="${escapeHtml(logoAlt)}"
                               width="160"
                               style="display:block;width:160px;height:auto;margin:0 auto;border:0;" />
                        </td>
                      </tr>
                    </table>

                    <h1 style="margin:0;color:#000000;font-size:28px;line-height:1.2;font-weight:normal;text-align:center;text-transform:uppercase;letter-spacing:0.05em;">
                      Purchase Invoice
                    </h1>
                    <p style="margin:10px 0 0 0;color:#000000;font-size:16px;line-height:1.6;text-align:center;font-weight:bold;letter-spacing:0.02em;">
                      ${escapeHtml(invoiceNumber)}
                    </p>

                    <div style="width:60px;height:1px;background-color:#be1e2d;margin:25px auto 0 auto;"></div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 40px 40px 40px;">
                    <p style="margin:0 0 25px 0;color:#000000;font-size:16px;line-height:1.6;letter-spacing:0.02em;">
                      Dear ${escapeHtml(order.customer.name)},
                    </p>

                    <div style="margin:30px 0;">
                      <p style="margin:0 0 20px 0;color:#444444;font-size:15px;line-height:1.8;letter-spacing:0.02em;">
                        Thank you for shopping with Daima Mkenya Africa. Your purchase invoice is attached as a PDF, and a summary of your order is included below for convenience.
                      </p>
                    </div>

                    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:35px 0 25px 0;">
                      <tr>
                        <td style="padding:0 0 12px 0;color:#888888;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;">Invoice Number</td>
                        <td style="padding:0 0 12px 0;color:#000000;font-size:14px;line-height:1.6;text-align:right;font-weight:bold;">${escapeHtml(invoiceNumber)}</td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 12px 0;color:#888888;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;">Order Number</td>
                        <td style="padding:0 0 12px 0;color:#000000;font-size:14px;line-height:1.6;text-align:right;font-weight:bold;">${escapeHtml(order.orderNumber)}</td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 12px 0;color:#888888;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;">Order Date</td>
                        <td style="padding:0 0 12px 0;color:#000000;font-size:14px;line-height:1.6;text-align:right;">${escapeHtml(formatDate(order._createdAt))}</td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 12px 0;color:#888888;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;">Payment Status</td>
                        <td style="padding:0 0 12px 0;color:#000000;font-size:14px;line-height:1.6;text-align:right;font-weight:bold;text-transform:capitalize;">${escapeHtml(order.paymentStatus || "pending")}</td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 12px 0;color:#888888;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;">Payment Method</td>
                        <td style="padding:0 0 12px 0;color:#000000;font-size:14px;line-height:1.6;text-align:right;text-transform:capitalize;">${escapeHtml(order.paymentMethod || "N/A")}</td>
                      </tr>
                      <tr>
                        <td style="padding:0;color:#888888;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;vertical-align:top;">Delivery</td>
                        <td style="padding:0;color:#000000;font-size:14px;line-height:1.6;text-align:right;">${escapeHtml(delivery)}</td>
                      </tr>
                    </table>

                    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:40px 0;">
                      <tr>
                        <td style="background-color:#f9f9f9;padding:25px;border-left:3px solid #be1e2d;">
                          <p style="margin:0 0 14px 0;color:#888888;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;font-weight:normal;">
                            Order Summary
                          </p>
                          <table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                            <thead>
                              <tr>
                                <th style="padding:0 0 12px 0;border-bottom:1px solid #e4e4e4;text-align:left;color:#444444;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;">Item</th>
                                <th style="padding:0 0 12px 0;border-bottom:1px solid #e4e4e4;text-align:center;color:#444444;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;">Qty</th>
                                <th style="padding:0 0 12px 0;border-bottom:1px solid #e4e4e4;text-align:right;color:#444444;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;">Unit Price</th>
                                <th style="padding:0 0 12px 0;border-bottom:1px solid #e4e4e4;text-align:right;color:#444444;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;">Line Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${itemRows}
                            </tbody>
                          </table>

                          <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:22px;">
                            <tr>
                              <td style="padding:0 0 8px 0;color:#666666;font-size:14px;">Subtotal</td>
                              <td style="padding:0 0 8px 0;color:#111111;font-size:14px;text-align:right;">${formatMoney(subtotal)}</td>
                            </tr>
                            <tr>
                              <td style="padding:0 0 8px 0;color:#666666;font-size:14px;">Shipping</td>
                              <td style="padding:0 0 8px 0;color:#111111;font-size:14px;text-align:right;">${formatMoney(shippingFee)}</td>
                            </tr>
                            <tr>
                              <td colspan="2" style="padding-top:10px;">
                                <div style="height:1px;background:#d8d8d8;"></div>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top:12px;color:#000000;font-size:17px;font-weight:bold;">Total</td>
                              <td style="padding-top:12px;color:#000000;font-size:17px;text-align:right;font-weight:bold;">${formatMoney(order.amount)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    ${order.transactionId || order.pesapalOrderTrackingId ? `
                      <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0 40px 0;">
                        <tr>
                          <td style="background-color:#fafafa;padding:18px 22px;border-left:3px solid #e2e2e2;">
                            <p style="margin:0 0 8px 0;color:#888888;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;">Transaction Reference</p>
                            <p style="margin:0;color:#666666;font-size:14px;line-height:1.6;">${escapeHtml(order.transactionId || order.pesapalOrderTrackingId || "")}</p>
                          </td>
                        </tr>
                      </table>
                    ` : ""}

                    <div style="margin-top:50px;">
                      <p style="margin:0 0 5px 0;color:#000000;font-size:15px;line-height:1.6;letter-spacing:0.02em;">
                        Warm regards,
                      </p>
                      <p style="margin:0;color:#000000;font-size:16px;line-height:1.6;font-weight:bold;letter-spacing:0.02em;">
                        Daima Mkenya Africa
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:30px 40px 40px 40px;border-top:1px solid #eeeeee;">
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" style="padding-bottom:20px;">
                          <p style="margin:0;color:#999999;font-size:11px;line-height:1.8;text-transform:uppercase;letter-spacing:0.2em;">
                            P.O Box 63023, 00200 • Nairobi, Kenya
                          </p>
                          <p style="margin:5px 0 0 0;color:#999999;font-size:11px;line-height:1.8;text-transform:uppercase;letter-spacing:0.2em;">
                            <a href="tel:+254721888887" style="color:#999999;text-decoration:none;">+254 721 888 887</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top:15px;">
                          <a href="${getBaseUrl()}"
                             style="color:#666666;font-size:10px;text-decoration:underline;text-transform:uppercase;letter-spacing:0.2em;">
                            VISIT OUR WEBSITE
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td height="2" style="background-color:#be1e2d;"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`;
}

export async function buildInvoicePdfBase64(order: InvoiceOrder) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const invoiceNumber = getInvoiceNumber(order.orderNumber);
  const shippingFee = order.shippingFee || 0;
  const subtotal = Math.max(0, order.amount - shippingFee);
  const delivery = getDeliveryText(order);
  const left = 18;
  const right = 192;
  const pageWidth = right - left;
  let y = 18;

  const logoDataUrl = await getInvoiceLogoDataUrl();

  doc.setFillColor(190, 30, 45);
  doc.rect(left, y, pageWidth, 1.5, "F");
  y += 10;

  if (logoDataUrl) {
    try {
      const logoWidth = 42;
      const logoHeight = 22;
      const logoX = left + (pageWidth - logoWidth) / 2;
      doc.addImage(logoDataUrl, "PNG", logoX, y, logoWidth, logoHeight);
      y += logoHeight + 10;
    } catch (error) {
      console.error("Unable to draw invoice logo in PDF:", error);
      doc.setFont("times", "bold");
      doc.setFontSize(18);
      doc.text("DAIMA MKENYA AFRICA", 105, y + 8, { align: "center" });
      y += 18;
    }
  } else {
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("DAIMA MKENYA AFRICA", 105, y + 8, { align: "center" });
    y += 18;
  }

  doc.setFont("times", "normal");
  doc.setFontSize(18);
  doc.text("PURCHASE INVOICE", 105, y, { align: "center" });
  y += 8;
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text(invoiceNumber, 105, y, { align: "center" });
  y += 8;

  doc.setDrawColor(190, 30, 45);
  doc.setLineWidth(0.35);
  doc.line(92, y, 118, y);
  y += 14;

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  doc.text(`Dear ${order.customer.name || "Customer"},`, left, y);
  y += 10;

  doc.setTextColor(70);
  doc.setFontSize(10.5);
  const intro = doc.splitTextToSize(
    "Thank you for shopping with Daima Mkenya Africa. Your purchase invoice is attached as a PDF, and a summary of your order is included below for convenience.",
    pageWidth,
  ) as string[];
  doc.text(intro, left, y);
  y += intro.length * 5.4 + 7;
  doc.setTextColor(0);

  const metaLabelX = left;
  const metaValueX = right;
  const metaLine = (label: string, value: string) => {
    doc.setFont("times", "normal");
    doc.setTextColor(136);
    doc.setFontSize(8.5);
    doc.text(label.toUpperCase(), metaLabelX, y);
    doc.setTextColor(0);
    doc.setFontSize(10.5);
    doc.setFont("times", label === "Payment Status" ? "bold" : "normal");
    doc.text(value, metaValueX, y, { align: "right" });
    y += 7;
  };

  metaLine("Invoice Number", invoiceNumber);
  metaLine("Order Number", order.orderNumber);
  metaLine("Order Date", formatDate(order._createdAt));
  metaLine("Payment Status", String(order.paymentStatus || "pending").toUpperCase());
  metaLine("Payment Method", String(order.paymentMethod || "N/A"));

  doc.setFont("times", "normal");
  doc.setTextColor(136);
  doc.setFontSize(8.5);
  doc.text("DELIVERY", metaLabelX, y);
  doc.setTextColor(0);
  doc.setFontSize(10.5);
  const deliveryLines = doc.splitTextToSize(delivery, 92) as string[];
  doc.text(deliveryLines, metaValueX, y, { align: "right" });
  y += Math.max(8, deliveryLines.length * 4.6 + 3);

  y += 5;
  const boxTop = y;
  const boxLeft = left;
  const boxWidth = pageWidth;
  const summaryHeaderY = boxTop + 10;

  const rowHeights: number[] = [];
  const wrappedItems = order.items.map((item) => {
    const description = [item.productName, item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
      .filter(Boolean)
      .join(" · ");
    const wrapped = doc.splitTextToSize(description, 84) as string[];
    const rowHeight = Math.max(11, wrapped.length * 4.4 + 6);
    rowHeights.push(rowHeight);
    return { item, wrapped, rowHeight };
  });

  const itemsHeight = rowHeights.reduce((sum, current) => sum + current, 0);
  const totalsHeight = 30;
  const boxHeight = 20 + itemsHeight + totalsHeight;

  doc.setFillColor(249, 249, 249);
  doc.rect(boxLeft, boxTop, boxWidth, boxHeight, "F");
  doc.setFillColor(190, 30, 45);
  doc.rect(boxLeft, boxTop, 1.2, boxHeight, "F");

  doc.setFont("times", "normal");
  doc.setTextColor(136);
  doc.setFontSize(8.5);
  doc.text("ORDER SUMMARY", boxLeft + 7, summaryHeaderY);

  let tableY = summaryHeaderY + 8;
  doc.setTextColor(68);
  doc.setFontSize(8.2);
  doc.text("ITEM", boxLeft + 7, tableY);
  doc.text("QTY", boxLeft + 110, tableY, { align: "center" });
  doc.text("UNIT PRICE", boxLeft + 138, tableY, { align: "right" });
  doc.text("LINE TOTAL", boxLeft + 166, tableY, { align: "right" });
  tableY += 4;
  doc.setDrawColor(228);
  doc.line(boxLeft + 7, tableY, boxLeft + boxWidth - 7, tableY);
  tableY += 6;

  for (const { item, wrapped, rowHeight } of wrappedItems) {
    doc.setFont("times", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(17);
    doc.text(wrapped[0], boxLeft + 7, tableY);
    if (wrapped.length > 1) {
      doc.setFont("times", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(102);
      doc.text(wrapped.slice(1), boxLeft + 7, tableY + 4.4);
    }

    const lineTotal = (item.price || 0) * (item.quantity || 1);
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51);
    doc.text(String(item.quantity || 1), boxLeft + 110, tableY, { align: "center" });
    doc.text(formatMoney(item.price || 0), boxLeft + 138, tableY, { align: "right" });
    doc.setFont("times", "bold");
    doc.setTextColor(17);
    doc.text(formatMoney(lineTotal), boxLeft + 166, tableY, { align: "right" });

    const lineY = tableY + rowHeight - 4;
    doc.setDrawColor(236);
    doc.line(boxLeft + 7, lineY, boxLeft + boxWidth - 7, lineY);
    tableY += rowHeight;
  }

  tableY += 3;
  doc.setFont("times", "normal");
  doc.setTextColor(102);
  doc.setFontSize(9.5);
  doc.text("Subtotal", boxLeft + 108, tableY);
  doc.setTextColor(17);
  doc.text(formatMoney(subtotal), boxLeft + 166, tableY, { align: "right" });
  tableY += 7;
  doc.setTextColor(102);
  doc.text("Shipping", boxLeft + 108, tableY);
  doc.setTextColor(17);
  doc.text(formatMoney(shippingFee), boxLeft + 166, tableY, { align: "right" });
  tableY += 5;
  doc.setDrawColor(216);
  doc.line(boxLeft + 108, tableY, boxLeft + 166, tableY);
  tableY += 8;
  doc.setFont("times", "bold");
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text("Total", boxLeft + 108, tableY);
  doc.text(formatMoney(order.amount), boxLeft + 166, tableY, { align: "right" });

  y = boxTop + boxHeight + 12;

  if (order.transactionId || order.pesapalOrderTrackingId) {
    const reference = String(order.transactionId || order.pesapalOrderTrackingId || "");
    const refLines = doc.splitTextToSize(reference, 140) as string[];
    const refHeight = 18 + Math.max(6, refLines.length * 4.6);

    doc.setFillColor(250, 250, 250);
    doc.rect(left, y, pageWidth, refHeight, "F");
    doc.setFillColor(226, 226, 226);
    doc.rect(left, y, 1.2, refHeight, "F");
    doc.setFont("times", "normal");
    doc.setTextColor(136);
    doc.setFontSize(8.5);
    doc.text("TRANSACTION REFERENCE", left + 7, y + 8);
    doc.setTextColor(102);
    doc.setFontSize(9.5);
    doc.text(refLines, left + 7, y + 15);
    y += refHeight + 12;
  }

  doc.setFont("times", "normal");
  doc.setTextColor(0);
  doc.setFontSize(10.5);
  doc.text("Warm regards,", left, y);
  y += 6;
  doc.setFont("times", "bold");
  doc.text("Daima Mkenya Africa", left, y);

  const footerTop = 270;
  doc.setDrawColor(238);
  doc.line(left, footerTop, right, footerTop);
  doc.setFont("times", "normal");
  doc.setTextColor(153);
  doc.setFontSize(7.8);
  doc.text("P.O BOX 63023, 00200 • NAIROBI, KENYA", 105, footerTop + 11, { align: "center" });
  doc.text("+254 721 888 887", 105, footerTop + 17, { align: "center" });
  doc.setFillColor(190, 30, 45);
  doc.rect(left, 292, pageWidth, 1.1, "F");

  return Buffer.from(doc.output("arraybuffer")).toString("base64");
}
