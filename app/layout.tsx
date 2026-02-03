import type { Metadata } from "next";
import { Manrope, } from "next/font/google";
import "./globals.css";
import Footer from "@/components/landing-page/Footer";
import { Inter, Gothic_A1 } from "next/font/google";
import localFont from 'next/font/local'
import Navbar from "@/components/landing-page/Navbar";



const manrope = Gothic_A1({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700']
});



const gotham = localFont({
  src: [
    {
      path: './fonts/Gotham-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Gotham-Book.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-gotham'
})

const inter = Inter({
  subsets: ["latin"],
  // Include the weights you need (400 for body, 600/700 for headlines)
  weight: ["400", "600", "700"],
  variable: "--font-inter", // Defines a CSS variable
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
    <html lang="en" >
      <body className={` ${gotham.className} antialiased BG-[#DDDDDD]`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
