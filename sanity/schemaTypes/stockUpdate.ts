// sanity/schemaTypes/stockUpdate.ts
export default {
  name: "stockUpdate",
  title: "Stock Update",
  type: "object",
  fields: [
    { name: "productId", type: "string" },
    { name: "productName", type: "string" },
    { name: "previousStock", type: "number" },
    { name: "newStock", type: "number" },
    { name: "success", type: "boolean" },
    { name: "error", type: "string" },
    { name: "timestamp", type: "datetime" },
  ],
};
