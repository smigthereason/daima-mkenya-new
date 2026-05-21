// sanity/schemaTypes/cartItem.ts
export default {
  name: "cartItem",
  title: "Cart Item",
  type: "object",
  fields: [
    {
      name: "cartId",
      title: "Cart Item ID",
      type: "string",
    },
    {
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
    },
    {
      name: "productName",
      title: "Product Name",
      type: "string",
    },
    {
      name: "productPrice",
      title: "Product Price",
      type: "string",
    },
    {
      name: "quantity",
      title: "Quantity",
      type: "number",
    },
    {
      name: "selectedSize",
      title: "Selected Size",
      type: "string",
    },
    {
      name: "selectedColor",
      title: "Selected Color",
      type: "productColor",
    },
    {
      name: "addedAt",
      title: "Added At",
      type: "datetime",
    },
  ],
  preview: {
    select: {
      title: "productName",
      quantity: "quantity",
      size: "selectedSize",
      color: "selectedColor.label",
      price: "productPrice",
    },
    prepare(selection: any) {
      const { title, quantity, size, color, price } = selection;
      return {
        title: title || "Unknown Product",
        subtitle: `${price} | Qty: ${quantity} | Size: ${size} | Color: ${color}`,
      };
    },
  },
};
