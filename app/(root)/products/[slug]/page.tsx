import ProductCard from "@/components/ProductCard";
import Link from "next/link";

// This page now uses slug instead of id
export default async function Page({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // Unwrapping the params promise
  const { slug } = await params;

  return (
    <main className="min-h-screen flex flex-col items-center bg-white pb-20">
      <div className="w-full">
        {/* Pass the slug into your ProductCard */}
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