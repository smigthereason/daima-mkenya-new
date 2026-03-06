import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProductBySlug } from "@/types/Product";

const baseUrl = "https://daimamkenyaafrica.com";

// Update the type - params is now a Promise
type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Add await here
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const url = `${baseUrl}/products/${slug}`;

  if (!product) {
    return {
      title: "Product not found | Daima Mkenya Africa",
      description: "This product is not available.",
      alternates: { canonical: url },
      robots: { index: false, follow: false },
    };
  }

  const name = product.name;
  const category = product.category;
  const descriptionText =
    product.description?.join(" ").slice(0, 150) ||
    "Premium Kenyan-branded clothing made in Nairobi.";

  const title = `${name} – ${category} | Daima Mkenya Africa`;
  const description = `${descriptionText} Shop ${name} in the ${category} collection from Daima Mkenya Africa, crafted in Nairobi and shipped worldwide.`;

  const ogImageUrl =
    product.images?.hero?.asset?.url ||
    "https://www.daimamkenyaafrica.com/assets/4.4.webp";

  const ogImageAlt =
    product.images?.hero?.alt || `${name} – Daima Mkenya Africa`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Daima Mkenya Africa",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
      locale: "en_KE",
      type: "website",
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      images: ogImageUrl,
      creator: "@Daimaafricake_",
    },
    robots: {
      index: product.disabled ? false : true,
      follow: product.disabled ? false : true,
    },
  };
}

export default async function Page({ params }: PageProps) {
  // Add await here
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const url = `${baseUrl}/products/${slug}`;

  const productJsonLd =
    product && !product.disabled
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          image: [
            product.images?.hero?.asset?.url ||
              "https://www.daimamkenyaafrica.com/assets/4.4.webp",
          ],
          description:
            product.description?.join(" ").slice(0, 200) ||
            "Premium Kenyan-branded clothing made in Nairobi.",
          sku: product._id,
          category: product.category,
          brand: {
            "@type": "Brand",
            name: "Daima Mkenya Africa",
          },
          color: product.colors?.map((c) => c.label).join(", ") || undefined,
          material: product.details?.material || undefined,
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "KES",
            price: product.price,
            availability:
              product.stock && product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        }
      : null;

  const breadcrumbJsonLd =
    product && !product.disabled
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@id": baseUrl,
                name: "Home",
              },
            },
            {
              "@type": "ListItem",
              position: 2,
              item: {
                "@id": `${baseUrl}/products`,
                name: "Products",
              },
            },
            {
              "@type": "ListItem",
              position: 3,
              item: {
                "@id": url,
                name: product.name,
              },
            },
          ],
        }
      : null;

  return (
    <main className="min-h-screen flex flex-col items-center bg-white pb-20">
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd),
          }}
        />
      )}

      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
      )}

      <div className="w-full">
        <ProductCard productSlug={slug} />
      </div>

      <div className="mt-12 mb-10 flex justify-center w-full">
        <Link
          href="/products"
          className="group relative inline-flex items-center gap-4 py-4 md:py-8 px-8 md:px-16 border border-black/10 overflow-hidden transition-all hover:border-black"
        >
          <span className="relative z-10 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] xl:tracking-[0.8em] group-hover:text-white transition-colors duration-500">
            BACK TO COLLECTION
          </span>
          <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
        </Link>
      </div>
    </main>
  );
}
