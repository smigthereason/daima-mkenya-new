// lib/sanity/logo.ts
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-03-15",
  useCdn: process.env.NODE_ENV === "production",
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export async function getActiveLogo() {
  try {
    const logo = await client.fetch(
      `*[_type == "logo" && isActive == true && (logoFor == "email_website" || logoFor == "email_only")] | order(_updatedAt desc)[0]{
        _id,
        title,
        "imageUrl": logoImage.asset->url,
        "alt": logoImage.alt,
        logoFor,
        isActive
      }`,
    );
    return logo;
  } catch (error) {
    console.error("Error fetching logo:", error);
    return null;
  }
}

export async function getLogoUrl(width: number = 200, height?: number) {
  try {
    const logo = await getActiveLogo();
    if (!logo?.imageUrl) return null;

    // If using Sanity's image URL builder
    const url = builder.image(logo.imageUrl).width(width).format("png").url();

    return url;
  } catch (error) {
    console.error("Error generating logo URL:", error);
    return null;
  }
}
