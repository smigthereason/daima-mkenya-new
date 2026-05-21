// sanity/schemaTypes/internalNote.ts
export default {
  name: "internalNote",
  title: "Internal Note",
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
};
