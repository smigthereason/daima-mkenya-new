// app/admin/products/page.tsx
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Edit3, AlertCircle, Eye, EyeOff } from "lucide-react";

async function deleteProduct(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await client.delete(id);
  revalidatePath("/admin/products");
}

async function toggleProductStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const currentStatus = formData.get("currentStatus") === "true";
  await client.patch(id).set({ disabled: !currentStatus }).commit();
  revalidatePath("/admin/products");
}

async function updateStock(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const stock = Number(formData.get("stock"));
  await client.patch(id).set({ stock }).commit();
  revalidatePath("/admin/products");
}

export default async function ProductListPage() {
  const products = await client.fetch(
    `*[_type == "product"] | order(_createdAt desc) {
      _id,
      name,
      price,
      category,
      stock,
      disabled,
      "heroImage": images.hero,
    }`,
  );

  return (
    <div className="space-y-12 animate-fadeIn px-4 md:px-0">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 border-b border-neutral-100 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tighter uppercase leading-[0.9]">
            Inventory <span className="font-black">Registry</span>
          </h1>
          <p className="text-[10px] md:text-[11px] text-neutral-400 uppercase tracking-widest font-medium mt-2">
            Manage store products and visibility
          </p>
        </div>
        <Link
          href="/admin/products/add"
          className="group relative inline-flex items-center gap-3 py-4 px-8 border border-black bg-black text-white hover:bg-white hover:text-black transition-all"
        >
          <Plus size={16} className="relative z-10" />
          <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em]">
            Add Product
          </span>
        </Link>
      </div>

      {/* ── TABLE / GRID SECTION ── */}
      <div className="bg-white border border-neutral-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-0">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                  Product
                </th>
                <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                  Category
                </th>
                <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                  Price
                </th>
                <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                  Stock
                </th>
                <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                  Status
                </th>
                <th className="px-6 py-5 text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((product: any) => (
                <tr
                  key={product._id}
                  className={`hover:bg-neutral-50 transition-colors ${
                    product.disabled ? "opacity-40" : ""
                  }`}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-neutral-100 relative border border-neutral-200">
                        {product.heroImage && (
                          <Image
                            src={urlFor(product.heroImage).url()}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="64px"
                          />
                        )}
                      </div>
                      <span className="font-black text-black text-sm tracking-tight">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    {product.category}
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-black">
                    {product.price}
                  </td>
                  <td className="px-6 py-5">
                    <form
                      action={updateStock}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="id" value={product._id} />
                      <input
                        type="number"
                        name="stock"
                        defaultValue={product.stock || 0}
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
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="flex items-center gap-1 text-amber-600 font-black text-[9px] uppercase mt-2 tracking-widest">
                        <AlertCircle size={10} /> Low Stock
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="flex items-center gap-1 text-red-600 font-black text-[9px] uppercase mt-2 tracking-widest">
                        <AlertCircle size={10} /> Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <form action={toggleProductStatus}>
                      <input type="hidden" name="id" value={product._id} />
                      <input
                        type="hidden"
                        name="currentStatus"
                        value={product.disabled ? "true" : "false"}
                      />
                      <button
                        type="submit"
                        className={`flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 uppercase tracking-widest ${
                          product.disabled
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}
                      >
                        {product.disabled ? (
                          <>
                            <EyeOff size={12} /> Hidden
                          </>
                        ) : (
                          <>
                            <Eye size={12} /> Visible
                          </>
                        )}
                      </button>
                    </form>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/admin/products/edit/${product._id}`}
                        className="p-2 text-neutral-400 hover:text-black"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product._id} />
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
