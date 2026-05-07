/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { SDG1, Hero33, Hero77, Hero55 } from "@/public/assets";

interface Product {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  images?: {
    hero?: {
      asset?: {
        url?: string;
      };
    };
  };
}

const SdgCommitment = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  const essentials = [
    {
      title: "ELEGANT",
      subtitle: "SDG 8",
      color: "#000000",
      bgImage: SDG1,
      slug: null,
      routeToProducts: true,
    },
    {
      title: "INNOVATIVE",
      subtitle: "SDG 9",
      color: "#BB0000",
      bgImage: Hero33,
      slug: null,
      routeToProducts: true,
    },
    {
      title: "DELUXE",
      subtitle: "SDG 12",
      color: "#008000",
      bgImage: Hero77,
      slug: "kenyan-leopard",
      routeToProducts: false,
    },
    {
      title: "ACTIVE",
      subtitle: "SDG 13",
      color: "#E8E8E8",
      bgImage: Hero55,
      slug: "one-love-vest",
      routeToProducts: false,
    },
  ];

  const productSlugs = [
    "one-love-polo",
    "theluji-oversized-shirt",
    "theluji-shorts-set",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `*[_type == "product" && slug.current in $slugs] {
          _id,
          name,
          slug,
          images {
            hero {
              asset-> {
                url
              }
            }
          }
        }`;

        const fetchedProducts = await client.fetch(query, {
          slugs: productSlugs,
        });

        const sortedProducts = productSlugs
          .map((slug) =>
            fetchedProducts.find((p: Product) => p.slug.current === slug),
          )
          .filter(Boolean);

        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEssentialClick = (item: (typeof essentials)[0]) => {
    if (item.routeToProducts) {
      router.push("/products");
    } else if (item.slug) {
      router.push(`/products/${item.slug}`);
    }
  };

  return (
    <section className="bg-[#F9F9F8] py-16 md:py-24 overflow-hidden border-b border-neutral-300">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-24 text-center">
        <span className="text-[10px] tracking-[0.5em] text-neutral-400 uppercase block mb-4">
          The Commitment
        </span>
        <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif tracking-tighter text-neutral-900 uppercase leading-tight">
          SUSTAINABLE <br /> ELEGANCE
        </h2>
      </div>

      {/* Sustainable Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-neutral-100 border-y border-neutral-200 mb-20 md:mb-32 px-4 sm:px-0">
        {essentials.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleEssentialClick(item)}
            className="group relative aspect-[4/5] sm:aspect-square bg-neutral-900 flex flex-col justify-center items-center overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={
                  typeof item.bgImage === "string"
                    ? item.bgImage
                    : item.bgImage.src
                }
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-all duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                priority={idx < 2}
              />
            </div>
            <div className="relative z-10 text-center px-4">
              <h3 className="text-xl md:text-3xl font-serif tracking-[0.2em] text-white uppercase">
                {item.title}
              </h3>
            </div>
            <div
              className="absolute bottom-0 left-0 w-full h-1.5 transition-transform duration-700 scale-x-0 group-hover:scale-x-100 origin-left z-20"
              style={{ backgroundColor: item.color }}
            />
          </div>
        ))}
      </div>

      {/* Heritage Collection Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-24">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-sm md:text-lg tracking-[0.4em] md:tracking-[0.6em] text-neutral-800 uppercase block">
            The Heritage Collection
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-neutral-800 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-2">
            {products.map((product, idx) => (
              <div
                key={product._id}
                className="group relative aspect-[4/5] sm:aspect-square lg:aspect-[3/4] bg-neutral-900 flex flex-col justify-center items-center overflow-hidden border border-neutral-200"
                onMouseEnter={() => setHoveredProductId(product._id)}
                onMouseLeave={() => setHoveredProductId(null)}
              >
                <div className="absolute inset-0 z-0">
                  {product.images?.hero?.asset?.url ? (
                    <Image
                      src={urlFor(product.images.hero).url()}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-all duration-1000 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                      <span className="text-neutral-500 text-xs uppercase tracking-widest">
                        No Image
                      </span>
                    </div>
                  )}
                </div>

                {/* Bookmark Overlay - Visible on Hover for Desktop, Always for Mobile */}
                <div
                  className={`absolute bottom-0 right-0 z-20 bg-black/40 backdrop-blur-sm px-4 py-2 transition-all duration-500 ${
                    hoveredProductId === product._id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0"
                  } sm:opacity-100 sm:translate-y-0`}
                >
                  <span className="text-white text-[10px] md:text-xs uppercase tracking-[0.2em] font-serif">
                    {product.name}
                  </span>
                </div>

                <Link
                  href={`/products/${product.slug.current}`}
                  className="absolute inset-0 z-30"
                  aria-label={`View ${product.name}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brand Statement */}
      <div className="max-w-3xl mx-auto text-center px-6 mt-32 mb-10">
        <p className="text-lg md:text-2xl text-neutral-800 font-light leading-relaxed italic font-serif">
          Identity is a story best worn. <br className="hidden md:block" />
          Ours is written in the bold colours of Kenya,{" "}
          <br className="hidden md:block" />a powerful expression of who we are.{" "}
          <br className="hidden md:block" />
          Let it speak before you do.
        </p>
        <div className="mt-12 h-20 w-px bg-neutral-400 mx-auto" />
      </div>
    </section>
  );
};

export default SdgCommitment;
