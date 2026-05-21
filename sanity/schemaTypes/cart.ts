// sanity/schemaTypes/cart.ts
import { PreviewValue } from "sanity";

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
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "userEmail",
      title: "User Email",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "items",
      title: "Cart Items",
      type: "array",
      of: [{ type: "cartItem" }], // Fixed: using named type
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
    prepare(selection: Record<string, any>): PreviewValue {
      const { title, items, lastUpdated } = selection;
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
