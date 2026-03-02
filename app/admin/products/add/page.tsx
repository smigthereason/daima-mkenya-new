// app/admin/products/add/page.tsx
import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

async function addProductAction(formData: FormData) {
  "use server";

  // Generate slug from name
  const name = formData.get("name") as string;
  const slug =
    (formData.get("slug") as string) ||
    name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .substring(0, 200);

  // Handle File Uploads
  const heroImageFile = formData.get("heroImage") as File;
  let heroImageAsset;
  if (heroImageFile && heroImageFile.size > 0) {
    heroImageAsset = await client.assets.upload("image", heroImageFile);
  }

  // Handle thumbnails
  const thumbnails: any[] = [];
  for (let i = 1; i <= 4; i++) {
    const thumbFile = formData.get(`thumb${i}`) as File;
    if (thumbFile && thumbFile.size > 0) {
      const asset = await client.assets.upload("image", thumbFile);
      thumbnails.push({
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      });
    }
  }

  // Process Description
  const descriptionRaw = formData.get("description") as string;
  const descriptionArray = descriptionRaw
    .split("\n")
    .filter((line) => line.trim() !== "");

  // Process Colors (up to 4)
  const colors = [];
  for (let i = 1; i <= 4; i++) {
    const label = formData.get(`color${i}Label`);
    const hex = formData.get(`color${i}Hex`);
    if (label && hex) {
      colors.push({ label, hex });
    }
  }

  // Process Sizes
  const sizesRaw = formData.get("sizes") as string;
  const sizesArray = sizesRaw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");

  // Create Document
  await client.create({
    _type: "product",
    name: name,
    slug: {
      _type: "slug",
      current: slug,
    },
    price: formData.get("price"),
    category: formData.get("category"),
    description: descriptionArray,
    details: {
      material: formData.get("material") || "",
      care: formData.get("care") || "",
      origin: formData.get("origin") || "",
    },
    colors: colors,
    sizes: sizesArray,
    stock: Number(formData.get("stock")) || 0,
    isNew: formData.get("isNew") === "on",
    disabled: formData.get("disabled") === "on",
    images: {
      hero: heroImageAsset
        ? {
            _type: "image",
            asset: { _type: "reference", _ref: heroImageAsset._id },
          }
        : undefined,
      thumbnails: thumbnails.length > 0 ? thumbnails : [],
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export default function AddProductPage() {
  const inputClasses =
    "w-full p-4 border border-neutral-200 bg-white text-sm focus:border-black outline-none transition-colors";
  const labelClasses =
    "text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2";

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
          New <span className="font-black">Product</span>
        </h1>
        <p className="text-[10px] md:text-[11px] text-neutral-400 uppercase tracking-widest font-medium mt-2">
          Add a new product to the registry
        </p>
      </div>

      <form
        action={addProductAction}
        className="bg-white p-8 md:p-12 border border-neutral-100 space-y-10"
      >
        {/* Basic Info - Name and Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className={labelClasses}>Product Name *</label>
            <input
              name="name"
              required
              className={inputClasses}
              placeholder="e.g., Classic African T-Shirt"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Slug (URL)</label>
            <input
              name="slug"
              className={inputClasses}
              placeholder="auto-generated from name if left empty"
            />
            <p className="text-[8px] text-neutral-400 mt-1">
              Leave empty to auto-generate from name
            </p>
          </div>
        </div>

        {/* Category and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className={labelClasses}>Category *</label>
            <select
              name="category"
              required
              className={`${inputClasses} appearance-none bg-white`}
            >
              <option value="">Select a category</option>
              <option value="Accessories">Accessories</option>
              <option value="Streetwear">Streetwear</option>
              <option value="Sets">Sets</option>
              <option value="Shirts">Shirts</option>
              <option value="Tops">Tops</option>
              <option value="Skirts">Skirts</option>
              <option value="Dresses">Dresses</option>
              <option value="Jackets">Jackets</option>
              <option value="Trousers">Trousers</option>
              <option value="Knitwear">Knitwear</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Price *</label>
            <input
              name="price"
              required
              className={inputClasses}
              placeholder="KES 8,500"
            />
          </div>
        </div>

        {/* Stock and Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className={labelClasses}>Stock Quantity</label>
            <input
              name="stock"
              type="number"
              defaultValue={0}
              min="0"
              className={inputClasses}
            />
          </div>
          <div className="flex items-center gap-4 pt-6">
            <input
              type="checkbox"
              name="isNew"
              id="isNew"
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
          <label className={labelClasses}>
            Description (one paragraph per line)
          </label>
          <textarea
            name="description"
            rows={4}
            className={inputClasses}
            placeholder="Premium quality fabric...&#10;Ethically sourced in Kenya..."
          />
        </div>

        {/* Details - Material, Care, Origin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className={labelClasses}>Material</label>
            <input
              name="material"
              className={inputClasses}
              placeholder="e.g., 100% Cotton"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Care Instructions</label>
            <input
              name="care"
              className={inputClasses}
              placeholder="e.g., Machine wash cold"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Origin</label>
            <input
              name="origin"
              className={inputClasses}
              placeholder="e.g., Kenya"
            />
          </div>
        </div>

        {/* Colors - 4 fields to match schema */}
        <div className="space-y-4">
          <label className={labelClasses}>Colors (up to 4)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-2">
              <input
                name="color1Label"
                className={`${inputClasses} flex-1`}
                placeholder="Color name (e.g., Black)"
              />
              <input
                name="color1Hex"
                className={`${inputClasses} w-24`}
                placeholder="#000000"
              />
            </div>
            <div className="flex gap-2">
              <input
                name="color2Label"
                className={`${inputClasses} flex-1`}
                placeholder="Color name"
              />
              <input
                name="color2Hex"
                className={`${inputClasses} w-24`}
                placeholder="#FFFFFF"
              />
            </div>
            <div className="flex gap-2">
              <input
                name="color3Label"
                className={`${inputClasses} flex-1`}
                placeholder="Color name"
              />
              <input
                name="color3Hex"
                className={`${inputClasses} w-24`}
                placeholder="#FF0000"
              />
            </div>
            <div className="flex gap-2">
              <input
                name="color4Label"
                className={`${inputClasses} flex-1`}
                placeholder="Color name"
              />
              <input
                name="color4Hex"
                className={`${inputClasses} w-24`}
                placeholder="#00FF00"
              />
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-2">
          <label className={labelClasses}>Sizes (comma separated)</label>
          <input
            name="sizes"
            className={inputClasses}
            placeholder="XS, S, M, L, XL, XXL"
          />
        </div>

        {/* Images */}
        <div className="space-y-4">
          <label className={labelClasses}>Hero Image *</label>
          <input
            name="heroImage"
            type="file"
            required
            accept="image/*"
            className="w-full text-sm text-neutral-500 file:mr-4 file:py-3 file:px-6 file:border file:border-black file:text-[10px] file:font-black file:bg-white file:text-black hover:file:bg-black hover:file:text-white transition-colors"
          />
        </div>

        <div className="space-y-4">
          <label className={labelClasses}>Thumbnails (up to 4)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="thumb1"
              type="file"
              accept="image/*"
              className="text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border file:border-neutral-200 file:text-[9px] file:font-black file:bg-white file:text-neutral-600 hover:file:bg-black hover:file:text-white"
            />
            <input
              name="thumb2"
              type="file"
              accept="image/*"
              className="text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border file:border-neutral-200 file:text-[9px] file:font-black file:bg-white file:text-neutral-600 hover:file:bg-black hover:file:text-white"
            />
            <input
              name="thumb3"
              type="file"
              accept="image/*"
              className="text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border file:border-neutral-200 file:text-[9px] file:font-black file:bg-white file:text-neutral-600 hover:file:bg-black hover:file:text-white"
            />
            <input
              name="thumb4"
              type="file"
              accept="image/*"
              className="text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border file:border-neutral-200 file:text-[9px] file:font-black file:bg-white file:text-neutral-600 hover:file:bg-black hover:file:text-white"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white font-black py-6 uppercase tracking-[0.3em] text-xs hover:bg-[#006241] transition-all"
        >
          Publish to Registry
        </button>
      </form>
    </div>
  );
}
