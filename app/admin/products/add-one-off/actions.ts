"use server";

import { serverClient } from "@/sanity/lib/server-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addOneOffAction(formData: FormData) {
  const name = formData.get("name") as string;
  const imageFile = formData.get("image") as File;
  let imageAsset;

  if (imageFile && imageFile.size > 0) {
    imageAsset = await serverClient.assets.upload("image", imageFile);
  }

  const descRaw = formData.get("description") as string;
  const descriptionArray = descRaw.split("\n").filter((l) => l.trim() !== "");

  await serverClient.create({
    _type: "oneOff",
    name,
    editionInfo: formData.get("editionInfo") || "Edition 1/1",
    status: "available",
    description: descriptionArray,
    image: imageAsset
      ? { _type: "image", asset: { _type: "reference", _ref: imageAsset._id } }
      : undefined,
  });

  revalidatePath("/admin/products");
  redirect("/admin/products?type=one-off&status=created");
}
