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
      initialValue: "paid", // Changed from "pending" to "paid"
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
      name: "paymentDetails",
      title: "Payment Details",
      type: "object",
      fields: [
        { name: "amount", title: "Amount", type: "number" },
        {
          name: "confirmation_code",
          title: "Confirmation Code",
          type: "string",
        },
        { name: "currency", title: "Currency", type: "string" },
        { name: "payment_account", title: "Payment Account", type: "string" },
        { name: "payment_method", title: "Payment Method", type: "string" },
        {
          name: "payment_status_description",
          title: "Payment Status Description",
          type: "string",
        },
        { name: "status", title: "Status", type: "string" },
        { name: "status_code", title: "Status Code", type: "number" },
      ],
    },
    {
      name: "customer",
      title: "Customer Info",
      type: "object",
      fields: [
        { name: "name", title: "Full Name", type: "string" },
        { name: "phone", title: "Phone Number", type: "string" },
        { name: "email", title: "Email", type: "string" },
      ],
    },
    {
      name: "deliveryDetails",
      title: "Delivery Details",
      type: "object",
      fields: [
        {
          name: "method",
          title: "Method",
          type: "string",
          options: {
            list: [
              { title: "Home Delivery", value: "shipping" },
              { title: "Pickup Station", value: "pickup" },
            ],
          },
        },
        { name: "city", title: "City/County", type: "string" },
        {
          name: "pickupStationName",
          title: "Pickup Station Name",
          type: "string",
        },
        { name: "pickupStationId", title: "Pickup Station ID", type: "string" },
        {
          name: "shippingAddress",
          title: "Address/Building/Floor",
          type: "string",
        },
      ],
    },
    {
      name: "amount",
      title: "Total Amount",
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
      of: [
        {
          type: "object",
          fields: [
            {
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
            },
            { name: "productName", title: "Product Name", type: "string" },
            { name: "quantity", title: "Quantity", type: "number" },
            { name: "price", title: "Price", type: "number" },
            { name: "size", title: "Size", type: "string" },
            { name: "color", title: "Color", type: "string" },
          ],
          preview: {
            select: {
              title: "productName",
              quantity: "quantity",
              price: "price",
              size: "size",
              color: "color",
            },
            prepare(selection: any) {
              const { title, quantity, price, size, color } = selection;
              return {
                title: title || "Unknown Product",
                subtitle: `Qty: ${quantity} | ${price} | ${size} | ${color}`,
              };
            },
          },
        },
      ],
    },
    {
      name: "stockUpdates",
      title: "Stock Update Log",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "productId", type: "string" },
            { name: "productName", type: "string" },
            { name: "previousStock", type: "number" },
            { name: "newStock", type: "number" },
            { name: "success", type: "boolean" },
            { name: "error", type: "string" },
          ],
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
