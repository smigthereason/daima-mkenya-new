// sanity/schemaTypes/productImages.ts
export default {
  name: "productImages",
  title: "Product Images",
  type: "object",
  fields: [
    {
      name: "hero",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "thumbnails",
      title: "Thumbnails",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    },
  ],
};
