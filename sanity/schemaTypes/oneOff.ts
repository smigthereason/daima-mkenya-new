import { type SchemaTypeDefinition } from "sanity";

const oneOff: SchemaTypeDefinition = {
  name: "oneOff",
  title: "One-Off Archive",
  type: "document",
  fields: [
    { name: "name", title: "Piece Name", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    {
      name: "editionInfo",
      title: "Edition Details",
      type: "string",
      description: "e.g., 1 of 1, Limited Run of 3",
      initialValue: "1 of 1",
    },
    {
      name: "description",
      title: "Concept Narrative",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "image",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "status",
      title: "Current Status",
      type: "string",
      options: {
        list: [
          { title: "Available for Inquiry", value: "available" },
          { title: "Private Collection (Sold)", value: "sold" },
        ],
      },
      initialValue: "available",
    },
  ],
};

export default oneOff;
