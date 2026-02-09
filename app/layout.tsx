// app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";
// import GSAPProvider from "@/app/providers/GSAPProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap"
});

export const metadata: Metadata = {
  title: 'Daima Mkenya Africa | Unity in Every Thread',
  description: 'Kenyan Clothing Line',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Signika+Negative:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head> */}
      <body
        className={`${playfair.className} antialiased bg-[#e8e8e8]`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
