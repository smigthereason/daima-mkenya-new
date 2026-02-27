// // types/Product.ts
// import { client } from "@/sanity/lib/client";

// export interface ProductColor {
//   label: string;
//   hex: string;
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
//   stock: number; // New field for inventory tracking
// }

// // GROQ Query to fetch all products (updated to include stock)
// export const getAllProducts = async (): Promise<Product[]> => {
//   const query = `*[_type == "product"] {
//     _id,
//     name,
//     price,
//     description,
//     category,
//     slug,
//     details,
//     colors,
//     sizes,
//     images,
//     stock
//   }`;
//   return await client.fetch(query);
// };

// // GROQ Query to fetch a single product by ID (updated to include stock)
// export const getProductById = async (id: string): Promise<Product> => {
//   const query = `*[_type == "product" && _id == $id][0] {
//     _id,
//     name,
//     price,
//     description,
//     category,
//     slug,
//     details,
//     colors,
//     sizes,
//     images,
//     stock
//   }`;
//   return await client.fetch(query, { id });
// };

// // GROQ Query to fetch a single product by Slug (updated to include stock)
// export const getProductBySlug = async (slug: string): Promise<Product> => {
//   const query = `*[_type == "product" && slug.current == $slug][0] {
//     _id,
//     name,
//     price,
//     description,
//     category,
//     slug,
//     details,
//     colors,
//     sizes,
//     images,
//     stock
//   }`;
//   return await client.fetch(query, { slug });
// };
// types/Product.ts
import { client } from "@/sanity/lib/client";

export interface ProductColor {
  label: string;
  hex: string;
}

export interface Product {
  _id: string;
  name: string;
  price: string;
  slug: {
    current: string;
  };
  description: string[];
  category: string;
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
  disabled?: boolean; // Optional disabled field
}

// GROQ Query to fetch only enabled products (disabled != true)
export const getAllProducts = async (): Promise<Product[]> => {
  const query = `*[_type == "product" && (disabled != true || !defined(disabled))] {
    _id,
    name,
    price,
    description,
    category,
    slug,
    details,
    colors,
    sizes,
    images,
    stock,
    disabled
  } | order(_createdAt desc)`; // Optional: order by newest first
  return await client.fetch(query);
};

// GROQ Query to fetch a single product by ID (includes disabled products for direct access)
export const getProductById = async (id: string): Promise<Product> => {
  const query = `*[_type == "product" && _id == $id][0] {
    _id,
    name,
    price,
    description,
    category,
    slug,
    details,
    colors,
    sizes,
    images,
    stock,
    disabled
  }`;
  return await client.fetch(query, { id });
};

// GROQ Query to fetch a single product by Slug (includes disabled products for direct access)
export const getProductBySlug = async (slug: string): Promise<Product> => {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    price,
    description,
    category,
    slug,
    details,
    colors,
    sizes,
    images,
    stock,
    disabled
  }`;
  return await client.fetch(query, { slug });
};

// Optional: Admin query to get all products including disabled ones
export const getAllProductsAdmin = async (): Promise<Product[]> => {
  const query = `*[_type == "product"] {
    _id,
    name,
    price,
    description,
    category,
    slug,
    details,
    colors,
    sizes,
    images,
    stock,
    disabled
  } | order(_createdAt desc)`;
  return await client.fetch(query);
};
