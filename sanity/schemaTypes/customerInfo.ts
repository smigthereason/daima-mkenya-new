// sanity/schemaTypes/customerInfo.ts
export default {
  name: "customerInfo",
  title: "Customer Information",
  type: "object",
  fields: [
    { name: "name", title: "Full Name", type: "string" },
    { name: "phone", title: "Phone Number", type: "string" },
    { name: "email", title: "Email", type: "string" },
  ],
};
