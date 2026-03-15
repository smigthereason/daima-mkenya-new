// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from "sanity";
import { user, account, session, verificationToken } from "./user";
import order from "./order";
import { cart } from "./cart";
import oneOff from "./oneOff";
import priceInquiry from "./priceInquiry";
import productBatch from "./productBatch";
import newsletter from "./newsletter";
import logo from "./logo"; // Add this import

const product: SchemaTypeDefinition = {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "price",
      title: "Price",
      type: "string",
      description: "e.g., Ksh 8,500",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Accessories",
          "Streetwear",
          "Sets",
          "Shirts",
          "Tops",
          "Skirts",
          "Dresses",
          "Jackets",
          "Trousers",
          "Knitwear",
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "details",
      title: "Details",
      type: "object",
      fields: [
        { name: "material", type: "string" },
        { name: "care", type: "string" },
        { name: "origin", type: "string" },
      ],
    },
    {
      name: "colors",
      title: "Colors",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "hex", type: "string" },
          ],
        },
      ],
    },
    {
      name: "sizes",
      title: "Sizes",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "images",
      title: "Images",
      type: "object",
      fields: [
        {
          name: "hero",
          title: "Hero Image",
          type: "image",
          options: { hotspot: true },
        },
        {
          name: "thumbnails",
          title: "Thumbnails",
          type: "array",
          of: [{ type: "image", options: { hotspot: true } }],
        },
      ],
    },
    {
      name: "isNew",
      title: "Is New Arrival",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "stock",
      title: "Stock Quantity",
      type: "number",
      description:
        'Current inventory count. Shows "Low Stock" when 5 or less, "Out of Stock" when 0.',
      validation: (Rule) => Rule.min(0).integer(),
      initialValue: 0,
    },
    {
      name: "disabled",
      title: "Disable Product",
      type: "boolean",
      description:
        "When enabled, this product will not appear in the store (useful for editing or temporary removal)",
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "price",
      media: "images.hero",
      stock: "stock",
      disabled: "disabled",
    },
    prepare(selection: any) {
      const { title, subtitle, media, stock, disabled } = selection;
      const stockStatus =
        stock === 0
          ? "❌ Out of Stock"
          : stock <= 5
            ? "⚠️ Low Stock"
            : "✅ In Stock";
      const disabledStatus = disabled ? "🚫 Disabled" : "";
      return {
        title: title || "Untitled",
        subtitle: `${subtitle || "No price"} | ${stockStatus} ${disabledStatus}`,
        media,
      };
    },
  },
};

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    product,
    user,
    account,
    session,
    verificationToken,
    order,
    cart,
    oneOff,
    priceInquiry,
    productBatch,
    newsletter,
    logo, // Add this line
  ],
};
