// // sanity/schemaTypes/productBatch.ts
// import { SchemaTypeDefinition } from "sanity";

// const productBatch: SchemaTypeDefinition = {
//   name: "productBatch",
//   title: "Product Announcement Batches",
//   type: "document",
//   fields: [
//     {
//       name: "batchName",
//       title: "Batch Name",
//       type: "string",
//       validation: (Rule) => Rule.required(),
//     },
//     {
//       name: "products",
//       title: "Products to Announce",
//       type: "array",
//       of: [{ type: "reference", to: [{ type: "product" }] }],
//       validation: (Rule) => Rule.required().min(5).max(5),
//     },
//     {
//       name: "triggerEmail",
//       title: "Trigger Email Blast",
//       type: "boolean",
//       initialValue: false,
//       description: "Toggle this to 'True' and Publish to send emails.",
//     },
//     {
//       name: "emailSent",
//       title: "Email Notification Sent",
//       type: "boolean",
//       initialValue: false,
//       readOnly: true,
//     },
//     {
//       name: "sentAt",
//       title: "Sent At",
//       type: "datetime",
//       readOnly: true,
//     },
//   ],
// };

// export default productBatch;
// sanity/schemaTypes/productBatch.ts
import { SchemaTypeDefinition } from "sanity";

const productBatch: SchemaTypeDefinition = {
  name: "productBatch",
  title: "Product Announcement Batches",
  type: "document",
  fields: [
    {
      name: "batchName",
      title: "Batch Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "products",
      title: "Products to Announce",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      description: "Select between 3 to 5 new products to announce.",
      validation: (Rule) => Rule.required().min(3).max(5),
    },
    {
      name: "triggerEmail",
      title: "Trigger Email Blast",
      type: "boolean",
      initialValue: false,
      description:
        "Toggle to 'True' and Publish to send to customers with previous purchases.",
    },
    {
      name: "emailSent",
      title: "Email Notification Sent",
      type: "boolean",
      initialValue: false,
      readOnly: true,
    },
    {
      name: "sentAt",
      title: "Sent At",
      type: "datetime",
      readOnly: true,
    },
    {
      name: "recipientCount",
      title: "Number of Recipients",
      type: "number",
      readOnly: true,
    },
  ],
};

export default productBatch;
