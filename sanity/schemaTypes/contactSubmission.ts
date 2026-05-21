// sanity/schemaTypes/contactSubmission.ts
import { SchemaTypeDefinition } from "sanity";

const contactSubmission: SchemaTypeDefinition = {
  name: "contactSubmission",
  title: "Contact Form Submissions",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: "phone",
      title: "Phone Number",
      type: "string",
    },
    {
      name: "subject",
      title: "Subject Type",
      type: "string",
      options: {
        list: [
          { title: "General Enquiry", value: "general" },
          { title: "Order / Shipment", value: "order" },
          { title: "Wholesale / Bulk", value: "wholesale" },
          { title: "Partnership / Media", value: "partnership" },
          { title: "Account / Support", value: "support" },
        ],
      },
    },
    {
      name: "subjectLabel",
      title: "Subject Label",
      type: "string",
    },
    {
      name: "message",
      title: "Message",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In Progress", value: "in_progress" },
          { title: "Replied", value: "replied" },
          { title: "Closed", value: "closed" },
        ],
      },
      initialValue: "new",
    },
    {
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
    },
    {
      name: "repliedAt",
      title: "Replied At",
      type: "datetime",
      readOnly: true,
    },
    {
      name: "notes",
      title: "Internal Notes",
      type: "array",
      of: [{ type: "note" }], // Fixed: using named type
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      subject: "subjectLabel",
      status: "status",
      date: "submittedAt",
    },
    prepare({ title, subtitle, subject, status, date }: any) {
      const statusIcons = {
        new: "🆕",
        in_progress: "⏳",
        replied: "✅",
        closed: "❌",
      };
      const icon = statusIcons[status as keyof typeof statusIcons] || "📝";
      const formattedDate = date ? new Date(date).toLocaleDateString() : "";

      return {
        title: `${icon} ${title || "Unknown"}`,
        subtitle: `${subtitle || "No email"} | ${subject || "No subject"} | ${formattedDate}`,
      };
    },
  },
  orderings: [
    {
      title: "Newest First",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
};

export default contactSubmission;
