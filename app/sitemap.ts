// // app/sitemap.ts
// import type { MetadataRoute } from "next";
// import { getAllProducts } from "@/types/Product";

// const baseUrl = "https://daimamkenyaafrica.com";

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const staticRoutes: MetadataRoute.Sitemap = [
//     "",
//     "/products",
//     "/gallery",
//     "/about",
//     "/contact",
//   ].map((path) => ({
//     url: `${baseUrl}${path}`,
//     lastModified: new Date(),
//     changeFrequency: "weekly",
//     priority: path === "" ? 1 : 0.8,
//   }));

//   const products = await getAllProducts();

//   const productRoutes: MetadataRoute.Sitemap = products
//     .filter((p) => !p.disabled)
//     .map((product) => ({
//       url: `${baseUrl}/products/${product.slug.current}`,
//       lastModified: new Date(),
//       changeFrequency: "weekly",
//       priority: 0.9,
//     }));

//   return [...staticRoutes, ...productRoutes];
// }
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllProducts } from "@/types/Product";

export const dynamic = "force-dynamic"; // Add this line

const baseUrl = "https://daimamkenyaafrica.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/gallery",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  try {
    const products = await getAllProducts();

    const productRoutes: MetadataRoute.Sitemap = products
      .filter((p) => !p.disabled)
      .map((product) => ({
        url: `${baseUrl}/products/${product.slug.current}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      }));

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
    // Return only static routes if products fail to load
    return staticRoutes;
  }
}
