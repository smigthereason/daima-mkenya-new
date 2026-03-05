// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllProducts } from "@/types/Product";

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
}
