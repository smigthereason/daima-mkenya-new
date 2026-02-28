"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, getAllProducts } from "@/types/Product";
import {
  ShoppingBag,
  Check,
  CreditCard,
  MinusCircle,
  AlertTriangle,
  ZoomIn,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { urlFor } from "@/sanity/lib/image";

interface ProductCardProps {
  productSlug?: string;
}

export default function ProductCard({ productSlug }: ProductCardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addToCart, loading: cartLoading } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // Image gallery state
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [centerImage, setCenterImage] = useState<any>(null);

  // Transition state for image swap
  const [isSwapping, setIsSwapping] = useState(false);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [descOpen, setDescOpen] = useState(true);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [lastAddedConfig, setLastAddedConfig] = useState<{
    colorIndex: number;
    sizeIndex: number;
  } | null>(null);

  // Helper function to get stock status
  const getStockStatus = (stock: number = 0) => {
    if (stock <= 0)
      return {
        status: "out",
        label: "OUT OF STOCK",
        disabled: true,
        message: "This piece is currently unavailable",
      };
    if (stock <= 5)
      return {
        status: "low",
        label: `LOW STOCK • ${stock} LEFT`,
        disabled: false,
        badge: "LIMITED",
        message: `Only ${stock} pieces remaining`,
      };
    return {
      status: "in",
      label: "IN STOCK",
      disabled: false,
      badge: "AVAILABLE",
      message: "Ready to ship",
    };
  };

  // SAFE image URL helper with error handling
  const getImageUrl = (source: any): string => {
    if (!source) return "/assets/placeholder.png";

    try {
      // If it's a string URL, return it directly
      if (typeof source === "string") return source;

      // If it has an asset property (standard Sanity image)
      if (source.asset) {
        return urlFor(source).url();
      }

      // If it's just an object with _ref (direct reference)
      if (source._ref) {
        // Create a proper image object for urlFor
        const imageObj = { asset: { _ref: source._ref } };
        return urlFor(imageObj).url();
      }

      // If it has a hero property (your product structure)
      if (source.hero) {
        return getImageUrl(source.hero);
      }

      // If it's an array of images, take the first one
      if (Array.isArray(source) && source.length > 0) {
        return getImageUrl(source[0]);
      }

      console.warn("Unable to resolve image URL from source:", source);
      return "/assets/placeholder.png";
    } catch (error) {
      console.error("Error resolving image URL:", error);
      return "/assets/placeholder.png";
    }
  };

  // Initialize gallery
  useEffect(() => {
    if (activeProduct) {
      // Safely extract all images
      const allImages: any[] = [];

      // Add hero image if it exists
      if (activeProduct.images?.hero) {
        allImages.push(activeProduct.images.hero);
      }

      // Add thumbnails if they exist
      if (
        activeProduct.images?.thumbnails &&
        Array.isArray(activeProduct.images.thumbnails)
      ) {
        allImages.push(...activeProduct.images.thumbnails);
      }

      // If no images found, try to find any image field
      if (allImages.length === 0) {
        // Try to find any property that might contain an image
        Object.values(activeProduct).forEach((value) => {
          if (value && typeof value === "object" && "asset" in value) {
            allImages.push(value);
          }
        });
      }

      // If still no images, use placeholder
      if (allImages.length === 0) {
        allImages.push("/assets/placeholder.png");
      }

      setGalleryImages(allImages);
      setCenterImage(allImages[0]);
    }
  }, [activeProduct]);

  // FETCH ALL PRODUCTS AND FIND THE ONE MATCHING THE SLUG
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const data = await getAllProducts();
        setProducts(data);

        if (data.length > 0 && productSlug) {
          const foundProduct = data.find(
            (p) => p.slug?.current === productSlug || p._id === productSlug,
          );

          if (foundProduct) {
            setActiveProduct(foundProduct);
            setSelectedColor(0);
            setSelectedSize(0);
            setAddedFeedback(false);
            setLastAddedConfig(null);
          } else {
            setActiveProduct(null);
            setFetchError("This product is currently unavailable");
          }
        } else if (data.length > 0) {
          setActiveProduct(data[0]);
        } else {
          setFetchError("No products available");
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setFetchError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productSlug]);

  const handleThumbnailClick = (clickedImage: any) => {
    if (!centerImage || clickedImage === centerImage) return;

    setIsSwapping(true);

    setTimeout(() => {
      setCenterImage(clickedImage);
      setIsSwapping(false);
    }, 250);
  };

  // Reset added feedback when color or size changes
  useEffect(() => {
    if (lastAddedConfig) {
      const isSameConfig =
        lastAddedConfig.colorIndex === selectedColor &&
        lastAddedConfig.sizeIndex === selectedSize;

      if (!isSameConfig) {
        setAddedFeedback(false);
        setLastAddedConfig(null);
      }
    }
  }, [selectedColor, selectedSize, lastAddedConfig]);

  const handleAddToCart = async () => {
    if (stockStatus.disabled) return;

    if (status !== "authenticated") {
      router.push(
        "/login?callbackUrl=" + encodeURIComponent(window.location.pathname),
      );
      return;
    }

    const size = activeProduct!.sizes[selectedSize];
    const colorObj = activeProduct!.colors[selectedColor];

    setAddToCartLoading(true);
    try {
      await addToCart(activeProduct!, size, {
        label: colorObj.label,
        hex: colorObj.hex,
      });

      setAddedFeedback(true);
      setLastAddedConfig({
        colorIndex: selectedColor,
        sizeIndex: selectedSize,
      });

      // Reset feedback after 3 seconds
      setTimeout(() => {
        setAddedFeedback(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddToCartLoading(false);
    }
  };

  const handlePurchaseNow = async () => {
    if (stockStatus.disabled) return;

    if (status !== "authenticated") {
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    const size = activeProduct!.sizes[selectedSize];
    const colorObj = activeProduct!.colors[selectedColor];

    setPurchaseLoading(true);
    try {
      // Create a cart-item-like structure that matches what checkout expects
      const directCheckoutItem = {
        cartId: `direct-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        product: activeProduct,
        quantity: 1,
        selectedSize: size,
        selectedColor: {
          label: colorObj.label,
          hex: colorObj.hex,
        },
      };

      console.log("Storing direct checkout item:", directCheckoutItem);

      sessionStorage.setItem(
        "directCheckout",
        JSON.stringify(directCheckoutItem),
      );

      // Navigate directly to checkout with a flag indicating it's a direct purchase
      router.push("/checkout?direct=true");
    } catch (error) {
      console.error("Failed to process purchase:", error);
      setPurchaseLoading(false);
      alert("Failed to process purchase. Please try again.");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="font-black tracking-widest uppercase text-sm">
            Loading Piece...
          </p>
        </div>
      </div>
    );
  }

  // Error/Not Found State
  if (!activeProduct || fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="max-w-md text-center">
          <AlertTriangle size={48} className="mx-auto mb-6 text-gray-400" />
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider mb-4">
            {fetchError || "Product Not Available"}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            This product may be temporarily unavailable, removed, or you may
            have followed a broken link.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="group relative overflow-hidden border-2 border-black bg-black px-12 py-5 text-sm font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-white hover:text-black"
          >
            <span className="relative z-10">Browse Collection</span>
          </button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(activeProduct.stock || 0);
  const titleParts = activeProduct.name.split(" ");
  const titleLine1 = titleParts.slice(0, 2).join(" ");
  const titleLine2 = titleParts.slice(2).join(" ");

  return (
    <div
      ref={cardRef}
      className="flex flex-col xl:flex-row w-full bg-white relative min-h-screen text-black antialiased overflow-x-hidden mt-20 md:mt-32 border-t border-neutral-400"
    >
      {/* Left Panel: All Product Images Gallery */}
      <div className="order-2 xl:order-1 flex flex-col w-full xl:w-[32%] p-8 md:p-12 xl:p-16 border-r border-gray-50 bg-white">
        <div className="mb-10">
          <span className="text-[14px] uppercase tracking-[0.5em] text-gray-400 block mb-4 font-light">
            The Collection
          </span>
          <span className="text-[12px] uppercase tracking-[0.3em] font-bold border-b-2 border-black pb-2">
            {activeProduct.category}
          </span>
        </div>

        {/* Gallery Grid Layout */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {galleryImages.map((img, i) => {
            const isCenterImage = img === centerImage;
            return (
              <button
                key={i}
                onClick={() => handleThumbnailClick(img)}
                className={`group relative aspect-[3/4] transition-all duration-300 ease-out overflow-hidden
                  ${
                    isCenterImage
                      ? "opacity-100 ring-2 ring-black ring-offset-2"
                      : "opacity-50 hover:opacity-100"
                  }`}
              >
                <Image
                  src={getImageUrl(img)}
                  alt={`${activeProduct.name} - view ${i + 1}`}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            );
          })}
        </div>

        <div className="border-t border-gray-100 mt-auto">
          <button
            onClick={() => setDescOpen(!descOpen)}
            className="w-full flex justify-between items-center py-6 text-[14px] uppercase tracking-[0.3em] font-bold hover:text-gray-600 transition-colors"
          >
            <span>Product Narrative</span>
            <span className="text-xl">{descOpen ? "—" : "+"}</span>
          </button>
          {descOpen && activeProduct.description && (
            <div className="pb-12 space-y-2 animate-fadeIn">
              {Array.isArray(activeProduct.description) ? (
                activeProduct.description.map((line, i) => (
                  <p
                    key={i}
                    className="text-[16px] leading-[1.8] text-gray-900 font-medium tracking-wide"
                  >
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-[16px] leading-[1.8] text-gray-900 font-medium tracking-wide">
                  {activeProduct.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center Panel: Main Display Image with Zoom */}
      <div className="order-1 xl:order-2 flex-1 bg-[#F5F5F5] relative flex items-center justify-center h-[60vh] md:h-screen overflow-hidden group">
        <div
          className={`relative w-full h-full transition-all duration-300 ease-in-out
            ${isSwapping ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"}`}
        >
          {centerImage && (
            <Image
              src={getImageUrl(centerImage)}
              alt={activeProduct.name}
              fill
              unoptimized
              className="object-contain p-8 md:p-16 transition-transform duration-700 ease-out group-hover:scale-105"
              priority
            />
          )}

          {/* Zoom icon hint */}
          <div className="absolute bottom-6 right-6 bg-white/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ZoomIn size={20} className="text-black" />
          </div>
        </div>

        {/* Out of Stock Overlay */}
        {stockStatus.status === "out" && (
          <div className="hidden xl:flex absolute inset-0 items-center justify-center pointer-events-none">
            <div className="border-8 border-red-600 rotate-[-15deg] px-12 py-4 rounded-sm opacity-30">
              <span className="text-red-600 text-6xl font-black uppercase tracking-[0.3em]">
                SOLD OUT
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: Details & Actions */}
      <div className="order-3 flex flex-col w-full xl:w-[28%] p-8 md:p-12 xl:p-16 bg-white justify-center border-l border-gray-50">
        <span className="text-[12px] tracking-[0.6em] text-gray-900 uppercase block mb-8 font-light">
          Ref. {activeProduct._id.substring(0, 8)}
        </span>

        <h1 className="text-3xl md:text-5xl font-light tracking-tighter leading-[1.1] mb-6 uppercase">
          {titleLine1} <br />
          <span className="font-black">{titleLine2}</span>
        </h1>

        <p className="text-[2rem] font-light tracking-[0.15em] mb-6">
          {activeProduct.price}
        </p>

        {/* Stock Status Sections */}
        {stockStatus.status === "out" && (
          <div className="mb-8 flex flex-col items-center">
            <span className="text-red-600 text-[14px] font-bold uppercase tracking-[0.3em]">
              {stockStatus.label}
            </span>
            <p className="text-center text-[12px] text-gray-500 uppercase tracking-[0.2em] mt-2">
              {stockStatus.message}
            </p>
          </div>
        )}

        {stockStatus.status === "low" && (
          <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-amber-700">
                {stockStatus.label}
              </p>
            </div>
            <p className="text-[11px] text-amber-600 mt-1 ml-5">
              {stockStatus.message}
            </p>
          </div>
        )}

        {stockStatus.status === "in" && (
          <div className="mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-500">
              {stockStatus.label} • {stockStatus.message}
            </p>
          </div>
        )}

        {/* Color and Size Selection */}
        <div
          className={`space-y-12 ${stockStatus.status === "out" ? "opacity-50" : ""}`}
        >
          {activeProduct.colors && (
            <div>
              <p className="text-[14px] uppercase tracking-[0.4em] font-bold mb-6">
                Palettes
              </p>
              <div className="flex gap-6">
                {activeProduct.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => !stockStatus.disabled && setSelectedColor(i)}
                    disabled={stockStatus.disabled}
                    className={`w-8 h-8 rounded-full ring-offset-8 ring-1 transition-all duration-300
                      ${i === selectedColor ? "ring-black scale-125" : "ring-transparent"}
                      ${stockStatus.disabled ? "cursor-not-allowed opacity-50" : "hover:scale-110"}
                    `}
                    style={{ backgroundColor: c.hex }}
                    title={stockStatus.disabled ? "Unavailable" : c.label}
                  />
                ))}
              </div>
            </div>
          )}

          {activeProduct.sizes && (
            <div>
              <p className="text-[14px] uppercase tracking-[0.4em] font-bold mb-6">
                Dimensions
              </p>
              <div className="grid grid-cols-4 gap-3">
                {activeProduct.sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => !stockStatus.disabled && setSelectedSize(i)}
                    disabled={stockStatus.disabled}
                    className={`py-5 text-[16px] tracking-[0.2em] font-medium border transition-all duration-300
                      ${
                        i === selectedSize
                          ? "bg-black text-white border-black"
                          : "border-gray-100 hover:border-black"
                      }
                      ${
                        stockStatus.disabled
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-gray-50"
                      }
                    `}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* REMOVED: Login Prompt section */}

        {/* Action Buttons */}
        <div className="mt-16 space-y-4">
          {stockStatus.status === "out" ? (
            <div className="border-2 border-red-200 bg-red-50 py-10 px-6 text-center">
              <p className="text-[28px] md:text-[36px] font-black text-red-600 uppercase tracking-tighter mb-3">
                OUT OF STOCK
              </p>
              <p className="text-[13px] text-gray-600 uppercase tracking-[0.2em]">
                {stockStatus.message}
              </p>
              <button
                onClick={() => {
                  console.log("Notify me clicked for:", activeProduct.name);
                }}
                className="mt-8 text-[11px] font-bold uppercase tracking-[0.3em] border-b border-gray-400 pb-1 text-gray-600 hover:text-black hover:border-black transition-all"
              >
                NOTIFY ME WHEN AVAILABLE
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                disabled={
                  stockStatus.disabled ||
                  addToCartLoading ||
                  cartLoading ||
                  purchaseLoading
                }
                className={`group relative w-full border-2 border-black py-7 text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] overflow-hidden transition-all
                  ${
                    stockStatus.disabled
                      ? "bg-gray-200 border-gray-300 cursor-not-allowed opacity-60"
                      : "bg-white hover:border-black"
                  }`}
              >
                {!stockStatus.disabled && (
                  <span
                    className={`absolute inset-0 bg-black transition-transform duration-500 ease-out ${
                      addedFeedback
                        ? "translate-y-0"
                        : "translate-y-full group-hover:translate-y-0"
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center justify-center gap-3 transition-colors duration-500 ${
                    stockStatus.disabled
                      ? "text-gray-500"
                      : addedFeedback
                        ? "text-white"
                        : "text-black group-hover:text-white"
                  }`}
                >
                  {addToCartLoading || cartLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : stockStatus.disabled ? (
                    <>
                      <MinusCircle size={18} />
                      <span>Unavailable</span>
                    </>
                  ) : addedFeedback ? (
                    <>
                      <Check size={18} className="text-white" />
                      <span className="text-white">Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Add to Bag</span>
                    </>
                  )}
                </span>
              </button>

              <button
                onClick={handlePurchaseNow}
                disabled={
                  stockStatus.disabled ||
                  purchaseLoading ||
                  addToCartLoading ||
                  cartLoading
                }
                className={`group relative w-full py-7 text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] overflow-hidden transition-all
                  ${
                    stockStatus.disabled
                      ? "bg-gray-300 cursor-not-allowed opacity-60"
                      : "bg-black text-white hover:bg-[#be1e2d]"
                  }`}
              >
                {!stockStatus.disabled && (
                  <span className="absolute inset-0 translate-y-full bg-[#be1e2d] transition-transform duration-500 ease-out group-hover:translate-y-0" />
                )}
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <CreditCard size={18} />
                  {purchaseLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : stockStatus.disabled ? (
                    "Not Available"
                  ) : (
                    "Purchase Now"
                  )}
                </span>
              </button>
            </>
          )}
        </div>

        {addedFeedback && !stockStatus.disabled && (
          <p className="text-[10px] text-gray-400 uppercase tracking-wider text-center mt-4 animate-pulse">
            ✓ Item added • Change color or size to update selection
          </p>
        )}

        {stockStatus.status === "low" && (
          <p className="text-[10px] text-amber-600 uppercase tracking-wider text-center mt-4 font-bold">
            ⚡ Limited availability - order soon
          </p>
        )}
      </div>
    </div>
  );
}
