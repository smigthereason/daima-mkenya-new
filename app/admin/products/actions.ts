// app/admin/products/actions.ts
"use server";

import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return { error: "Missing product ID" };

  try {
    await client.delete(id);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { error: "Failed to delete product" };
  }
}
