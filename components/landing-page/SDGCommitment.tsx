// /* eslint-disable react/no-unescaped-entities */
// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { client } from "@/sanity/lib/client";
// import { urlFor } from "@/sanity/lib/image";
// // Importing assets from the centralized index
// import { SDG1, Hero33, Hero77, Hero55 } from "@/public/assets";

// // Define Product type
// interface Product {
//   _id: string;
//   name: string;
//   slug: {
//     current: string;
//   };
//   images?: {
//     hero?: {
//       asset?: {
//         url?: string;
//       };
//     };
//   };
// }

// const SdgCommitment = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   const essentials = [
//     {
//       title: "ELEGANT",
//       subtitle: "SDG 8",
//       color: "#000000",
//       bgImage: SDG1,
//     },
//     {
//       title: "INNOVATIVE",
//       subtitle: "SDG 9",
//       color: "#BB0000",
//       bgImage: Hero33,
//     },
//     {
//       title: "DELUXE",
//       subtitle: "SDG 12",
//       color: "#008000",
//       bgImage: Hero77,
//     },
//     {
//       title: "ACTIVE",
//       subtitle: "SDG 13",
//       color: "#E8E8E8",
//       bgImage: Hero55,
//     },
//   ];

//   const productSlugs = [
//     "one-love-polo",
//     "kenyan-leopard",
//     "theluji-oversized-shirt",
//   ];

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const query = `*[_type == "product" && slug.current in $slugs] {
//           _id,
//           name,
//           slug,
//           images {
//             hero {
//               asset-> {
//                 url
//               }
//             }
//           }
//         }`;

//         const fetchedProducts = await client.fetch(query, {
//           slugs: productSlugs,
//         });

//         const sortedProducts = productSlugs
//           .map((slug) =>
//             fetchedProducts.find((p: Product) => p.slug.current === slug),
//           )
//           .filter(Boolean);

//         setProducts(sortedProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <section className="bg-[#e8e8e8] py-24 overflow-hidden border-b border-neutral-300">
//       {/* Luxury Minimalist Header */}
//       <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
//         <span className="text-[10px] tracking-[0.5em] text-neutral-400 uppercase block mb-4">
//           The Commitment
//         </span>
//         <h2 className="text-4xl md:text-7xl font-serif tracking-tighter text-neutral-900 uppercase">
//           SUSTAINABLE <br /> ELEGANCE
//         </h2>
//       </div>

//       {/* Large Grid Cards with Background Images */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-neutral-100 border-y border-neutral-200 mb-32 m-4 sm:m-0">
//         {essentials.map((item, idx) => (
//           <div
//             key={idx}
//             className="group relative aspect-4/5 sm:aspect-square lg:aspect-3/4 bg-neutral-900 flex flex-col justify-center items-center overflow-hidden"
//           >
//             <div className="absolute inset-0 z-0 overflow-hidden">
//               <Image
//                 src={
//                   typeof item.bgImage === "string"
//                     ? item.bgImage
//                     : item.bgImage.src
//                 }
//                 alt={item.title}
//                 fill
//                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                 className="object-cover transition-all duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-80"
//                 priority={idx < 2}
//                 unoptimized
//               />
//             </div>
//             <div className="relative z-10 text-center px-4">
//               <h3 className="text-xl md:text-3xl font-serif tracking-[0.2em] text-white uppercase wrap-break-words">
//                 {item.title}
//               </h3>
//             </div>
//             <div
//               className="absolute bottom-0 left-0 w-full h-1.5 transition-transform duration-700 scale-x-0 group-hover:scale-x-100 origin-left z-20"
//               style={{ backgroundColor: item.color }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Heritage Gallery - Full Width High-Portrait Uniform Grid */}
//       <div className="w-full px-2 sm:px-4">
//         <div className="text-center mt-32 mb-32">
//           <span className="text-[18px] tracking-[0.6em] text-neutral-800 uppercase">
//             The Heritage Collection
//           </span>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center h-[70vh]">
//             <div className="w-10 h-10 border-2 border-[#008000] border-t-transparent rounded-full animate-spin" />
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0">
//             {products.map((product, i) => (
//               <Link
//                 key={product._id}
//                 href={`/products/${product.slug.current}`}
//                 className="group relative aspect-4/5 overflow-hidden block cursor-pointer "
//               >
//                 <div className="relative w-full h-full">
//                   {product.images?.hero?.asset?.url && (
//                     <Image
//                       src={urlFor(product.images.hero).url()}
//                       alt={product.name}
//                       fill
//                       sizes="(max-width: 768px) 100vw, 33vw"
//                       // object-contain + aspect-[3/4] ensures the full height product is shown without being cropped
//                       className="object-contain  transition-transform duration-[2s] ease-out group-hover:scale-105"
//                       priority={i === 0}
//                       unoptimized
//                     />
//                   )}
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Brand Statement */}
//       <div className="max-w-3xl mx-auto text-center px-6 mt-64 mb-20">
//         <p className="text-xl md:text-2xl text-neutral-800 font-light leading-relaxed italic font-serif">
//           Identity is a story best worn. <br /> Ours is written in the bold
//           colours of Kenya,
//           <br /> a powerful expression of who we are. <br /> Let it speak before
//           you do.
//         </p>
//         <div className="mt-16 h-24 w-px bg-neutral-500 mx-auto" />
//       </div>
//     </section>
//   );
// };

// export default SdgCommitment;
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
// Importing assets from the centralized index
import { SDG1, Hero33, Hero77, Hero55 } from "@/public/assets";

// Define Product type
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const essentials = [
    {
      title: "ELEGANT",
      subtitle: "SDG 8",
      color: "#000000",
      bgImage: SDG1,
    },
    {
      title: "INNOVATIVE",
      subtitle: "SDG 9",
      color: "#BB0000",
      bgImage: Hero33,
    },
    {
      title: "DELUXE",
      subtitle: "SDG 12",
      color: "#008000",
      bgImage: Hero77,
    },
    {
      title: "ACTIVE",
      subtitle: "SDG 13",
      color: "#E8E8E8",
      bgImage: Hero55,
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

  return (
    <section className="bg-[#e8e8e8] py-24 overflow-hidden border-b border-neutral-300">
      {/* Luxury Minimalist Header */}
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <span className="text-[10px] tracking-[0.5em] text-neutral-400 uppercase block mb-4">
          The Commitment
        </span>
        <h2 className="text-4xl md:text-7xl font-serif tracking-tighter text-neutral-900 uppercase">
          SUSTAINABLE <br /> ELEGANCE
        </h2>
      </div>

      {/* Large Grid Cards with Background Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-neutral-100 border-y border-neutral-200 mb-32 m-4 sm:m-0">
        {essentials.map((item, idx) => (
          <div
            key={idx}
            className="group relative aspect-4/5 sm:aspect-square lg:aspect-3/4 bg-neutral-900 flex flex-col justify-center items-center overflow-hidden"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={
                  typeof item.bgImage === "string"
                    ? item.bgImage
                    : item.bgImage.src
                }
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-all duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                priority={idx < 2}
                unoptimized
              />
            </div>
            <div className="relative z-10 text-center px-4">
              <h3 className="text-xl md:text-3xl font-serif tracking-[0.2em] text-white uppercase wrap-break-words">
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

      {/* Heritage Gallery - 3x1 Grid Styled Like Sustainable Elegance */}
      <div className="w-full px-2 sm:px-4 mb-32 m-4 sm:m-0">
        <div className="text-center mt-32 mb-32">
          <span className="text-[18px] tracking-[0.6em] text-neutral-800 uppercase">
            The Heritage Collection
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[70vh]">
            <div className="w-10 h-10 border-2 border-[#008000] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2  ">
            {products.map((product, idx) => (
              <div
                key={product._id}
                className="group relative aspect-4/5 sm:aspect-square lg:aspect-3/4 bg-neutral-900 flex flex-col justify-center items-center overflow-hidden border border-neutral-400"
              >
                <div className="absolute inset-0 z-0 overflow-hidden">
                  {product.images?.hero?.asset?.url ? (
                    <Image
                      src={urlFor(product.images.hero).url()}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-all duration-1000 group-hover:scale-105 "
                      priority={idx < 2}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                      <span className="text-neutral-500 text-sm">No image</span>
                    </div>
                  )}
                </div>

                {product.slug && (
                  <Link
                    href={`/products/${product.slug.current}`}
                    className="absolute inset-0 z-30"
                    aria-label={`View ${product.name}`}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brand Statement */}
      <div className="max-w-3xl mx-auto text-center px-6 mt-64 mb-20">
        <p className="text-xl md:text-2xl text-neutral-800 font-light leading-relaxed italic font-serif">
          Identity is a story best worn. <br /> Ours is written in the bold
          colours of Kenya,
          <br /> a powerful expression of who we are. <br /> Let it speak before
          you do.
        </p>
        <div className="mt-16 h-24 w-px bg-neutral-500 mx-auto" />
      </div>
    </section>
  );
};

export default SdgCommitment;
