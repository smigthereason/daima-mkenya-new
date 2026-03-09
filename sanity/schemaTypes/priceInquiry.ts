// sanity/schemaTypes/priceInquiry.ts
import { PreviewValue } from "sanity";

const priceInquiry = {
  name: "priceInquiry",
  title: "Price Inquiries",
  type: "document",
  fields: [
    {
      name: "inquiryNumber",
      title: "Inquiry Number",
      type: "string",
      readOnly: true,
      description: "Auto-generated unique inquiry identifier",
    },
    {
      name: "piece",
      title: "One-Off Piece",
      type: "reference",
      to: [{ type: "oneOff" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "pieceName",
      title: "Piece Name",
      type: "string",
      description: "Denormalized piece name for easy reference",
    },
    {
      name: "customer",
      title: "Customer Information",
      type: "object",
      fields: [
        {
          name: "name",
          title: "Full Name",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "email",
          title: "Email Address",
          type: "string",
          validation: (Rule: any) => Rule.required().email(),
        },
        {
          name: "phone",
          title: "Phone Number",
          type: "string",
        },
        {
          name: "message",
          title: "Additional Message",
          type: "text",
          rows: 3,
        },
      ],
    },
    {
      name: "status",
      title: "Inquiry Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In Review", value: "reviewing" },
          { title: "Quote Sent", value: "quoted" },
          { title: "Follow-up", value: "followup" },
          { title: "Converted to Sale", value: "converted" },
          { title: "Closed/No Interest", value: "closed" },
        ],
      },
      initialValue: "new",
    },
    {
      name: "user",
      title: "Registered User (if applicable)",
      type: "reference",
      to: [{ type: "user" }],
      description: "Link to registered user if they have an account",
    },
    {
      name: "userEmail",
      title: "User Email",
      type: "string",
      description: "Email for quick lookup",
    },
    {
      name: "inquirySource",
      title: "Inquiry Source",
      type: "string",
      options: {
        list: [
          { title: "One-Off Archive Page", value: "oneoff_archive" },
          { title: "Direct Link", value: "direct" },
          { title: "Email", value: "email" },
          { title: "Phone", value: "phone" },
          { title: "Social Media", value: "social" },
        ],
      },
      initialValue: "oneoff_archive",
    },
    {
      name: "quotedPrice",
      title: "Quoted Price",
      type: "string",
      description: "Price quoted to customer (e.g., Ksh 450,000)",
    },
    {
      name: "internalNotes",
      title: "Internal Notes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "note",
              title: "Note",
              type: "text",
            },
            {
              name: "addedBy",
              title: "Added By",
              type: "string",
            },
            {
              name: "addedAt",
              title: "Added At",
              type: "datetime",
              initialValue: () => new Date().toISOString(),
            },
          ],
        },
      ],
      description: "Private notes for staff",
    },
    {
      name: "communicationLog",
      title: "Communication Log",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Email Sent", value: "email_sent" },
                  { title: "Email Received", value: "email_received" },
                  { title: "Phone Call", value: "phone_call" },
                  { title: "WhatsApp", value: "whatsapp" },
                  { title: "Meeting", value: "meeting" },
                ],
              },
            },
            {
              name: "date",
              title: "Date",
              type: "datetime",
            },
            {
              name: "summary",
              title: "Summary",
              type: "text",
            },
            {
              name: "followupDate",
              title: "Follow-up Date",
              type: "datetime",
            },
          ],
        },
      ],
    },
    {
      name: "createdAt",
      title: "Inquiry Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
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
      title: "inquiryNumber",
      customerName: "customer.name",
      pieceName: "pieceName",
      status: "status",
      createdAt: "createdAt",
    },
    prepare(selection: Record<string, any>): PreviewValue {
      const { title, customerName, pieceName, status, createdAt } = selection;
      const statusIcons = {
        new: "🆕",
        reviewing: "📝",
        quoted: "💰",
        followup: "🔄",
        converted: "✅",
        closed: "❌",
      };
      const icon = statusIcons[status as keyof typeof statusIcons] || "📋";
      const date = createdAt ? new Date(createdAt).toLocaleDateString() : "";

      return {
        title: `${icon} ${title || "New Inquiry"} - ${customerName || "Unknown"}`,
        subtitle: `${pieceName || "No piece"} | ${status} | ${date}`,
      };
    },
  },
  orderings: [
    {
      title: "Newest First",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Status",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
};

export default priceInquiry;
