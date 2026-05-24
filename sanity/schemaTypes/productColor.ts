// sanity/schemaTypes/productColor.ts
import { SchemaTypeDefinition } from "sanity";

const productColor: SchemaTypeDefinition = {
  name: "productColor",
  title: "Product Color",
  type: "object",
  fields: [
    {
      name: "label",
      title: "Color Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "hex",
      title: "Hex Code",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "image",
      title: "Variant Showcase Image",
      type: "image",
      options: {
        hotspot: true, // Allows clean editorial cropping and focal point framing in Studio
      },
    },
  ],
};

export default productColor;
