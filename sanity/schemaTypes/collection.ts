import { defineType, defineField } from "sanity";

export default defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Collection Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g. Jasiri, Heritage Edit, Bold Prints",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "material",
      title: "Material",
      type: "string",
    }),
    defineField({
      name: "printDesign",
      title: "Print Design",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "printDesign",
      media: "heroImage",
    },
  },
});
