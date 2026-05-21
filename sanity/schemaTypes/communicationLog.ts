// sanity/schemaTypes/communicationLog.ts
export default {
  name: "communicationLog",
  title: "Communication Log",
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
};
