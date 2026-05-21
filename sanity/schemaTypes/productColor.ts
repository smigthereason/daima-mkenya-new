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
    },
    {
      name: "hex",
      title: "Hex Code",
      type: "string",
    },
  ],
};

export default productColor;
