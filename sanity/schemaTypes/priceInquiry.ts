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
    },
    {
      name: "customer",
      title: "Customer Information",
      type: "customerInfo",
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
      title: "Registered User",
      type: "reference",
      to: [{ type: "user" }],
    },
    {
      name: "userEmail",
      title: "User Email",
      type: "string",
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
    },
    {
      name: "internalNotes",
      title: "Internal Notes",
      type: "array",
      of: [{ type: "internalNote" }],
    },
    {
      name: "communicationLog",
      title: "Communication Log",
      type: "array",
      of: [{ type: "communicationLog" }],
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
  ],
};

export default priceInquiry;
