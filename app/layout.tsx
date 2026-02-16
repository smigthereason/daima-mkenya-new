// app/layout.tsx

import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";
import { CartProvider } from "@/context/CartContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://daima-mkenya-new.vercel.app"),
  title: {
    default: "Daima Mkenya Africa",
    template: "%s | Daima Mkenya Africa",
  },
  description:
    "Authentic Kenyan heritage fashion, crafted with intention in Nairobi.",
  openGraph: {
    title: "Daima Mkenya Africa",
    description:
      "Meaningful color, uncompromising quality, and considered design from the heart of Kenya.",
    url: "https://daima-mkenya-new.vercel.app",
    siteName: "Daima Mkenya Africa",
    images: [
      {
        url: "/assets/og-image.png",
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
    title: "Daima Mkenya Africa",
    description: "Premium Kenyan Heritage Brand",
    images: ["/assets/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.className} antialiased bg-[#e8e8e8]`}>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
