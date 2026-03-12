"use server";

import { createClient } from "@sanity/client";
import { revalidatePath } from "next/cache";

const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-03-10",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

export async function upsertBatch(formData: {
  _id?: string;
  batchName: string;
  products: string[];
  triggerEmail: boolean;
}) {
  // Logic: At least 3 products required for a valid batch blast
  if (formData.products.length < 3) {
    throw new Error("A batch must contain at least 3 products.");
  }

  const docData = {
    batchName: formData.batchName,
    products: formData.products.map((id) => ({
      _type: "reference",
      _ref: id,
      _key: Math.random().toString(36).substring(7),
    })),
    triggerEmail: formData.triggerEmail,
  };

  try {
    if (formData._id) {
      await serverClient.patch(formData._id).set(docData).commit();
    } else {
      await serverClient.create({
        _type: "productBatch",
        ...docData,
        emailSent: false,
      });
    }

    revalidatePath("/admin/announcement-batches");
    return { success: true };
  } catch (error) {
    console.error("Sanity Upsert Error:", error);
    throw new Error("Failed to save batch configuration.");
  }
}

export async function deleteBatch(id: string) {
  try {
    await serverClient.delete(id);
    revalidatePath("/admin/announcement-batches");
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete batch.");
  }
}

export async function triggerEmailBlast(id: string) {
  try {
    await serverClient.patch(id).set({ triggerEmail: true }).commit();
    revalidatePath("/admin/announcement-batches");
    return { success: true };
  } catch (error) {
    throw new Error("Failed to trigger email blast.");
  }
}

export async function resendEmailBlast(id: string) {
  try {
    await serverClient.patch(id).set({ triggerEmail: true }).commit();
    revalidatePath("/admin/announcement-batches");
    return { success: true, message: "Email blast triggered successfully!" };
  } catch (error) {
    console.error("Sanity Resend Error:", error);
    throw new Error("Failed to resend email blast.");
  }
}
