// app/layout.tsx - Main Layout (Keep this simple)

import type { Metadata } from "next";
import "./globals.css";

import { CartProvider } from "@/context/CartContext";
import { NextAuthProvider } from "./(root)/providers/NextAuthProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense } from "react";
import FloatingWhatsApp from "@/components/landing-page/FloatingWhatsapp";

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
    <html lang="en">
      <body
        className="antialiased bg-[#e8e8e8]"
        suppressHydrationWarning={true}
      >
        <Suspense>
          <ErrorBoundary>
            <NextAuthProvider>
              <CartProvider>
                <main>{children}</main>
                <FloatingWhatsApp />
              </CartProvider>
            </NextAuthProvider>
          </ErrorBoundary>
        </Suspense>
      </body>
    </html>
  );
}
