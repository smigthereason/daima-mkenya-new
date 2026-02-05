"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product, sampleProduct, getAllProducts } from "@/types/Product";

/* ─────────────────────────── props ─────────────────────────── */
export interface ProductCardProps {
  initialProductId?: number;
}

/* ─────────────────────────── component ─────────────────────── */
export default function ProductCard({
  initialProductId = 1,
}: ProductCardProps) {
  const allProducts = getAllProducts();
  const initialProduct = allProducts.find(p => p.id === initialProductId) || sampleProduct;
  
  const [activeProduct, setActiveProduct] = useState<Product>(initialProduct);
  const [currentProductIndex, setCurrentProductIndex] = useState(
    allProducts.findIndex(p => p.id === initialProductId)
  );
  
  /* thumbnails carousel */
  const [activeThumb, setActiveThumb] = useState(0);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  
  // Initialize carousel with all thumbnail images
  useEffect(() => {
    if (activeProduct.images.thumbnails.length > 0) {
      setCarouselImages(activeProduct.images.thumbnails);
      setActiveThumb(0);
    }
  }, [activeProduct]);

  // Navigation between products
  const goToNextProduct = () => {
    const nextIndex = (currentProductIndex + 1) % allProducts.length;
    setCurrentProductIndex(nextIndex);
    setActiveProduct(allProducts[nextIndex]);
  };

  const goToPrevProduct = () => {
    const prevIndex = currentProductIndex === 0 ? allProducts.length - 1 : currentProductIndex - 1;
    setCurrentProductIndex(prevIndex);
    setActiveProduct(allProducts[prevIndex]);
  };

  const goToProduct = (productId: number) => {
    const index = allProducts.findIndex(p => p.id === productId);
    if (index !== -1) {
      setCurrentProductIndex(index);
      setActiveProduct(allProducts[index]);
    }
  };

  // Thumbnail carousel functions
  const prevThumb = () =>
    setActiveThumb((i) => (i === 0 ? carouselImages.length - 1 : i - 1));
  
  const nextThumb = () =>
    setActiveThumb((i) => (i === carouselImages.length - 1 ? 0 : i + 1));

  const handleThumbnailClick = (index: number) => {
    setActiveThumb(index);
  };

  /* color / size */
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    activeProduct.sizes.indexOf("38") !== -1 ? activeProduct.sizes.indexOf("38") : 0,
  );

  /* accordion */
  const [descOpen, setDescOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);

  /* split the title for the two-line heading */
  const titleParts = activeProduct.name.split(" ");
  const titleLine1 = titleParts.slice(0, 2).join(" ");
  const titleLine2 = titleParts.slice(2).join(" ");

  return (
    <div
      className="flex flex-col lg:flex-row w-full bg-[#E8E8E8] relative min-h-screen"
      style={{ 
        fontFamily: "'Playfair Display', serif, 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Product Navigation Overlay */}
      <div className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6 z-10 flex items-center gap-1.5 sm:gap-2">
        <span className="text-xs sm:text-sm text-gray-600 font-medium">
          {currentProductIndex + 1} / {allProducts.length}
        </span>
        <button
          onClick={goToPrevProduct}
          className="text-black bg-white border border-gray-300 rounded-full w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-sm sm:text-base"
          aria-label="Previous product"
        >
          ←
        </button>
        <button
          onClick={goToNextProduct}
          className="text-black bg-white border border-gray-300 rounded-full w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-sm sm:text-base"
          aria-label="Next product"
        >
          →
        </button>
      </div>

     

      {/* ───────── LEFT PANEL ───────── */}
      <div
        className="flex flex-col overflow-y-auto w-full lg:w-[45%] xl:w-[30%] p-4 sm:p-6 md:p-8 lg:py-8 lg:pl-8 lg:pr-6"
      >
        {/* Product Category */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <span className="text-black font-bold uppercase tracking-widest px-2 sm:px-3 py-1 border border-black text-xs sm:text-sm"
            style={{ 
              letterSpacing: "0.15em",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
            }}
          >
            {activeProduct.category || "Premium"}
          </span>
        </div>

        {/* thumbnail strip - mobile horizontal, desktop vertical */}
        <div className="flex flex-row lg:flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8 flex-shrink-0 overflow-x-auto lg:overflow-x-visible">
          {carouselImages.slice(0, 3).map((src, i) => {
            const displayIndex = (activeThumb + i) % carouselImages.length;
            return (
              <button
                key={displayIndex}
                onClick={() => handleThumbnailClick(displayIndex)}
                className="relative overflow-hidden transition-all duration-200 hover:opacity-90 flex-shrink-0"
                style={{
                  width: "80px",
                  height: "120px",
                  minWidth: "80px",
                  minHeight: "120px",
                  border: displayIndex === activeThumb ? "2px solid #000" : "1px solid #e5e5e5",
                  outline: "none",
                  borderRadius: "2px",
                }}
              >
                <Image
                  src={src}
                  alt={`Thumb ${displayIndex + 1}`}
                  width={80}
                  height={120}
                  className="object-cover w-full h-full"
                  priority={displayIndex === activeThumb}
                />
              </button>
            );
          })}
        </div>

        {/* prev / next arrows */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10 flex-shrink-0">
          <button
            onClick={prevThumb}
            className="text-black hover:opacity-50 transition-opacity p-1.5 sm:p-2 text-lg sm:text-xl"
            aria-label="Previous image"
          >
            ←
          </button>
          <span
            className="text-black text-sm sm:text-base"
            style={{ 
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              letterSpacing: "0.05em"
            }}
          >
            {activeThumb + 1} / {carouselImages.length}
          </span>
          <button
            onClick={nextThumb}
            className="text-black hover:opacity-50 transition-opacity p-1.5 sm:p-2 text-lg sm:text-xl"
            aria-label="Next image"
          >
            →
          </button>
        </div>

        {/* ── DESCRIPTION accordion ── */}
        <div style={{ borderTop: "2px solid #000" }} className="flex-shrink-0">
          <button
            onClick={() => setDescOpen(!descOpen)}
            className="w-full flex items-center justify-between py-3 sm:py-4 focus:outline-none hover:opacity-70 transition-opacity"
            aria-expanded={descOpen}
          >
            <span
              className="text-black font-bold uppercase tracking-wider text-base sm:text-lg md:text-xl"
              style={{ letterSpacing: "0.1em" }}
            >
              Description
            </span>
            <span className="text-black font-bold text-xl sm:text-2xl">
              {descOpen ? "−" : "+"}
            </span>
          </button>
          {descOpen && (
            <div className="pb-4 sm:pb-6 md:pb-8">
              <p
                className="text-black leading-relaxed text-sm sm:text-base md:text-lg"
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  lineHeight: "1.7",
                  fontWeight: 400
                }}
              >
                {activeProduct.description}
              </p>
            </div>
          )}
        </div>

        {/* ── DETAILS accordion ── */}
        <div style={{ borderTop: "2px solid #000" }} className="flex-shrink-0">
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="w-full flex items-center justify-between py-3 sm:py-4 focus:outline-none hover:opacity-70 transition-opacity"
            aria-expanded={detailsOpen}
          >
            <span
              className="text-black font-bold uppercase tracking-wider text-base sm:text-lg md:text-xl"
              style={{ letterSpacing: "0.1em" }}
            >
              Product Details
            </span>
            <span className="text-black font-bold text-xl sm:text-2xl">
              {detailsOpen ? "−" : "+"}
            </span>
          </button>
          {detailsOpen && (
            <div className="pb-4 sm:pb-6 md:pb-8 space-y-2 text-sm sm:text-base md:text-lg">
              <p
                className="text-black"
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 400
                }}
              >
                <strong>Material:</strong> {activeProduct.details.material}
              </p>
              <p
                className="text-black"
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 400
                }}
              >
                <strong>Care:</strong> {activeProduct.details.care}
              </p>
              <p
                className="text-black"
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 400
                }}
              >
                <strong>Origin:</strong> {activeProduct.details.origin}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ───────── CENTER — hero image ───────── */}
      <div
        className="relative flex-1 flex items-center justify-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] order-first lg:order-none"
        style={{
          background: "#fafafa",
        }}
      >
        <Image
          src={carouselImages[activeThumb] || activeProduct.images.hero}
          alt={activeProduct.name}
          width={600}
          height={800}
          className="object-cover object-top w-full h-full max-w-[90%] max-h-[90%] lg:max-w-full lg:max-h-full"
          priority
        />
      </div>

      {/* ───────── RIGHT PANEL ───────── */}
      <div
        className="flex flex-col justify-start w-full lg:w-[45%] xl:w-[30%] p-4 sm:p-6 md:p-8 lg:py-8 lg:px-8"
      >
        {/* Product ID */}
        <div className="mb-2 sm:mb-3 md:mb-4">
          <span className="text-gray-500 text-sm sm:text-base tracking-wider"
            style={{ 
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              letterSpacing: "0.1em"
            }}
          >
            #{activeProduct.id.toString().padStart(3, '0')}
          </span>
        </div>

        {/* title – two lines */}
        <h1
          className="text-black font-black uppercase leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-[3rem]"
          style={{
            letterSpacing: "-0.5px",
            lineHeight: "1.1",
            margin: 0,
          }}
        >
          {titleLine1}
          <br />
          {titleLine2}
        </h1>

        {/* price */}
        <p
          className="text-black mt-4 sm:mt-5 md:mt-6 text-lg sm:text-xl md:text-2xl"
          style={{ 
            fontWeight: 500,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: "0.02em"
          }}
        >
          {activeProduct.price}
        </p>

        {/* ── COLOR ── */}
        <div className="mt-6 sm:mt-8 md:mt-10">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span
              className="text-black font-bold uppercase text-sm sm:text-base"
              style={{ 
                letterSpacing: "0.12em",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
              }}
            >
              Color
            </span>
            <span
              className="text-black text-sm sm:text-base"
              style={{ 
                letterSpacing: "0.06em",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 400
              }}
            >
              |&nbsp; {activeProduct.colors[selectedColor].label}
            </span>
          </div>

          <div className="flex gap-2 sm:gap-3">
            {activeProduct.colors.map((c, i) => (
              <button
                key={i}
                onClick={() => setSelectedColor(i)}
                className="transition-all duration-150 focus:outline-none hover:scale-105"
                style={{
                  width: "32px",
                  height: "32px",
                  minWidth: "32px",
                  minHeight: "32px",
                  background: c.hex,
                  border: i === selectedColor ? "2px solid #000" : "1px solid #ccc",
                  boxShadow: i === selectedColor ? "inset 0 0 0 2px #fff" : "none",
                  borderRadius: "50%",
                }}
                aria-label={`Select color: ${c.label}`}
              />
            ))}
          </div>
        </div>

        {/* ── SIZE ── */}
        <div className="mt-6 sm:mt-8 md:mt-10">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span
              className="text-black font-bold uppercase text-sm sm:text-base"
              style={{ 
                letterSpacing: "0.12em",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
              }}
            >
              Size
            </span>
            <span
              className="text-black text-sm sm:text-base"
              style={{ 
                letterSpacing: "0.06em",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 400
              }}
            >
              |&nbsp; {activeProduct.sizes[selectedSize]}
            </span>
          </div>

          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {activeProduct.sizes.map((s, i) => (
              <button
                key={s}
                onClick={() => setSelectedSize(i)}
                className="transition-all duration-150 focus:outline-none hover:opacity-90"
                style={{
                  width: "44px",
                  height: "44px",
                  minWidth: "44px",
                  minHeight: "44px",
                  background: i === selectedSize ? "#000" : "#fff",
                  color: i === selectedSize ? "#fff" : "#000",
                  border: "1.5px solid #000",
                  fontSize: "16px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  borderRadius: "2px",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Product Category Info */}
        <div className="mt-8 sm:mt-10 md:mt-12 pt-4 sm:pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg"
            style={{ 
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              lineHeight: "1.6"
            }}
          >
            Part of our <strong className="text-black">{activeProduct.category || "Premium"}</strong> collection. 
            Browse <button 
              onClick={() => goToNextProduct()}
              className="text-black underline hover:no-underline transition-all ml-1 text-sm sm:text-base"
            >
              next product
            </button> or view all {allProducts.length} products.
          </p>
        </div>

        {/* ── buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 md:mt-12">
          <button
            className="text-white bg-black uppercase tracking-widest hover:bg-gray-800 transition-all duration-200 focus:outline-none hover:scale-[1.02] text-sm sm:text-base md:text-lg py-4 sm:py-5 px-4 sm:px-8 flex-1"
            style={{
              fontWeight: 600,
              borderRadius: "2px",
              letterSpacing: "0.15em",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
            }}
          >
            Buy Product
          </button>
          <button
            className="text-black bg-white border border-black uppercase tracking-widest hover:bg-gray-50 transition-all duration-200 focus:outline-none hover:scale-[1.02] text-sm sm:text-base md:text-lg py-4 sm:py-5 px-4 sm:px-8 flex-1"
            style={{
              fontWeight: 600,
              borderRadius: "2px",
              letterSpacing: "0.15em",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}