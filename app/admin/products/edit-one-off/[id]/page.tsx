import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import SaveButton from "./SaveButton"; // We will define this as a small client component below

async function updateOneOff(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const descRaw = formData.get("description") as string;
  const descriptionArray = descRaw.split("\n").filter((l) => l.trim() !== "");

  const imageFile = formData.get("imageFile") as File;
  let newImageAsset;

  if (imageFile && imageFile.size > 0) {
    newImageAsset = await client.assets.upload("image", imageFile);
  }

  const patchData: any = {
    name: name,
    editionInfo: formData.get("editionInfo"),
    status: formData.get("status"),
    description: descriptionArray,
  };

  if (newImageAsset) {
    patchData.image = {
      _type: "image",
      asset: { _type: "reference", _ref: newImageAsset._id },
    };
  }

  await client.patch(id).set(patchData).commit();
  revalidatePath("/admin/products");
  redirect("/admin/products?type=one-off");
}

export default async function EditOneOffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const piece = await client.fetch(`*[_type == "oneOff" && _id == $id][0]`, {
    id,
  });

  if (!piece) notFound();

  const inputClasses =
    "w-full p-4 border border-neutral-200 bg-white text-sm focus:border-black outline-none transition-all";
  const labelClasses =
    "text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-2";

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-fadeIn">
      <Link
        href="/admin/products?type=one-off"
        className="flex items-center gap-2 text-neutral-400 hover:text-black mb-10 group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Back to Registry
        </span>
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-light uppercase tracking-tighter">
          Edit <span className="font-black">Archival Piece</span>
        </h1>
        <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] mt-2">
          Update details for {piece.name}
        </p>
      </div>

      <form
        action={updateOneOff}
        className="space-y-8 bg-white p-6 md:p-10 border border-neutral-100"
      >
        <input type="hidden" name="id" value={piece._id} />

        <div className="space-y-6 pb-8 border-b border-neutral-100">
          <div>
            <label className={labelClasses}>Current Image</label>
            <div className="relative h-48 w-32 bg-neutral-50 border border-neutral-200 overflow-hidden mb-4">
              {piece.image && (
                <Image
                  src={urlFor(piece.image).url()}
                  alt={piece.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Upload New Image</label>
            <input
              name="imageFile"
              type="file"
              accept="image/*"
              className="w-full text-sm text-neutral-500 file:mr-4 file:py-3 file:px-6 file:border file:border-black file:text-[10px] file:font-black file:bg-white hover:file:bg-black hover:file:text-white transition-colors cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className={labelClasses}>Piece Name</label>
            <input
              name="name"
              defaultValue={piece.name}
              className={inputClasses}
              required
            />
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Status</label>
            <select
              name="status"
              defaultValue={piece.status}
              className={`${inputClasses} appearance-none`}
            >
              <option value="available">Available</option>
              <option value="sold">Sold (Private Collection)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Edition / Archival Info</label>
          <input
            name="editionInfo"
            defaultValue={piece.editionInfo}
            className={inputClasses}
          />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>
            Description (one paragraph per line)
          </label>
          <textarea
            name="description"
            rows={6}
            defaultValue={piece.description?.join("\n")}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div className="pt-6">
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
