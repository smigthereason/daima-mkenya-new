// app/contact/page.tsx
import type { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";

const baseUrl = "https://daimamkenyaafrica.com";
const pageUrl = `${baseUrl}/contact`;
const ogImage = "https://www.daimamkenyaafrica.com/assets/4.4.webp";

export const metadata: Metadata = {
  title:
    "Contact Daima Mkenya Africa – Kenyan Heritage Fashion Support & Enquiries",
  description:
    "Get in touch with Daima Mkenya Africa for orders, wholesale, and partnership enquiries. Based in Nairobi, Kenya with worldwide support.",
  alternates: {
    canonical: pageUrl,
  },
  keywords: [
    "Daima Mkenya Africa contact",
    "Kenyan clothing brand contact",
    "Nairobi fashion brand email",
    "Kenyan heritage fashion support",
    "Daima Mkenya Africa enquiries",
  ],
  openGraph: {
    title:
      "Contact Daima Mkenya Africa – Kenyan Heritage Fashion Support & Enquiries",
    description:
      "Reach Daima Mkenya Africa for orders, shipments, and collaborations. Nairobi-based Kenyan clothing brand serving customers worldwide.",
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
    title:
      "Contact Daima Mkenya Africa – Kenyan Heritage Fashion Support & Enquiries",
    description:
      "Contact Daima Mkenya Africa in Nairobi for Kenyan heritage fashion orders and support.",
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
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Daima Mkenya Africa",
    url: pageUrl,
    mainEntity: {
      "@type": "Organization",
      name: "Daima Mkenya Africa",
      url: baseUrl,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+254 721 888 887",
          contactType: "customer service",
          email: "info@daimamkenyaafrica.com",
          areaServed: ["KE", "Worldwide"],
        },
      ],
    },
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8] pt-32 pb-16 px-4 md:px-10 lg:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactJsonLd),
        }}
      />
      <ContactPage />
    </main>
  );
}
