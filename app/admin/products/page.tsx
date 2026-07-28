// app/admin/products/page.tsx
import { serverClient } from "@/sanity/lib/server-client";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Plus, Diamond, Package } from "lucide-react";
import ProductTable from "./components/ProductTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function toggleProductStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const type = formData.get("type") as string;

  if (type === "oneOff") {
    const currentStatus = formData.get("currentStatusString");
    const newStatus = currentStatus === "sold" ? "available" : "sold";
    await serverClient.patch(id).set({ status: newStatus }).commit();
  } else {
    const currentStatus = formData.get("currentStatus") === "true";
    await serverClient.patch(id).set({ disabled: !currentStatus }).commit();
  }
  revalidatePath("/admin/products");
}

async function updateStock(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const stock = Number(formData.get("stock"));
  await serverClient.patch(id).set({ stock }).commit();
  revalidatePath("/admin/products");
}

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>; // Next.js 15 requirement
}) {
  // FIX: Unwrapping the searchParams promise
  const resolvedSearchParams = await searchParams;
  const isOneOffView = resolvedSearchParams.type === "one-off";
  const schemaType = isOneOffView ? "oneOff" : "product";

  // IMPORTANT: use serverClient (useCdn: false) here, not the CDN-backed
  // `client`. Sanity's API CDN can take up to ~60s to reflect a write, which
  // is why newly added/updated products used to take a while to show up
  // here even though the Sanity dataset itself updated immediately.
  const items = await serverClient.fetch(
    `*[_type == "${schemaType}"] | order(_createdAt desc) {
      _id,
      name,
      ${isOneOffView ? "status, editionInfo, image" : "price, categories, stock, disabled, 'heroImage': images.hero"}
    }`,
  );

  return (
    <div className="space-y-12 animate-fadeIn px-4 md:px-0">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 border-b border-neutral-100 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tighter uppercase leading-[0.9]">
            {isOneOffView ? "One-Off" : "Inventory"}{" "}
            <span className="font-black">Registry</span>
          </h1>
          <p className="text-[10px] md:text-[11px] text-neutral-400 uppercase tracking-widest font-medium mt-2">
            Manage {isOneOffView ? "archival pieces" : "store products"} and
            visibility
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Toggle Switch */}
          <div className="flex bg-neutral-100 p-1 rounded-sm border border-neutral-200">
            <Link
              href="/admin/products"
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                !isOneOffView
                  ? "bg-white shadow-sm text-black"
                  : "text-neutral-400 hover:text-black"
              }`}
            >
              <Package size={14} /> Standard
            </Link>
            <Link
              href="/admin/products?type=one-off"
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                isOneOffView
                  ? "bg-white shadow-sm text-black"
                  : "text-neutral-400 hover:text-black"
              }`}
            >
              <Diamond size={14} /> One-Offs
            </Link>
          </div>

          <Link
            href={
              isOneOffView
                ? "/admin/products/add-one-off"
                : "/admin/products/add"
            }
            className="group relative inline-flex items-center gap-3 py-4 px-8 border border-black bg-black text-white hover:bg-white hover:text-black transition-all"
          >
            <Plus size={16} className="relative z-10" />
            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em]">
              Add {isOneOffView ? "One-Off" : "Product"}
            </span>
          </Link>
        </div>
      </div>

      <ProductTable
        items={items}
        isOneOffView={isOneOffView}
        schemaType={schemaType}
        initialStatus={resolvedSearchParams.status}
        toggleProductStatus={toggleProductStatus}
        updateStock={updateStock}
      />
    </div>
  );
}
