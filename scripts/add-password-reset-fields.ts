// scripts/add-password-reset-fields.ts
import { client } from "@/sanity/lib/client";

async function addPasswordResetFields() {
  console.log("🔍 Checking for users missing password reset fields...");

  try {
    // Fetch all users that need password reset fields
    const users = await client.fetch(
      `*[_type == "user"] {
        _id,
        email,
        name,
        "hasResetToken": defined(resetToken),
        "hasResetTokenExpiry": defined(resetTokenExpiry)
      }`,
    );

    console.log(`📊 Found ${users.length} total users`);

    const usersNeedingUpdate = users.filter(
      (u: any) => !u.hasResetToken || !u.hasResetTokenExpiry,
    );

    console.log(
      `🔄 ${usersNeedingUpdate.length} users need password reset fields`,
    );

    let updatedCount = 0;

    for (const user of usersNeedingUpdate) {
      const patches: any = {};

      if (!user.hasResetToken) {
        patches.resetToken = null;
      }

      if (!user.hasResetTokenExpiry) {
        patches.resetTokenExpiry = null;
      }

      if (Object.keys(patches).length > 0) {
        await client.patch(user._id).set(patches).commit();
        console.log(`✅ Updated ${user.email} with password reset fields`);
        updatedCount++;
      }
    }

    console.log(`\n🎉 Migration complete! Updated ${updatedCount} users`);
  } catch (error) {
    console.error("❌ Error migrating users:", error);
    process.exit(1);
  }
}

addPasswordResetFields();
