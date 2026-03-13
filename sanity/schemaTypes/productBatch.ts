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
      name: "scheduledFor",
      title: "Schedule For",
      type: "datetime",
      description: "Optional: Set a future date/time for the email blast",
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
    {
      name: "emailError",
      title: "Email Error",
      type: "text",
      readOnly: true,
      rows: 2,
    },
  ],
};

export default productBatch;
