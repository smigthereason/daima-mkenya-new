// // app/layout.tsx

// import { Playfair_Display } from "next/font/google";
// import "./globals.css";
// import { NextAuthProvider } from "./(root)/providers/NextAuthProvider";

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["400", "700", "900"],
//   style: ["normal", "italic"],
//   display: "swap",
// });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className={playfair.className}>
//       <body className={`${playfair.className} antialiased bg-[#e8e8e8]`}>
//         <NextAuthProvider>
//           {children}
//         </NextAuthProvider>
//       </body>
//     </html>
//   );
// }

// app/layout.tsx

import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { NextAuthProvider } from "./(root)/providers/NextAuthProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// Construct the absolute URL for the image
const baseUrl = "https://daima-mkenya-new.vercel.app";
const imageUrl = `${baseUrl}/assets/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Daima Mkenya Africa",
    template: "%s | Daima Mkenya Africa",
  },
  description:
    "Authentic Kenyan heritage fashion, crafted with intention in Nairobi.",

  // OpenGraph metadata - Simplified for better compatibility
  openGraph: {
    title: "Daima Mkenya Africa",
    description:
      "Authentic Kenyan heritage fashion, crafted with intention in Nairobi.",
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

  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "Daima Mkenya Africa",
    description: "Authentic Kenyan heritage fashion 🇰🇪",
    images: [imageUrl],
    creator: "@daimamkenya",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={playfair.className}>
      <head>
        {/* Essential meta tags - WhatsApp reads these directly */}
        <meta property="og:title" content="Daima Mkenya Africa" />
        <meta
          property="og:description"
          content="Authentic Kenyan heritage fashion, crafted with intention in Nairobi."
        />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Daima Mkenya Africa" />
        <meta
          name="twitter:description"
          content="Authentic Kenyan heritage fashion 🇰🇪"
        />
        <meta name="twitter:image" content={imageUrl} />
      </head>
      <body
        className={`${playfair.className} antialiased bg-[#e8e8e8]`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <NextAuthProvider>
            <CartProvider>{children}</CartProvider>
          </NextAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
