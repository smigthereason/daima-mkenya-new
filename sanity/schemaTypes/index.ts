// // sanity/schemaTypes/index.ts
// import { type SchemaTypeDefinition } from "sanity";
// import { user, account, session, verificationToken } from "./user";
// import order from "./order";
// import { cart } from "./cart";
// import oneOff from "./oneOff";
// import priceInquiry from "./priceInquiry";
// import productBatch from "./productBatch";
// import newsletter from "./newsletter";
// import logo from "./logo";
// import contactSubmission from "./contactSubmission";
// import productDetails from "./productDetails";
// import productColor from "./productColor";
// import productImages from "./productImages";
// import customerInfo from "./customerInfo";
// import deliveryDetails from "./deliveryDetails";
// import paymentDetails from "./paymentDetails";
// import orderItem from "./orderItem";
// import stockUpdate from "./stockUpdate";
// import cartItem from "./cartItem";
// import note from "./note";
// import internalNote from "./internalNote";
// import communicationLog from "./communicationLog";

// const product: SchemaTypeDefinition = {
//   name: "product",
//   title: "Product",
//   type: "document",
//   fields: [
//     {
//       name: "name",
//       title: "Name",
//       type: "string",
//       validation: (Rule) => Rule.required(),
//     },
//     {
//       name: "slug",
//       title: "Slug",
//       type: "slug",
//       options: { source: "name" },
//       validation: (Rule) => Rule.required(),
//     },
//     {
//       name: "price",
//       title: "Price",
//       type: "string",
//       validation: (Rule) => Rule.required(),
//     },
//     {
//       name: "category",
//       title: "Category",
//       type: "string",
//       options: {
//         list: [
//           "Accessories",
//           "Streetwear",
//           "Sets",
//           "Shirts",
//           "Tops",
//           "Skirts",
//           "Dresses",
//           "Jackets",
//           "Trousers",
//           "Knitwear",
//         ],
//       },
//       validation: (Rule) => Rule.required(),
//     },
//     {
//       name: "description",
//       title: "Description",
//       type: "array",
//       of: [{ type: "string" }],
//     },
//     {
//       name: "details",
//       title: "Details",
//       type: "productDetails",
//     },
//     {
//       name: "colors",
//       title: "Colors",
//       type: "array",
//       of: [{ type: "productColor" }],
//     },
//     {
//       name: "sizes",
//       title: "Sizes",
//       type: "array",
//       of: [{ type: "string" }],
//     },
//     {
//       name: "images",
//       title: "Images",
//       type: "productImages",
//     },
//     {
//       name: "isNew",
//       title: "Is New Arrival",
//       type: "boolean",
//       initialValue: false,
//     },
//     {
//       name: "stock",
//       title: "Stock Quantity",
//       type: "number",
//       validation: (Rule) => Rule.min(0).integer(),
//       initialValue: 0,
//     },
//     {
//       name: "disabled",
//       title: "Disable Product",
//       type: "boolean",
//       initialValue: false,
//     },
//   ],
//   preview: {
//     select: {
//       title: "name",
//       subtitle: "price",
//       media: "images.hero",
//       stock: "stock",
//       disabled: "disabled",
//     },
//     prepare(selection: any) {
//       const { title, subtitle, media, stock, disabled } = selection;
//       const stockStatus =
//         stock === 0
//           ? "❌ Out of Stock"
//           : stock <= 5
//             ? "⚠️ Low Stock"
//             : "✅ In Stock";
//       const disabledStatus = disabled ? "🚫 Disabled" : "";
//       return {
//         title: title || "Untitled",
//         subtitle: `${subtitle || "No price"} | ${stockStatus} ${disabledStatus}`,
//         media,
//       };
//     },
//   },
// };

// export const schema: { types: SchemaTypeDefinition[] } = {
//   types: [
//     product,
//     user,
//     account,
//     session,
//     verificationToken,
//     order,
//     cart,
//     oneOff,
//     priceInquiry,
//     productBatch,
//     newsletter,
//     logo,
//     contactSubmission,
//     productDetails,
//     productColor,
//     productImages,
//     customerInfo,
//     deliveryDetails,
//     paymentDetails,
//     orderItem,
//     stockUpdate,
//     cartItem,
//     note,
//     internalNote,
//     communicationLog,
//   ],
// };
import { type SchemaTypeDefinition } from "sanity";
import { user, account, session, verificationToken } from "./user";
import order from "./order";
import { cart } from "./cart";
import oneOff from "./oneOff";
import priceInquiry from "./priceInquiry";
import productBatch from "./productBatch";
import newsletter from "./newsletter";
import logo from "./logo";
import contactSubmission from "./contactSubmission";
import productDetails from "./productDetails";
import productColor from "./productColor";
import productImages from "./productImages";
import customerInfo from "./customerInfo";
import deliveryDetails from "./deliveryDetails";
import paymentDetails from "./paymentDetails";
import orderItem from "./orderItem";
import stockUpdate from "./stockUpdate";
import cartItem from "./cartItem";
import note from "./note";
import internalNote from "./internalNote";
import communicationLog from "./communicationLog";
import collection from "./collection"; // ← NEW

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
      validation: (Rule) => Rule.required(),
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
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
          "Pants",
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    },

    // NEW: Gender / Audience
    {
      name: "gender",
      title: "Gender / Audience",
      type: "string",
      description: "Select the audience this product belongs to.",
      options: {
        list: [
          { title: "Men", value: "men" },
          { title: "Women", value: "women" },
          { title: "Unisex", value: "unisex" },
          { title: "Kids", value: "kids" },
        ],
        layout: "radio",
      },
    },

    {
      name: "collection",
      title: "Collection",
      type: "reference",
      to: [{ type: "collection" }],
      description:
        "Group products that share the same design/print (e.g. Jasiri)",
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
      type: "productDetails",
    },
    {
      name: "colors",
      title: "Colors",
      type: "array",
      of: [{ type: "productColor" }],
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
      type: "productImages",
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
      validation: (Rule) => Rule.min(0).integer(),
      initialValue: 0,
    },
    {
      name: "disabled",
      title: "Disable Product",
      type: "boolean",
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
    collection, // ← NEW
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
    logo,
    contactSubmission,
    productDetails,
    productColor,
    productImages,
    customerInfo,
    deliveryDetails,
    paymentDetails,
    orderItem,
    stockUpdate,
    cartItem,
    note,
    internalNote,
    communicationLog,
  ],
};
