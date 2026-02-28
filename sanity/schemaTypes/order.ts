// sanity/schemaTypes/order.ts

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
          { title: "Pending", value: "pending" },
          { title: "Completed", value: "completed" },
          { title: "Failed", value: "failed" },
        ],
      },
      initialValue: "pending",
    },
    {
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Paid", value: "paid" },
          { title: "Unpaid", value: "unpaid" },
        ],
      },
      initialValue: "unpaid",
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
        { name: "status_code", type: "number" },
        { name: "status", type: "string" },
        { name: "payment_status_description", type: "string" },
        { name: "payment_method", type: "string" },
        { name: "amount", type: "number" },
        { name: "currency", type: "string" },
        {
          name: "payment_account",
          type: "string",
          description: "Phone number or account used for payment",
        },
        {
          name: "phone_number",
          type: "string",
          description: "Phone number from PesaPal",
        },
      ],
      // Not hidden anymore so we can see the payment account
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
            { name: "productName", type: "string" },
            { name: "quantity", type: "number" },
            { name: "price", type: "string" },
            { name: "size", type: "string" },
            { name: "color", type: "string" },
          ],
          preview: {
            select: {
              title: "productName",
              quantity: "quantity",
              size: "size",
              color: "color",
              price: "price",
            },
            prepare({
              title,
              quantity,
              size,
              color,
              price,
            }: {
              title: string;
              quantity: number;
              size: string;
              color: string;
              price: string;
            }) {
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
    prepare({
      title,
      customerName,
      customerPhone,
      status,
      paymentStatus,
      amount,
      date,
      userEmail,
    }: {
      title: string;
      customerName: string;
      customerPhone: string;
      status: string;
      paymentStatus: string;
      amount: number;
      date: string;
      userEmail: string;
    }) {
      const statusColors: Record<string, string> = {
        pending: "🟡",
        completed: "🟢",
        failed: "🔴",
      };

      const paymentIcon = paymentStatus === "paid" ? "✅" : "⏳";
      const phoneDisplay = customerPhone
        ? `📞 ${customerPhone}`
        : "📞 No phone";

      return {
        title: `${statusColors[status] || "⚪"} ${title || "No Order Number"} ${paymentIcon}`,
        subtitle: `${customerName || "No Customer"} - ${phoneDisplay} - Ksh ${amount?.toLocaleString() || "0"} - ${new Date(date).toLocaleDateString()}`,
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
