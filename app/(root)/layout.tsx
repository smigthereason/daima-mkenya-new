// app/(root)/layout.tsx - This is likely where the font should be

import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import "../globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";
import { Analytics } from "@vercel/analytics/next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const baseUrl = "https://daimamkenyaafrica.com";
const imageUrl = `${baseUrl}/assets/og-image.png`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Daima Mkenya Africa | Premium Kenyan Clothing",
    template: "%s | Daima Mkenya Africa",
  },
  description:
    "Authentic Kenyan heritage fashion, crafted with intention in Nairobi. Premium Kenyan-branded clothing made for Kenya and the world.",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Daima Mkenya Africa | Premium Kenyan Clothing",
    description:
      "Authentic Kenyan heritage fashion, crafted with intention in Nairobi. Premium Kenyan-branded clothing made for Kenya and the world.",
    url: baseUrl,
    siteName: "Daima Mkenya Africa",
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: "Daima Mkenya Africa - Heritage Fashion",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daima Mkenya Africa | Premium Kenyan Clothing",
    description:
      "Authentic Kenyan heritage fashion 🇰🇪 — premium Kenyan-branded clothing made in Nairobi.",
    images: [imageUrl],
    creator: "@Daimaafricake_",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={playfair.className}>
      <ErrorBoundary>
        <Navbar />
        {children}
        <Footer />
      </ErrorBoundary>
      <Analytics />
    </div>
  );
}
