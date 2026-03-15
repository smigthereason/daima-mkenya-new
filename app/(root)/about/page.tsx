// app/about/page.tsx
import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";

const baseUrl = "https://daimamkenyaafrica.com";
const pageUrl = `${baseUrl}/about`;
const ogImage = "https://www.daimamkenyaafrica.com/assets/4.4.webp";

export const metadata: Metadata = {
  title: "About Daima Mkenya Africa –  Heritage Fashion & Identity",
  description:
    "Daima Mkenya Africa is a Kenyan-owned apparel brand from Nairobi, crafting premium clothing inspired by the Kenyan flag, local artisans, and national identity.",
  alternates: {
    canonical: pageUrl,
  },
  keywords: [
    "Daima Mkenya Africa",
    "Kenyan clothing brand",
    "Kenyan heritage fashion",
    "Kenyan flag colors clothing",
    "Nairobi apparel brand",
    "Made in Kenya clothing",
  ],
  openGraph: {
    title: "About Daima Mkenya Africa – Heritage Fashion &  Identity",
    description:
      "Learn about Daima Mkenya Africa, a Kenyan-owned apparel brand celebrating identity, flag colors, and craftsmanship with clothing born in Kenya and worn everywhere.",
    url: pageUrl,
    siteName: "Daima Mkenya Africa",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Daima Mkenya Africa – Unity in Every Thread",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    title: "About Daima Mkenya Africa – Heritage Fashion &  Identity",
    description:
      "Discover the story behind Daima Mkenya Africa, a Nairobi-based clothing brand celebrating Kenyan identity, craftsmanship, and meaningful color.",
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
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Daima Mkenya Africa",
    url: baseUrl,
    logo: "https://www.daimamkenyaafrica.com/assets/logo.png",
    description:
      "Daima Mkenya Africa is a Kenyan-owned apparel and fabric brand based in Nairobi, crafting premium clothing that celebrates national identity and cultural heritage.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
      postalCode: "00200",
      postOfficeBoxNumber: "63023",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+254 721 888 887",
        contactType: "customer service",
        email: "info@daimamkenyaafrica.com",
        areaServed: ["KE", "Worldwide"],
      },
    ],
    sameAs: [
      // fill these with real profiles when available
      "https://www.facebook.com/daimamkenyaafrica",
      "https://www.instagram.com/daimamkenyaafrica",
      "https://x.com/Daimaafricake_",
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <AboutPage />
    </main>
  );
}
