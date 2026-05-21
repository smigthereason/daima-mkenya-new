// sanity/schemaTypes/orderItem.ts
export default {
  name: "orderItem",
  title: "Order Item",
  type: "object",
  fields: [
    {
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      weak: true,
    },
    { name: "productId", title: "Product ID", type: "string" },
    { name: "productName", title: "Product Name", type: "string" },
    { name: "quantity", title: "Quantity", type: "number" },
    { name: "price", title: "Price", type: "number" },
    { name: "size", title: "Size", type: "string" },
    { name: "color", title: "Color", type: "string" },
    { name: "colorHex", title: "Color Hex", type: "string" },
    { name: "imageUrl", title: "Product Image", type: "string" },
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
};
