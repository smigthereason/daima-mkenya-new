// app/admin/products/page.tsx
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit3,
  AlertCircle,
  Eye,
  EyeOff,
  Diamond,
  Package,
} from "lucide-react";

async function deleteProduct(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await client.delete(id);
  revalidatePath("/admin/products");
}

async function toggleProductStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const type = formData.get("type") as string;

  if (type === "oneOff") {
    const currentStatus = formData.get("currentStatusString");
    const newStatus = currentStatus === "sold" ? "available" : "sold";
    await client.patch(id).set({ status: newStatus }).commit();
  } else {
    const currentStatus = formData.get("currentStatus") === "true";
    await client.patch(id).set({ disabled: !currentStatus }).commit();
  }
  revalidatePath("/admin/products");
}

async function updateStock(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const stock = Number(formData.get("stock"));
  await client.patch(id).set({ stock }).commit();
  revalidatePath("/admin/products");
}

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>; // Next.js 15 requirement
}) {
  // FIX: Unwrapping the searchParams promise
  const resolvedSearchParams = await searchParams;
  const isOneOffView = resolvedSearchParams.type === "one-off";
  const schemaType = isOneOffView ? "oneOff" : "product";

  const items = await client.fetch(
    `*[_type == "${schemaType}"] | order(_createdAt desc) {
      _id,
      name,
      ${isOneOffView ? "status, editionInfo, image" : "price, category, stock, disabled, 'heroImage': images.hero"}
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

      {/* ── TABLE SECTION ── */}
      <div className="bg-white border border-neutral-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-0">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                  {isOneOffView ? "Piece" : "Product"}
                </th>
                <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                  {isOneOffView ? "Edition" : "Category"}
                </th>
                <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                  {isOneOffView ? "Status" : "Price"}
                </th>
                <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                  {isOneOffView ? "Archive" : "Stock"}
                </th>
                <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                  Visibility
                </th>
                <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((item: any) => (
                <tr
                  key={item._id}
                  className={`hover:bg-neutral-50 transition-colors ${
                    !isOneOffView && item.disabled ? "opacity-40" : ""
                  }`}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-neutral-100 relative border border-neutral-200">
                        <Image
                          src={urlFor(
                            isOneOffView ? item.image : item.heroImage,
                          ).url()}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <span className="font-black text-black text-sm tracking-tight">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    {isOneOffView ? item.editionInfo : item.category}
                  </td>

                  <td className="px-6 py-5 text-sm font-black text-black">
                    {isOneOffView ? (
                      <span
                        className={`text-[9px] px-2 py-1 rounded-full border ${item.status === "sold" ? "bg-neutral-900 text-white" : "border-emerald-200 text-emerald-600"}`}
                      >
                        {item.status === "sold" ? "SOLD" : "AVAILABLE"}
                      </span>
                    ) : (
                      item.price
                    )}
                  </td>

                  <td className="px-6 py-5">
                    {!isOneOffView ? (
                      <>
                        <form
                          action={updateStock}
                          className="flex items-center gap-2"
                        >
                          <input type="hidden" name="id" value={item._id} />
                          <input
                            type="number"
                            name="stock"
                            defaultValue={item.stock || 0}
                            min="0"
                            className="w-16 p-2 text-xs border border-neutral-200 focus:ring-0 focus:border-black outline-none"
                          />
                          <button
                            type="submit"
                            className="text-[9px] font-black bg-neutral-900 text-white px-3 py-2 uppercase tracking-wider hover:bg-red-600 transition-colors"
                          >
                            Update
                          </button>
                        </form>
                        {item.stock <= 5 && item.stock > 0 && (
                          <span className="flex items-center gap-1 text-amber-600 font-black text-[9px] uppercase mt-2 tracking-widest">
                            <AlertCircle size={10} /> Low Stock
                          </span>
                        )}
                        {item.stock === 0 && (
                          <span className="flex items-center gap-1 text-red-600 font-black text-[9px] uppercase mt-2 tracking-widest">
                            <AlertCircle size={10} /> Out of Stock
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest ">
                        One-off
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <form action={toggleProductStatus}>
                      <input type="hidden" name="id" value={item._id} />
                      <input type="hidden" name="type" value={schemaType} />

                      {isOneOffView ? (
                        <>
                          <input
                            type="hidden"
                            name="currentStatusString"
                            value={item.status}
                          />
                          <button
                            type="submit"
                            className="text-[9px] font-black uppercase text-neutral-400 hover:text-black transition-all underline underline-offset-4"
                          >
                            Toggle Status
                          </button>
                        </>
                      ) : (
                        <>
                          <input
                            type="hidden"
                            name="currentStatus"
                            value={item.disabled ? "true" : "false"}
                          />
                          <button
                            type="submit"
                            className={`flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 uppercase tracking-widest ${
                              item.disabled
                                ? "bg-red-50 text-red-600 border border-red-100"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            }`}
                          >
                            {item.disabled ? (
                              <>
                                <EyeOff size={12} /> Hidden
                              </>
                            ) : (
                              <>
                                <Eye size={12} /> Visible
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </form>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={
                          isOneOffView
                            ? `/admin/products/edit-one-off/${item._id}`
                            : `/admin/products/edit/${item._id}`
                        }
                        className="p-2 text-neutral-400 hover:text-black"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={item._id} />
                        <button className="p-2 text-neutral-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
