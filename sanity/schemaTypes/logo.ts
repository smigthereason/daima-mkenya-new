// sanity/schemaTypes/logo.ts
import { SchemaTypeDefinition } from "sanity";

const logo: SchemaTypeDefinition = {
  name: "logo",
  title: "Logo & Branding",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Main Logo",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "logoImage",
      title: "Logo Image",
      type: "image",
      description:
        "Upload your logo (PNG with transparent background recommended)",
      options: {
        hotspot: true,
        accept: "image/png, image/jpeg, image/svg+xml",
      },
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Alternative text for accessibility",
          initialValue: "Daima Mkenya Africa Logo",
        },
      ],
    },
    {
      name: "logoFor",
      title: "Usage",
      type: "string",
      description: "Where this logo should be used",
      options: {
        list: [
          { title: "Email & Website", value: "email_website" },
          { title: "Email Only", value: "email_only" },
          { title: "Website Only", value: "website_only" },
        ],
      },
      initialValue: "email_website",
    },
    {
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Only one active logo will be used",
      initialValue: true,
    },
    {
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "logoImage",
      isActive: "isActive",
      usage: "logoFor",
    },
    prepare(selection: any) {
      const { title, media, isActive, usage } = selection;
      return {
        title: title || "Logo",
        subtitle: `${isActive ? "✅ Active" : "⭕ Inactive"} | ${usage || "Not specified"}`,
        media,
      };
    },
  },
};

export default logo;
