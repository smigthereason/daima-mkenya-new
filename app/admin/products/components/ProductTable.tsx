// app/admin/products/components/ProductTable.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Eye,
  EyeOff,
  Search,
  X,
} from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import DeleteProductModal from "./DeleteProductModal";

type Item = {
  _id: string;
  name: string;
  heroImage?: any;
  image?: any;
  category?: string;
  categories?: string[];
  editionInfo?: string;
  price?: string;
  stock?: number;
  disabled?: boolean;
  status?: string;
};

export default function ProductTable({
  items,
  isOneOffView,
  schemaType,
  initialStatus,
  toggleProductStatus,
  updateStock,
}: {
  items: Item[];
  isOneOffView: boolean;
  schemaType: string;
  initialStatus?: string;
  toggleProductStatus: (formData: FormData) => Promise<void>;
  updateStock: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Show a success modal after a redirect from Add/Edit, then scrub the
  // ?status= param from the URL so refreshing the page doesn't re-show it.
  useEffect(() => {
    if (initialStatus === "created" || initialStatus === "updated") {
      setSuccessMessage(
        initialStatus === "created"
          ? `${isOneOffView ? "Piece" : "Product"} added successfully.`
          : `${isOneOffView ? "Piece" : "Product"} updated successfully.`,
      );
      const cleanUrl = isOneOffView
        ? "/admin/products?type=one-off"
        : "/admin/products";
      router.replace(cleanUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStatus]);

  const categoryOptions = useMemo(() => {
    if (isOneOffView) return [];
    const all = new Set<string>();
    items.forEach((item) => {
      (item.categories || []).forEach((c) => all.add(c));
    });
    return Array.from(all).sort();
  }, [items, isOneOffView]);

  const filteredItems = useMemo(() => {
    let result = items;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((item) => item.name?.toLowerCase().includes(q));
    }

    if (!isOneOffView && categoryFilter !== "all") {
      result = result.filter((item) =>
        (item.categories || []).includes(categoryFilter),
      );
    }

    if (isOneOffView && statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    return result;
  }, [items, searchQuery, categoryFilter, statusFilter, isOneOffView]);

  return (
    <div className="space-y-6">
      {/* ── SEARCH + FILTER BAR ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search by ${isOneOffView ? "piece" : "product"} name...`}
            className="w-full pl-11 pr-4 py-3.5 border border-neutral-200 bg-white text-sm focus:border-black outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {isOneOffView ? (
          <div className="relative sm:w-52">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3.5 border border-neutral-200 bg-white text-[11px] font-black uppercase tracking-widest outline-none focus:border-black cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"
            />
          </div>
        ) : (
          <div className="relative sm:w-52">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3.5 border border-neutral-200 bg-white text-[11px] font-black uppercase tracking-widest outline-none focus:border-black cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-900"
            />
          </div>
        )}
      </div>

      <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
        Showing {filteredItems.length} of {items.length}{" "}
        {isOneOffView ? "pieces" : "products"}
      </p>

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
              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-[11px] text-neutral-400 uppercase tracking-widest font-bold"
                  >
                    No {isOneOffView ? "pieces" : "products"} match your
                    search
                  </td>
                </tr>
              )}
              {filteredItems.map((item) => (
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
                    {isOneOffView
                      ? item.editionInfo
                      : (item.categories || []).join(", ") || "—"}
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
                        {item.stock !== undefined &&
                          item.stock <= 5 &&
                          item.stock > 0 && (
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
                      <DeleteProductModal
                        productId={item._id}
                        productName={item.name}
                        isOneOff={isOneOffView}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SUCCESS MODAL ── */}
      {successMessage && (
        <div
          className="fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-[100]"
          onClick={() => setSuccessMessage(null)}
        >
          <div
            className="bg-white w-full max-w-sm p-8 md:p-10 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSuccessMessage(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-black"
            >
              <X size={18} />
            </button>

            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-emerald-50 border border-emerald-100 mb-6 mx-auto">
              <CheckCircle2 size={26} className="text-emerald-600" />
            </div>

            <h2 className="text-xl font-black uppercase tracking-tighter mb-2">
              Success
            </h2>
            <p className="text-[13px] text-neutral-500 mb-8 leading-relaxed">
              {successMessage}
            </p>

            <button
              onClick={() => setSuccessMessage(null)}
              className="w-full py-3.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#006241] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
