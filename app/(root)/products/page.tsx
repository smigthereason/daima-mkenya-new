import ProductPage from "@/components/ProductPage";
import type { Metadata } from "next";

const baseUrl = "https://daimamkenyaafrica.com";
const pagePath = "/products";
const pageUrl = `${baseUrl}${pagePath}`;
const ogImage = "https://www.daimamkenyaafrica.com/assets/4.4.webp";

const pageTitle =
  "Products & Heritage Fashion – Daima Mkenya Africa";

const pageDescription =
  "Discover premium Kenyan-branded clothing made in Nairobi. Shop shirts, hoodies, kikoy, dresses & more with secure checkout and fast worldwide shipping from Daima Mkenya Africa.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  keywords: [
    "Kenyan clothing",
    "Kenyan heritage fashion",
    "Kenyan hoodies",
    "Kenyan kikoy",
    "African fashion Nairobi",
    "Daima Mkenya Africa",
    "Kenyan dresses",
    "Kenyan streetwear",
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: "Daima Mkenya Africa",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Daima Mkenya Africa - Heritage Fashion",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
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
  return <ProductPage />;
}
