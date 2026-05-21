// sanity/schemaTypes/note.ts
export default {
  name: "note",
  title: "Note",
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
  preview: {
    select: {
      title: "note",
      subtitle: "addedBy",
      date: "addedAt",
    },
    prepare({ title, subtitle, date }: any) {
      return {
        title: title || "No content",
        subtitle: `${subtitle || "Unknown"} • ${date ? new Date(date).toLocaleDateString() : ""}`,
      };
    },
  },
};
