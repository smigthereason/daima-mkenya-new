// sanity/schemaTypes/order.ts
import { PreviewValue } from "sanity";

export default {
  name: "order",
  title: "Orders",
  type: "document",
  fields: [
    {
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      readOnly: true,
      description: "Internal reference (e.g., ORD-2026-X)",
    },
    {
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      description: "The user who placed this order",
    },
    {
      name: "userEmail",
      title: "User Email",
      type: "string",
      description: "Email of the user who placed the order",
    },
    {
      name: "pesapalOrderTrackingId",
      title: "PesaPal Tracking ID",
      type: "string",
      description: "The ID returned by PesaPal once the order is registered",
    },
    {
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Completed", value: "completed" },
          { title: "Pending", value: "pending" },
          { title: "Failed", value: "failed" },
        ],
      },
      initialValue: "completed",
    },
    {
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Paid", value: "paid" },
          { title: "Unpaid", value: "unpaid" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "paid",
    },
    {
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "PesaPal", value: "pesapal" },
          { title: "M-Pesa", value: "mpesa" },
        ],
      },
    },
    {
      name: "paymentDate",
      title: "Payment Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "transactionId",
      title: "Transaction ID",
      type: "string",
      description: "PesaPal transaction ID",
    },
    {
      name: "paymentDetails",
      title: "Payment Details",
      type: "object",
      fields: [
        {
          name: "status_code",
          title: "Status Code",
          type: "number",
          description: "PesaPal status code (1 = success)",
        },
        {
          name: "status",
          title: "Status",
          type: "string",
          description: "PesaPal status message",
        },
        {
          name: "payment_status_description",
          title: "Payment Status Description",
          type: "string",
          description: "Description of payment status (e.g., 'Completed')",
        },
        {
          name: "payment_method",
          title: "Payment Method",
          type: "string",
          description: "Method used (e.g., 'MpesaKE')",
        },
        {
          name: "amount",
          title: "Amount",
          type: "number",
          description: "Payment amount",
        },
        {
          name: "currency",
          title: "Currency",
          type: "string",
          description: "Payment currency (e.g., 'KES')",
        },
        {
          name: "payment_account",
          title: "Payment Account",
          type: "string",
          description:
            "Phone number or account used for payment (e.g., '2547xxx98723')",
        },
        {
          name: "confirmation_code",
          title: "Confirmation Code",
          type: "string",
          description: "M-Pesa confirmation code (e.g., 'UBS7F82T2V')",
        },
      ],
      hidden: false,
    },
    {
      name: "customer",
      title: "Customer Details",
      type: "object",
      fields: [
        { name: "name", type: "string" },
        { name: "email", type: "string" },
        {
          name: "phone",
          type: "string",
          description: "Phone number for customer contact",
        },
        { name: "address", type: "string" },
      ],
    },
    {
      name: "amount",
      title: "Total Amount",
      type: "number",
    },
    {
      name: "items",
      title: "Ordered Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              description:
                "Reference to the product (required for stock updates)",
              validation: (Rule: any) => Rule.required(),
            },
            { name: "productName", type: "string" },
            { name: "quantity", type: "number" },
            { name: "price", type: "string" },
            { name: "size", type: "string" },
            { name: "color", type: "string" },
            {
              name: "productImage",
              title: "Product Image",
              type: "object",
              fields: [
                {
                  name: "hero",
                  title: "Hero Image",
                  type: "image",
                  options: { hotspot: true },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: "productName",
              quantity: "quantity",
              size: "size",
              color: "color",
              price: "price",
            },
            prepare(selection: Record<string, any>) {
              const { title, quantity, size, color, price } = selection;
              return {
                title: title || "Unknown Product",
                subtitle: `${price} | Qty: ${quantity} | Size: ${size} | Color: ${color}`,
              };
            },
          },
        },
      ],
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: "orderNumber",
      customerName: "customer.name",
      customerPhone: "customer.phone",
      status: "status",
      paymentStatus: "paymentStatus",
      amount: "amount",
      date: "createdAt",
      userEmail: "userEmail",
    },
    prepare(selection: Record<string, any>): PreviewValue {
      const {
        title,
        customerName,
        customerPhone,
        status,
        paymentStatus,
        amount,
        date,
        userEmail,
      } = selection;

      const statusColors: Record<string, string> = {
        pending: "🟡",
        completed: "🟢",
        failed: "🔴",
      };

      const paymentIcon =
        paymentStatus === "paid"
          ? "✅"
          : paymentStatus === "refunded"
            ? "↩️"
            : "⏳";
      const phoneDisplay = customerPhone
        ? `📞 ${customerPhone}`
        : "📞 No phone";
      const customer = customerName || userEmail || "No Customer";

      return {
        title: `${statusColors[status] || "⚪"} ${title || "No Order Number"} ${paymentIcon}`,
        subtitle: `${customer} - ${phoneDisplay} - Ksh ${amount?.toLocaleString() || "0"} - ${date ? new Date(date).toLocaleDateString() : ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Date Descending",
      name: "dateDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
};
