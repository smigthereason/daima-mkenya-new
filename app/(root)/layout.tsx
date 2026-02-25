// app/layout.tsx

import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";
import { CartProvider } from "@/context/CartContext";
import { NextAuthProvider } from "./providers/NextAuthProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense } from "react";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={playfair.className}>
      <body
        className={`${playfair.className} antialiased bg-[#e8e8e8]`}
        suppressHydrationWarning={true}
      >
        {/* NextAuthProvider must wrap the content for auth to work */}
        <Suspense>
          <ErrorBoundary>
            <NextAuthProvider>
              <CartProvider>
                <Navbar />
                <main>{children}</main>
                <Footer />
              </CartProvider>
            </NextAuthProvider>
          </ErrorBoundary>
        </Suspense>
      </body>
    </html>
  );
}
