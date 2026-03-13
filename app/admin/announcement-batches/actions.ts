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
  scheduledFor?: string;
}) {
  // Validation: Between 3-5 products required
  if (formData.products.length < 3 || formData.products.length > 5) {
    throw new Error("A batch must contain between 3 and 5 products.");
  }

  const docData = {
    batchName: formData.batchName,
    products: formData.products.map((id) => ({
      _type: "reference",
      _ref: id,
      _key: Math.random().toString(36).substring(7),
    })),
    triggerEmail: formData.triggerEmail,
    scheduledFor: formData.scheduledFor || null,
  };

  try {
    let result;
    if (formData._id) {
      // Get current batch to preserve emailSent status
      const currentBatch = await serverClient.fetch(
        `*[_type == "productBatch" && _id == $id][0]`,
        { id: formData._id },
      );

      // When updating, only reset emailSent if we're triggering a new email
      const updateData = {
        ...docData,
        // Only reset emailSent if we're triggering a new email
        emailSent: formData.triggerEmail
          ? false
          : currentBatch?.emailSent || false,
        sentAt: formData.triggerEmail ? null : currentBatch?.sentAt || null,
        recipientCount: currentBatch?.recipientCount || 0,
      };

      result = await serverClient.patch(formData._id).set(updateData).commit();
      console.log(`✅ Updated batch: ${formData._id}`);
    } else {
      result = await serverClient.create({
        _type: "productBatch",
        ...docData,
        emailSent: false,
        recipientCount: 0,
      });
      console.log(`✅ Created new batch: ${result._id}`);
    }

    revalidatePath("/admin/announcement-batches");
    return { success: true, id: result._id };
  } catch (error) {
    console.error("❌ Sanity Upsert Error:", error);
    throw new Error("Failed to save batch configuration.");
  }
}

export async function deleteBatch(id: string) {
  try {
    await serverClient.delete(id);
    console.log(`✅ Deleted batch: ${id}`);
    revalidatePath("/admin/announcement-batches");
    return { success: true };
  } catch (error) {
    console.error("❌ Delete Error:", error);
    throw new Error("Failed to delete batch.");
  }
}

export async function triggerEmailBlast(id: string) {
  try {
    // First, get the current batch to check if email already sent
    const batch = await serverClient.fetch(
      `*[_type == "productBatch" && _id == $id][0]`,
      { id },
    );

    if (batch?.emailSent) {
      throw new Error("Email already sent for this batch. Use resend instead.");
    }

    // Set triggerEmail to true and clear scheduledFor if it exists
    await serverClient
      .patch(id)
      .set({
        triggerEmail: true,
        scheduledFor: null, // Clear scheduled date for immediate send
        emailError: "", // Clear any previous errors
      })
      .commit();

    console.log(`🔔 Triggered email blast for batch: ${id}`);
    revalidatePath("/admin/announcement-batches");
    return { success: true, message: "Email blast triggered successfully!" };
  } catch (error) {
    console.error("❌ Trigger Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to trigger email blast.",
    );
  }
}

export async function resendEmailBlast(id: string) {
  try {
    // Get current batch
    const batch = await serverClient.fetch(
      `*[_type == "productBatch" && _id == $id][0]`,
      { id },
    );

    // Reset emailSent status and trigger new email
    await serverClient
      .patch(id)
      .set({
        emailSent: false, // Reset so webhook can send again
        triggerEmail: true, // Trigger the webhook
        scheduledFor: null, // Clear any scheduled date
        sentAt: null, // Clear previous sent date
        emailError: "", // Clear any previous errors
      })
      .commit();

    console.log(`🔄 Resend triggered for batch: ${id}`);
    revalidatePath("/admin/announcement-batches");
    return {
      success: true,
      message: "Email blast resend triggered successfully!",
    };
  } catch (error) {
    console.error("❌ Resend Error:", error);
    throw new Error("Failed to resend email blast.");
  }
}

export async function checkWebhookStatus() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/notify-customers`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Webhook status check failed:", error);
    return { error: "Could not check webhook status" };
  }
}
