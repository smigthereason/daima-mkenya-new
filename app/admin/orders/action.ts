// app/admin/orders/actions.ts
"use server";

import { serverClient } from "@/sanity/lib/server-client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  if (!id || !status) return { error: "ID and Status required" };

  try {
    const result = await serverClient
      .patch(id)
      .set({ status })
      .commit({ visibility: "async" });

    revalidatePath("/admin/orders");

    return {
      success: true,
      verifiedStatus: result.status,
    };
  } catch (error) {
    console.error("Action error:", error);
    return { error: "Failed to update" };
  }
}
