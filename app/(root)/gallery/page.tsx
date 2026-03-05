// app/gallery/page.tsx
import type { Metadata } from "next";
import GalleryPage from "@/components/GalleryPage";

const baseUrl = "https://daimamkenyaafrica.com";
const pageUrl = `${baseUrl}/gallery`;
const ogImage = "https://www.daimamkenyaafrica.com/assets/4.4.webp";

export const metadata: Metadata = {
  title:
    "Gallery – Kenyan Heritage Fashion Lookbook | Daima Mkenya Africa",
  description:
    "Explore the Daima Mkenya Africa gallery: a visual lookbook of Kenyan-branded clothing, meaningful color, and craftsmanship born in Nairobi and worn worldwide.",
  alternates: {
    canonical: pageUrl,
  },
  keywords: [
    "Daima Mkenya Africa gallery",
    "Kenyan fashion lookbook",
    "Kenyan clothing gallery",
    "African fashion photography Nairobi",
    "Kenyan heritage fashion collection",
  ],
  openGraph: {
    title:
      "Daima Mkenya Africa Gallery – Kenyan Heritage Fashion Lookbook",
    description:
      "View the Daima Mkenya Africa gallery featuring Kenyan-inspired clothing, flag colors, and artisan-made pieces captured in Nairobi.",
    url: pageUrl,
    siteName: "Daima Mkenya Africa",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Daima Mkenya Africa – Kenyan Heritage Fashion Gallery",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    title:
      "Daima Mkenya Africa Gallery – Kenyan Heritage Fashion Lookbook",
    description:
      "Step inside the Daima Mkenya Africa gallery to see Kenyan heritage fashion, meaningful color, and Nairobi craftsmanship.",
    card: "summary_large_image",
    images: ogImage,
    creator: "@Daimaafricake_",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryPage />
    </main>
  );
}
