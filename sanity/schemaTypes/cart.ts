// sanity/schemaTypes/cart.ts

export const cart = {
  name: "cart",
  title: "Shopping Cart",
  type: "document",
  fields: [
    {
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      description: "The user who owns this cart",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "userEmail",
      title: "User Email",
      type: "string",
      description: "Email of the user who owns this cart",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "items",
      title: "Cart Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "cartItem",
          fields: [
            {
              name: "cartId",
              title: "Cart Item ID",
              type: "string",
              description: "Unique identifier for this cart item",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "productName",
              title: "Product Name",
              type: "string",
              description: "Denormalized product name",
            },
            {
              name: "productPrice",
              title: "Product Price",
              type: "string",
              description: "Denormalized product price",
            },
            {
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule: any) => Rule.min(1).integer(),
              initialValue: 1,
            },
            {
              name: "selectedSize",
              title: "Selected Size",
              type: "string",
            },
            {
              name: "selectedColor",
              title: "Selected Color",
              type: "object",
              fields: [
                {
                  name: "label",
                  type: "string",
                },
                {
                  name: "hex",
                  type: "string",
                },
              ],
            },
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
            {
              name: "addedAt",
              title: "Added At",
              type: "datetime",
              initialValue: () => new Date().toISOString(),
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
            prepare({ title, quantity, size, color, price }: any) {
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
      name: "lastUpdated",
      title: "Last Updated",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: "userEmail",
      items: "items",
      lastUpdated: "lastUpdated",
    },
    prepare({ title, items, lastUpdated }: any) {
      const itemCount = items?.length || 0;
      const date = lastUpdated
        ? new Date(lastUpdated).toLocaleDateString()
        : "Never";
      return {
        title: `Cart: ${title || "Unknown User"}`,
        subtitle: `${itemCount} item${itemCount !== 1 ? "s" : ""} • Updated: ${date}`,
      };
    },
  },
};
