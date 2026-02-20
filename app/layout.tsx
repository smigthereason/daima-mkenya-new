// // app/layout.tsx
// import { Playfair_Display } from "next/font/google";
// import "./globals.css";

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
//        <body className={`${playfair.className} antialiased bg-[#e8e8e8]`}>
//         {children}
//       </body>
//     </html>
//   );
// }

import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./(root)/providers/NextAuthProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={playfair.className}>
      <body className={`${playfair.className} antialiased bg-[#e8e8e8]`}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}