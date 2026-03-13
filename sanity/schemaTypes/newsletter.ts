import { SchemaTypeDefinition } from "sanity";

const newsletter: SchemaTypeDefinition = {
  name: "newsletter",
  title: "Newsletter Subscribers",
  type: "document",
  fields: [
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
      readOnly: true,
    },
    {
      name: "unsubscribedAt",
      title: "Unsubscribed At",
      type: "datetime",
      readOnly: true,
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Unsubscribed", value: "unsubscribed" },
        ],
      },
      initialValue: "active",
    },
    {
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
      readOnly: true,
    },
    {
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Website Footer", value: "website_footer" },
          { title: "Popup", value: "popup" },
          { title: "Landing Page", value: "landing_page" },
        ],
      },
    },
  ],
  preview: {
    select: {
      title: "email",
      subtitle: "status",
      date: "subscribedAt",
    },
    prepare({ title, subtitle, date }) {
      return {
        title,
        subtitle: `${subtitle} • ${new Date(date).toLocaleDateString()}`,
      };
    },
  },
};

export default newsletter;
