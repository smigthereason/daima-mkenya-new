// sanity/schemaTypes/productDetails.ts
import { SchemaTypeDefinition } from "sanity";

const productDetails: SchemaTypeDefinition = {
  name: "productDetails",
  title: "Product Details",
  type: "object",
  fields: [
    {
      name: "material",
      title: "Material",
      type: "string",
    },
    {
      name: "care",
      title: "Care Instructions",
      type: "string",
    },
    {
      name: "origin",
      title: "Origin",
      type: "string",
    },
  ],
};

export default productDetails;
