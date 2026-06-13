// // types/Product.ts
// import { client } from "@/sanity/lib/client";

// export interface ProductColor {
//   label: string;
//   hex: string;
//   image?: {
//     _type: "image";
//     asset: {
//       _ref: string;
//       _type: "reference";
//       url?: string;
//     };
//   };
// }

// export interface Product {
//   _id: string;
//   name: string;
//   price: string;
//   slug: {
//     current: string;
//   };
//   description: string[];
//   category: string;
//   details: {
//     material: string;
//     care: string;
//     origin: string;
//   };
//   colors: ProductColor[];
//   sizes: string[];
//   images: {
//     hero: any;
//     thumbnails: any[];
//   };
//   stock: number;
//   disabled?: boolean;
//   isNew?: boolean; // ADDED: New arrival toggle field
// }

// // GROQ Query to fetch only enabled products (disabled != true)
// export const getAllProducts = async (): Promise<Product[]> => {
//   const query = `*[_type == "product" && (disabled != true || !defined(disabled))] {
//     _id,
//     name,
//     price,
//     description,
//     category,
//     slug,
//     details,
//     colors[] {
//       label,
//       hex,
//       image {
//         asset-> {
//           _id,
//           url
//         }
//       }
//     },
//     sizes,
//     images,
//     stock,
//     disabled,
//     isNew
//   } | order(_createdAt desc)`;
//   return await client.fetch(query);
// };

// // ADDED: GROQ Query to fetch only New Arrivals (isNew == true)
// export const getNewArrivals = async (): Promise<Product[]> => {
//   const query = `*[_type == "product" && isNew == true && (disabled != true || !defined(disabled))] {
//     _id,
//     name,
//     price,
//     description,
//     category,
//     slug,
//     details,
//     colors[] {
//       label,
//       hex,
//       image {
//         asset-> {
//           _id,
//           url
//         }
//       }
//     },
//     sizes,
//     images,
//     stock,
//     disabled,
//     isNew
//   } | order(_createdAt desc)`;
//   return await client.fetch(query);
// };

// // GROQ Query to fetch a single product by ID
// export const getProductById = async (id: string): Promise<Product> => {
//   const query = `*[_type == "product" && _id == $id][0] {
//     _id,
//     name,
//     price,
//     description,
//     category,
//     slug,
//     details,
//     colors[] {
//       label,
//       hex,
//       image {
//         asset-> {
//           _id,
//           url
//         }
//       }
//     },
//     sizes,
//     images,
//     stock,
//     disabled,
//     isNew
//   }`;
//   return await client.fetch(query, { id });
// };

// // GROQ Query to fetch a single product by Slug
// export const getProductBySlug = async (slug: string): Promise<Product> => {
//   const query = `*[_type == "product" && slug.current == $slug][0] {
//     _id,
//     name,
//     price,
//     description,
//     category,
//     slug,
//     details,
//     colors[] {
//       label,
//       hex,
//       image {
//         asset-> {
//           _id,
//           url
//         }
//       }
//     },
//     sizes,
//     images,
//     stock,
//     disabled,
//     isNew
//   }`;
//   return await client.fetch(query, { slug });
// };

// // Admin query to get all products including disabled ones
// export const getAllProductsAdmin = async (): Promise<Product[]> => {
//   const query = `*[_type == "product"] {
//     _id,
//     name,
//     price,
//     description,
//     category,
//     slug,
//     details,
//     colors[] {
//       label,
//       hex,
//       image {
//         asset-> {
//           _id,
//           url
//         }
//       }
//     },
//     sizes,
//     images,
//     stock,
//     disabled,
//     isNew
//   } | order(_createdAt desc)`;
//   return await client.fetch(query);
// };
import { client } from "@/sanity/lib/client";

export interface ProductColor {
  label: string;
  hex: string;
  image?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
      url?: string;
    };
  };
}

export interface Product {
  _id: string;
  name: string;
  price: string;
  slug: {
    current: string;
  };
  description: string[];
  categories: string[]; // ← CHANGED from category: string
  collection?: {
    _id: string;
    name: string;
    slug: { current: string };
  };
  details: {
    material: string;
    care: string;
    origin: string;
  };
  colors: ProductColor[];
  sizes: string[];
  images: {
    hero: any;
    thumbnails: any[];
  };
  stock: number;
  disabled?: boolean;
  isNew?: boolean;
}

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  const query = `*[_type == "product" && (disabled != true || !defined(disabled))] {
    _id,
    name,
    price,
    description,
    categories,
    "collection": collection->{ _id, name, slug },
    slug,
    details,
    colors[] {
      label,
      hex,
      image {
        asset-> {
          _id,
          url
        }
      }
    },
    sizes,
    images,
    stock,
    disabled,
    isNew
  } | order(_createdAt desc)`;
  return await client.fetch(query);
};

// Get New Arrivals
export const getNewArrivals = async (): Promise<Product[]> => {
  const query = `*[_type == "product" && isNew == true && (disabled != true || !defined(disabled))] {
    _id,
    name,
    price,
    description,
    categories,
    "collection": collection->{ _id, name, slug },
    slug,
    details,
    colors[] {
      label,
      hex,
      image {
        asset-> {
          _id,
          url
        }
      }
    },
    sizes,
    images,
    stock,
    disabled,
    isNew
  } | order(_createdAt desc)`;
  return await client.fetch(query);
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product> => {
  const query = `*[_type == "product" && _id == $id][0] {
    _id,
    name,
    price,
    description,
    categories,
    "collection": collection->{ _id, name, slug },
    slug,
    details,
    colors[] {
      label,
      hex,
      image {
        asset-> {
          _id,
          url
        }
      }
    },
    sizes,
    images,
    stock,
    disabled,
    isNew
  }`;
  return await client.fetch(query, { id });
};

// Get product by Slug
export const getProductBySlug = async (slug: string): Promise<Product> => {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    price,
    description,
    categories,
    "collection": collection->{ _id, name, slug },
    slug,
    details,
    colors[] {
      label,
      hex,
      image {
        asset-> {
          _id,
          url
        }
      }
    },
    sizes,
    images,
    stock,
    disabled,
    isNew
  }`;
  return await client.fetch(query, { slug });
};

// Admin query
export const getAllProductsAdmin = async (): Promise<Product[]> => {
  const query = `*[_type == "product"] {
    _id,
    name,
    price,
    description,
    categories,
    "collection": collection->{ _id, name, slug },
    slug,
    details,
    colors[] {
      label,
      hex,
      image {
        asset-> {
          _id,
          url
        }
      }
    },
    sizes,
    images,
    stock,
    disabled,
    isNew
  } | order(_createdAt desc)`;
  return await client.fetch(query);
};
