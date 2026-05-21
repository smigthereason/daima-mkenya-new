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
    },
    {
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
    },
    {
      name: "userEmail",
      title: "User Email",
      type: "string",
    },
    {
      name: "pesapalOrderTrackingId",
      title: "PesaPal Tracking ID",
      type: "string",
    },
    {
      name: "transactionId",
      title: "Transaction ID",
      type: "string",
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
      initialValue: "pending",
    },
    {
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Paid", value: "paid" },
          { title: "Pending", value: "pending" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "pending",
    },
    {
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "PesaPal", value: "pesapal" },
          { title: "M-Pesa", value: "mpesa" },
          { title: "Card", value: "card" },
        ],
      },
    },
    {
      name: "paymentDate",
      title: "Payment Date",
      type: "datetime",
    },
    {
      name: "paymentConfirmedAt",
      title: "Payment Confirmed At",
      type: "datetime",
    },
    {
      name: "paymentDetails",
      title: "Payment Details",
      type: "paymentDetails",
    },
    {
      name: "customer",
      title: "Customer Info",
      type: "customerInfo",
    },
    {
      name: "deliveryDetails",
      title: "Delivery Details",
      type: "deliveryDetails",
    },
    {
      name: "amount",
      title: "Total Amount",
      type: "number",
    },
    {
      name: "subtotal",
      title: "Subtotal",
      type: "number",
    },
    {
      name: "shippingFee",
      title: "Shipping Fee",
      type: "number",
    },
    {
      name: "items",
      title: "Order Items",
      type: "array",
      of: [{ type: "orderItem" }],
    },
    {
      name: "stockUpdates",
      title: "Stock Update Log",
      type: "array",
      of: [{ type: "stockUpdate" }],
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    },
  ],
  preview: {
    select: {
      title: "orderNumber",
      customerName: "customer.name",
      amount: "amount",
      status: "status",
      method: "deliveryDetails.method",
      station: "deliveryDetails.pickupStationName",
      items: "items",
      paymentStatus: "paymentStatus",
    },
    prepare(selection: any) {
      const {
        title,
        customerName,
        amount,
        status,
        method,
        station,
        items,
        paymentStatus,
      } = selection;
      const devIcon = method === "pickup" ? "🏪" : "🚚";
      const statIcon =
        status === "completed" ? "🟢" : status === "pending" ? "🟡" : "🔴";
      const paymentIcon = paymentStatus === "paid" ? "✅" : "⏳";
      const itemCount = items?.length || 0;
      return {
        title: `${statIcon} ${title || "New Order"} ${paymentIcon}`,
        subtitle: `${customerName || "No Name"} | ${devIcon} ${station || "Home Delivery"} | ${itemCount} item(s) | Ksh ${amount || 0}`,
      };
    },
  },
};
