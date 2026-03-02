// app/admin/users/actions.ts
"use server"; // Indicates this file contains only server functions

import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export async function deleteUser(formData: FormData) {
  const id = formData.get("id") as string;
  await client.delete(id);
  revalidatePath("/admin/users");
}

export async function updateUserRole(formData: FormData) {
  const id = formData.get("id") as string;
  const role = formData.get("role") as string;
  await client.patch(id).set({ role }).commit();
  revalidatePath("/admin/users");
}
