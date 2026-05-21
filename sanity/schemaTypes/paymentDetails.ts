// sanity/schemaTypes/paymentDetails.ts
export default {
  name: "paymentDetails",
  title: "Payment Details",
  type: "object",
  fields: [
    { name: "amount", title: "Amount", type: "number" },
    { name: "confirmation_code", title: "Confirmation Code", type: "string" },
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
};
