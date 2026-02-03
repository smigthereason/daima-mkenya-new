"use client";

import { HeroImage, HeroImage2, HeroImage3, HeroImage4, HeroNew } from "@/public/assets";
import Image from "next/image";
import { useState } from "react";

// ─── Star rating helper ─────────────────────────────────────────────────────
const Stars = () => (
   <span style={{ color: "#c9a84c", fontSize: 11, letterSpacing: 1 }}>
      ★★★★★
   </span>
);
interface ProductCardProps {
   img: string;
   imgW?: number;
   imgH?: number;
   top?: number;
   left?: number;
   zIndex?: number;
}

const ProductCard = ({ img, imgW = 52, imgH = 68, top, left, zIndex }: any) => (
   <div
      style={{
         position: "absolute",
         top,
         left,
         zIndex,
         display: "flex",
         alignItems: "center",
         gap: 12,
         background: "rgba(255,255,255,0.92)",
         backdropFilter: "blur(6px)",
         borderRadius: 10,
         padding: "10px 14px 10px 10px",
         boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
         minWidth: 190,
      }}
   >
      <img
         src={img}
         alt="product"
         style={{ width: imgW, height: imgH, objectFit: "cover", borderRadius: 6 }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
         <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600, color: "#2c2c2c" }}>
            Buket Damin
         </span>
         <span style={{ fontSize: 12, color: "#666" }}>$ 165.00 USD</span>
         <Stars />
      </div>
      {/* + button */}
      <div
         style={{
            marginLeft: "auto",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#3b2314",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            cursor: "pointer",
            lineHeight: 1,
         }}
      >
         +
      </div>
   </div>
);

// ─── Main Hero ──────────────────────────────────────────────────────────────
export default function Hero() {

   return (
      <section
         style={{
            fontFamily: "'Playfair Display', serif",
            width: "100%",
            minHeight: "100vh",
            overflow: "hidden",
            position: "relative",
         }}
      >
         {/* ── Google font import (runtime) ── */}
         <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap"
            rel="stylesheet"
         />


         {/* ─── TWO-TONE BACKGROUND ─── */}
         {/* Left half – white */}
         <div style={{ position: "absolute", inset: 0, background: "#e8e8e8", zIndex: 0 }} />
         {/* Right half – dark brown */}
         <div
            style={{
               position: "absolute",
               top: 0,
               right: 0,
               width: "48%",
               height: "100%",
               background: "#171717",
               zIndex: 0,
            }}
         />

         <div
            style={{
               position: "absolute",
               top: "42%",
               left: 0,
               right: 0,
               zIndex: 10,
               pointerEvents: "none",
               display: "flex",
               justifyContent: "space-between",
               padding: "0 40px",
            }}
         >
            <span
               style={{
                  fontSize: "clamp(100px, 18vw, 180px)",
                  fontWeight: 900,
                  color: "#2c2c2c",
                  lineHeight: 0.85,
                  letterSpacing: -4,
               }}
            >
               Daima
            </span>
            <span
               style={{
                  fontSize: "clamp(100px, 18vw, 180px)",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 0.85,
                  letterSpacing: -4,
                  fontStyle: "",
               }}
            >
               Mkenya
            </span>
         </div>

         {/* ─── MODEL IMAGE (centre, overlapping both halves) ─── */}
         <div
            style={{
               position: "absolute",
               top: "50%",
               left: "50%",
               transform: "translate(-50%, -50%)",
               zIndex: 20,

               // borderRadius: "0 0 190px 190px",
               overflow: "hidden",
               // boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
            className="h-full"
         >
            <Image
               src={HeroImage3}
               alt="model"
               style={{ width: "100%", height: "100%", objectFit: "contain" }}
               quality={100}
               priority
            />
         </div>

         {/* ─── PRODUCT CARDS (floating) ─── */}
         {/* Top-left card – white top */}
         {/* <ProductCard img={PRODUCT_TOP} imgW={44} imgH={58} top="13%" left="14%" zIndex={30} /> */}
         {/* Top-right card – hat */}
         {/* <ProductCard img={PRODUCT_HAT} imgW={52} imgH={40} top="15%" left="58%" zIndex={30} /> */}
         {/* Bottom-center card – shorts */}
         {/* <ProductCard img={PRODUCT_SHORTS} imgW={52} imgH={42} top="72%" left="42%" zIndex={30} /> */}

         {/* ─── LEFT BODY COPY ─── */}
         <div
            style={{
               position: "absolute",
               top: "60%",
               left: 48,
               width: 260,
               zIndex: 25,
            }}
         >
            <p
               style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: "#3a3a3a",
                  margin: 0,
                  marginBottom: 28,
               }}
            >
               Discover a world of effortless style where modern fashion meets timeless elegance. Our collection is
               thoughtfully designed for confident girls who love to express themselves through clothing that feels as good as
               it looks.
            </p>
            {/* Shop Now button */}
            <button
               style={{
                  background: "#1e1e1e",
                  color: "#fff",
                  border: "none",
                  borderRadius: 24,
                  padding: "12px 32px",
                  fontSize: 14,
                  fontFamily: "Georgia, serif",
                  cursor: "pointer",
                  letterSpacing: 0.5,
               }}
            >
               Shop Now
            </button>
         </div>

         {/* ─── BOTTOM-RIGHT THUMBNAIL CAROUSEL ─── */}
         <div
            style={{
               position: "absolute",
               bottom: "6%",
               right: 36,
               zIndex: 25,
               display: "flex",
               alignItems: "flex-end",
               gap: 10,
            }}
         >
         </div>
      </section>
   );
}
