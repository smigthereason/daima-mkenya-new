// app/admin/users/actions.ts
"use server"; // Indicates this file contains only server functions

import { serverClient } from "@/sanity/lib/server-client";
import { revalidatePath } from "next/cache";

export async function deleteUser(formData: FormData) {
  const id = formData.get("id") as string;
  await serverClient.delete(id);
  revalidatePath("/admin/users");
}

export async function updateUserRole(formData: FormData) {
  const id = formData.get("id") as string;
  const role = formData.get("role") as string;
  await serverClient.patch(id).set({ role }).commit();
  revalidatePath("/admin/users");
}
