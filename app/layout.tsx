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
const imageUrl = "https://daima-mkenya-new.vercel.app/assets/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://daima-mkenya-new.vercel.app"),
  title: {
    default: "Daima Mkenya Africa",
    template: "%s | Daima Mkenya Africa",
  },
  description: "Authentic Kenyan heritage fashion, crafted with intention in Nairobi.",
  
  // OpenGraph metadata
  openGraph: {
    title: "Daima Mkenya Africa",
    description: "Meaningful color, uncompromising quality, and considered design from the heart of Kenya.",
    url: "https://daima-mkenya-new.vercel.app",
    siteName: "Daima Mkenya Africa",
    images: [
      {
        url: imageUrl, // Use absolute URL
        secureUrl: imageUrl, // Add secure URL for HTTPS
        width: 1200,
        height: 630,
        alt: "Daima Mkenya Africa - Heritage Fashion",
        type: "image/png",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  
  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "Daima Mkenya Africa",
    description: "Premium Kenyan Heritage Brand",
    images: [imageUrl], // Use absolute URL
    creator: "@daimamkenya",
    site: "@daimamkenya",
  },
  
  // Additional metadata for better sharing
  authors: [{ name: "Daima Mkenya Africa" }],
  keywords: ["Kenyan fashion", "heritage clothing", "African fashion", "Nairobi"],
  
  // Facebook specific (optional but helps)
  other: {
    "fb:app_id": "YOUR_FACEBOOK_APP_ID", // Optional: Add your Facebook app ID if you have one
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/png",
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
        {/* Preload the OG image for better performance */}
        <link rel="preload" as="image" href="https://daima-mkenya-new.vercel.app/assets/og-image.png" />
        
        {/* Fallback meta tags for platforms that don't read Next.js metadata well */}
        <meta property="og:image" content="https://daima-mkenya-new.vercel.app/assets/og-image.png" />
        <meta property="og:image:secure_url" content="https://daima-mkenya-new.vercel.app/assets/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Daima Mkenya Africa - Heritage Fashion" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://daima-mkenya-new.vercel.app/assets/og-image.png" />
        <meta name="twitter:image:alt" content="Daima Mkenya Africa - Heritage Fashion" />
      </head>
      <body className={`${playfair.className} antialiased bg-[#e8e8e8]`}
        suppressHydrationWarning={true}>
        <ErrorBoundary>
          <NextAuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </NextAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}