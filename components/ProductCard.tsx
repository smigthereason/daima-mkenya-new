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
      setActiveThumb(0); // Reset to first thumbnail when product changes
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
      className="flex w-full bg-[#E8E8E8] relative min-h-screen"
      style={{ 
        fontFamily: "'Playfair Display', serif, 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Product Navigation Overlay */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <span className="text-xs text-gray-600 font-medium">
          {currentProductIndex + 1} / {allProducts.length}
        </span>
        <button
          onClick={goToPrevProduct}
          className="text-black bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Previous product"
        >
          ←
        </button>
        <button
          onClick={goToNextProduct}
          className="text-black bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Next product"
        >
          →
        </button>
      </div>

      {/* Product Quick Select */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
        {allProducts.slice(0, 5).map((product, index) => (
          <button
            key={product.id}
            onClick={() => goToProduct(product.id)}
            className={`w-3 h-3 rounded-full transition-all ${
              product.id === activeProduct.id 
                ? 'bg-black scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`View ${product.name}`}
          />
        ))}
        {allProducts.length > 5 && (
          <span className="text-xs text-gray-500 flex items-center ml-2">
            +{allProducts.length - 5} more
          </span>
        )}
      </div>

      {/* ───────── LEFT PANEL ───────── */}
      <div
        className="flex flex-col overflow-y-auto no-scrollbar"
        style={{
          width: "640px",
          minWidth: "260px",
          padding: "28px 20px 28px 28px",
        }}
      >
        {/* Product Category */}
        <div className="mb-6">
          <span className="text-black font-bold uppercase tracking-widest px-3 py-1 border border-black"
            style={{ 
              fontSize: "10px", 
              letterSpacing: "0.15em",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
            }}
          >
            {activeProduct.category || "Premium"}
          </span>
        </div>

        {/* thumbnail strip - infinite carousel */}
        <div className="flex gap-6 mb-3 flex-shrink-0">
          {carouselImages.slice(0, 2).map((src, i) => {
            const displayIndex = (activeThumb + i) % carouselImages.length;
            return (
              <button
                key={displayIndex}
                onClick={() => handleThumbnailClick(displayIndex)}
                className="relative overflow-hidden transition-all duration-200 hover:opacity-90"
                style={{
                  width: "200px",
                  height: "320px",
                  border:
                    displayIndex === activeThumb
                      ? "2px solid #000"
                      : "1px solid #e5e5e5",
                  outline: "none",
                  borderRadius: "2px",
                }}
              >
                <Image
                  src={src}
                  alt={`Thumb ${displayIndex + 1}`}
                  width={200}
                  height={320}
                  className="object-cover w-full h-full"
                  priority={displayIndex === activeThumb}
                />
              </button>
            );
          })}
        </div>

        {/* prev / next arrows */}
        <div
          className="flex items-center gap-3 mb-8 flex-shrink-0"
          style={{ paddingLeft: "4px" }}
        >
          <button
            onClick={prevThumb}
            className="text-black hover:opacity-50 transition-opacity p-2"
            style={{ fontSize: "20px", lineHeight: 1 }}
            aria-label="Previous image"
          >
            ←
          </button>
          <span
            className="text-black"
            style={{ 
              fontSize: "13px",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              letterSpacing: "0.05em"
            }}
          >
            {activeThumb + 1} / {carouselImages.length}
          </span>
          <button
            onClick={nextThumb}
            className="text-black hover:opacity-50 transition-opacity p-2"
            style={{ fontSize: "20px", lineHeight: 1 }}
            aria-label="Next image"
          >
            →
          </button>
        </div>

        {/* ── DESCRIPTION accordion ── */}
        <div style={{ borderTop: "2px solid #000" }} className="flex-shrink-0">
          <button
            onClick={() => setDescOpen(!descOpen)}
            className="w-full flex items-center justify-between py-3 focus:outline-none hover:opacity-70 transition-opacity"
            aria-expanded={descOpen}
          >
            <span
              className="text-black font-bold uppercase tracking-wider"
              style={{ fontSize: "18px", letterSpacing: "0.1em" }}
            >
              Description
            </span>
            <span
              className="text-black"
              style={{
                fontSize: "16px",
                transition: "transform 0.2s ease",
                transform: descOpen ? "rotate(180deg)" : "rotate(0deg)",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
              }}
            >
              ▾
            </span>
          </button>

          {descOpen && (
            <div className="pb-4" style={{ borderBottom: "1px solid #e5e5e5" }}>
              {activeProduct.description.map((line, i) => (
                <p
                  key={i}
                  className="text-black"
                  style={{ 
                    fontSize: "15px", 
                    lineHeight: "1.7", 
                    margin: "0.5em 0",
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontWeight: 400
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* ── DETAILS accordion ── */}
        <div style={{ borderTop: "2px solid #000" }} className="flex-shrink-0">
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="w-full flex items-center justify-between py-3 focus:outline-none hover:opacity-70 transition-opacity"
            aria-expanded={detailsOpen}
          >
            <span
              className="text-black font-bold uppercase tracking-wider"
              style={{ fontSize: "18px", letterSpacing: "0.1em" }}
            >
              Details
            </span>
            <span
              className="text-black"
              style={{
                fontSize: "16px",
                transition: "transform 0.2s ease",
                transform: detailsOpen ? "rotate(180deg)" : "rotate(0deg)",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
              }}
            >
              ▾
            </span>
          </button>

          {detailsOpen && (
            <div className="pb-4" style={{ borderBottom: "1px solid #e5e5e5" }}>
              <p
                className="text-black"
                style={{ 
                  fontSize: "15px", 
                  lineHeight: "1.7",
                  margin: "0.5em 0",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 400
                }}
              >
                <strong>Material:</strong> {activeProduct.details.material}
              </p>
              <p
                className="text-black"
                style={{ 
                  fontSize: "15px", 
                  lineHeight: "1.7",
                  margin: "0.5em 0",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 400
                }}
              >
                <strong>Care:</strong> {activeProduct.details.care}
              </p>
              <p
                className="text-black"
                style={{ 
                  fontSize: "15px", 
                  lineHeight: "1.7",
                  margin: "0.5em 0",
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
        className="relative flex-1 flex items-center justify-center"
        style={{
          background: "#fafafa",
        }}
      >
        <Image
          src={carouselImages[activeThumb] || activeProduct.images.hero}
          alt={activeProduct.name}
          width={400}
          height={500}
          className="object-cover object-top"
          priority
        />
      </div>

      {/* ───────── RIGHT PANEL ───────── */}
      <div
        className="flex flex-col justify-start"
        style={{
          width: "640px",
          minWidth: "340px",
          padding: "52px 40px 40px 36px",
        }}
      >
        {/* Product ID */}
        <div className="mb-2">
          <span className="text-gray-500 text-xs tracking-wider"
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
          className="text-black font-black uppercase leading-tight"
          style={{
            fontSize: "26px",
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
          className="text-black mt-4"
          style={{ 
            fontSize: "18px", 
            fontWeight: 500,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: "0.02em"
          }}
        >
          {activeProduct.price}
        </p>

        {/* ── COLOR ── */}
        <div className="mt-7">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-black font-bold uppercase"
              style={{ 
                fontSize: "12px", 
                letterSpacing: "0.12em",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
              }}
            >
              Color
            </span>
            <span
              className="text-black"
              style={{ 
                fontSize: "12px", 
                letterSpacing: "0.06em",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 400
              }}
            >
              |&nbsp; {activeProduct.colors[selectedColor].label}
            </span>
          </div>

          <div className="flex gap-2">
            {activeProduct.colors.map((c, i) => (
              <button
                key={i}
                onClick={() => setSelectedColor(i)}
                className="transition-all duration-150 focus:outline-none hover:scale-105"
                style={{
                  width: "36px",
                  height: "36px",
                  background: c.hex,
                  border:
                    i === selectedColor ? "2px solid #000" : "1px solid #ccc",
                  boxShadow:
                    i === selectedColor ? "inset 0 0 0 2px #fff" : "none",
                  borderRadius: "50%",
                }}
                aria-label={`Select color: ${c.label}`}
              />
            ))}
          </div>
        </div>

        {/* ── SIZE ── */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-black font-bold uppercase"
              style={{ 
                fontSize: "12px", 
                letterSpacing: "0.12em",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
              }}
            >
              Size
            </span>
            <span
              className="text-black"
              style={{ 
                fontSize: "12px", 
                letterSpacing: "0.06em",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 400
              }}
            >
              |&nbsp; {activeProduct.sizes[selectedSize]}
            </span>
          </div>

          <div className="flex gap-2">
            {activeProduct.sizes.map((s, i) => (
              <button
                key={s}
                onClick={() => setSelectedSize(i)}
                className="transition-all duration-150 focus:outline-none hover:opacity-90"
                style={{
                  width: "44px",
                  height: "40px",
                  background: i === selectedSize ? "#000" : "#fff",
                  color: i === selectedSize ? "#fff" : "#000",
                  border: "1.5px solid #000",
                  fontSize: "14px",
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
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm"
            style={{ 
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              lineHeight: "1.6"
            }}
          >
            Part of our <strong className="text-black">{activeProduct.category || "Premium"}</strong> collection. 
            Browse <button 
              onClick={() => goToNextProduct()}
              className="text-black underline hover:no-underline transition-all ml-1"
              style={{ fontSize: "13px" }}
            >
              next product
            </button> or view all {allProducts.length} products.
          </p>
        </div>

        {/* ── buttons ── */}
        <div className="flex gap-3 mt-8">
          <button
            className="text-white bg-black uppercase tracking-widest hover:bg-gray-800 transition-all duration-200 focus:outline-none hover:scale-[1.02]"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              padding: "16px 28px",
              flex: 1,
              borderRadius: "2px",
              letterSpacing: "0.15em",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
            }}
          >
            Buy Product
          </button>
          <button
            className="text-black bg-white border border-black uppercase tracking-widest hover:bg-gray-50 transition-all duration-200 focus:outline-none hover:scale-[1.02]"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              padding: "16px 24px",
              flex: 1,
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