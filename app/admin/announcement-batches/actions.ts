"use server";

import { createClient } from "@sanity/client";
import { revalidatePath } from "next/cache";

const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-03-10",
  token: process.env.SANITY_WRITE_TOKEN, // Securely accessed only on server
  useCdn: false,
});

/**
 * Handles both creating new batches and updating existing ones.
 * Ensures the 'triggerEmail' toggle is synced correctly.
 */
export async function upsertBatch(formData: {
  _id?: string;
  batchName: string;
  products: string[];
  triggerEmail: boolean;
}) {
  // Validate the business rule: exactly 5 products
  if (formData.products.length !== 5) {
    throw new Error("A batch must contain exactly 5 products.");
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
      // Patch existing: we only update specific fields to avoid
      // overwriting the 'emailSent' or 'sentAt' fields set by the webhook
      await serverClient.patch(formData._id).set(docData).commit();
    } else {
      // Create new: initialize internal tracking fields
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

/**
 * Removes a batch from Sanity
 */
export async function deleteBatch(id: string) {
  try {
    await serverClient.delete(id);
    revalidatePath("/admin/announcement-batches");
    return { success: true };
  } catch (error) {
    console.error("Sanity Delete Error:", error);
    throw new Error("Failed to delete batch.");
  }
}

/**
 * Quick trigger for the email blast from the list view
 */
export async function triggerEmailBlast(id: string) {
  try {
    await serverClient.patch(id).set({ triggerEmail: true }).commit();

    revalidatePath("/admin/announcement-batches");
    return { success: true };
  } catch (error) {
    console.error("Sanity Trigger Error:", error);
    throw new Error("Failed to trigger email blast.");
  }
}
