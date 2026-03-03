// app/admin/products/edit/[id]/page.tsx
import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

async function updateProduct(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const price = formData.get("price") as string;
  const category = formData.get("category") as string;
  const material = formData.get("material") as string;
  const care = formData.get("care") as string;
  const origin = formData.get("origin") as string;
  const stock = Number(formData.get("stock")) || 0;
  const isNew = formData.get("isNew") === "on";
  const disabled = formData.get("disabled") === "on";

  // Process description
  const descriptionRaw = formData.get("description") as string;
  const descriptionArray = descriptionRaw
    .split("\n")
    .filter((line) => line.trim() !== "");

  // Process sizes (multiple)
  const sizes = formData.getAll("sizes") as string[];

  // Process colors
  const colorLabels = formData.getAll("colorLabel") as string[];
  const colorHexes = formData.getAll("colorHex") as string[];
  const colors = colorLabels
    .map((label, index) => ({
      label,
      hex: colorHexes[index] || "#000000",
    }))
    .filter((c) => c.label.trim() !== "");

  // Update product
  await client
    .patch(id)
    .set({
      name,
      slug: {
        _type: "slug",
        current:
          slug ||
          name
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "-")
            .substring(0, 200),
      },
      price,
      category,
      description: descriptionArray,
      details: {
        material: material || "",
        care: care || "",
        origin: origin || "",
      },
      colors,
      sizes: sizes.filter((s) => s.trim() !== ""),
      stock,
      isNew,
      disabled,
    })
    .commit();

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const product = await client.fetch(
    `*[_type == "product" && _id == $id][0] {
      _id,
      name,
      "slug": slug.current,
      price,
      category,
      description,
      details {
        material,
        care,
        origin
      },
      stock,
      isNew,
      disabled,
      sizes,
      colors[] {
        label,
        hex
      },
      "heroImage": images.hero.asset->url,
      "thumbnails": images.thumbnails[].asset->url
    }`,
    { id },
  );

  if (!product) {
    notFound();
  }

  const categoryOptions = [
    "Accessories",
    "Streetwear",
    "Sets",
    "Shirts",
    "Tops",
    "Skirts",
    "Dresses",
    "Jackets",
    "Trousers",
    "Knitwear",
  ];

  const descriptionText = product.description?.join("\n") || "";

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 animate-fadeIn">
      {/* Header with back button */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/products"
          className="group flex items-center gap-2 text-neutral-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Back to Products
          </span>
        </Link>
      </div>

      {/* ── HEADER ── */}
      <div className="mb-12 border-b border-neutral-100 pb-10">
        <h1 className="text-4xl md:text-5xl font-light tracking-tighter uppercase leading-[0.9]">
          Edit <span className="font-black">Product</span>
        </h1>
        <p className="text-[10px] md:text-[11px] text-neutral-400 uppercase tracking-widest font-medium mt-2">
          ID: {product._id}
        </p>
      </div>

      {/* Product Image Preview */}
      {product.heroImage && (
        <div className="mb-8 p-6 bg-neutral-50 border border-neutral-100">
          <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-3">
            Current Hero Image
          </p>
          <div className="relative h-40 w-40 bg-white border border-neutral-200 overflow-hidden">
            <Image
              src={product.heroImage}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
              sizes="160px"
            />
          </div>
        </div>
      )}

      {/* Edit Form */}
      <form
        action={updateProduct}
        className="bg-white p-8 md:p-12 border border-neutral-100 space-y-10"
      >
        <input type="hidden" name="id" value={product._id} />

        {/* Basic Info - Name and Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2">
              Product Name *
            </label>
            <input
              name="name"
              defaultValue={product.name}
              required
              className="w-full p-4 border border-neutral-200 focus:border-black outline-none transition-colors text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2">
              Slug (URL)
            </label>
            <input
              name="slug"
              defaultValue={product.slug || ""}
              className="w-full p-4 border border-neutral-200 focus:border-black outline-none transition-colors text-sm"
            />
            <p className="text-[8px] text-neutral-400 mt-1">
              Auto-generated from name if left empty
            </p>
          </div>
        </div>

        {/* Category and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2">
              Category *
            </label>
            <select
              name="category"
              defaultValue={product.category}
              required
              className="w-full p-4 border border-neutral-200 focus:border-black outline-none transition-colors text-sm bg-white"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2">
              Price *
            </label>
            <input
              name="price"
              defaultValue={product.price}
              required
              className="w-full p-4 border border-neutral-200 focus:border-black outline-none transition-colors text-sm"
            />
          </div>
        </div>

        {/* Stock and Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2">
              Stock Quantity
            </label>
            <input
              name="stock"
              type="number"
              defaultValue={product.stock || 0}
              min="0"
              className="w-full p-4 border border-neutral-200 focus:border-black outline-none transition-colors text-sm"
            />
          </div>
          <div className="flex items-center gap-4 pt-6">
            <input
              type="checkbox"
              name="isNew"
              id="isNew"
              defaultChecked={product.isNew}
              className="w-4 h-4 accent-black"
            />
            <label
              htmlFor="isNew"
              className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]"
            >
              New Arrival
            </label>
          </div>
          <div className="flex items-center gap-4 pt-6">
            <input
              type="checkbox"
              name="disabled"
              id="disabled"
              defaultChecked={product.disabled}
              className="w-4 h-4 accent-red-600"
            />
            <label
              htmlFor="disabled"
              className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]"
            >
              Disable Product
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={descriptionText}
            className="w-full p-4 border border-neutral-200 focus:border-black outline-none transition-colors text-sm resize-none"
          />
        </div>

        {/* Details - Material, Care, Origin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2">
              Material
            </label>
            <input
              name="material"
              defaultValue={product.details?.material || ""}
              className="w-full p-4 border border-neutral-200 focus:border-black outline-none transition-colors text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2">
              Care Instructions
            </label>
            <input
              name="care"
              defaultValue={product.details?.care || ""}
              className="w-full p-4 border border-neutral-200 focus:border-black outline-none transition-colors text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2">
              Origin
            </label>
            <input
              name="origin"
              defaultValue={product.details?.origin || ""}
              className="w-full p-4 border border-neutral-200 focus:border-black outline-none transition-colors text-sm"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <label className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2">
            Colors
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((index) => {
              const color = product.colors?.[index];
              return (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    name="colorLabel"
                    defaultValue={color?.label || ""}
                    placeholder={`Color ${index + 1} name`}
                    className="flex-1 p-4 border border-neutral-200 focus:border-black outline-none text-sm"
                  />
                  <input
                    type="color"
                    name="colorHex"
                    defaultValue={color?.hex || "#000000"}
                    className="w-16 h-14 border border-neutral-200"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-4">
          <label className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2">
            Sizes
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
              const isChecked = product.sizes?.includes(size);
              return (
                <label
                  key={size}
                  className="flex items-center gap-2 p-3 border border-neutral-200 hover:border-black cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    name="sizes"
                    value={size}
                    defaultChecked={isChecked}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-xs font-bold">{size}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-neutral-100">
          <button
            type="submit"
            className="w-full bg-black text-white font-black py-6 uppercase tracking-[0.3em] text-xs hover:bg-[#006241] transition-all"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
