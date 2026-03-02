// scripts/add-role-to-users.ts
import { client } from "@/sanity/lib/client";

async function addRoleToExistingUsers() {
  try {
    // Fetch all users that don't have a role field
    const users = await client.fetch(
      `*[_type == "user" && !defined(role)] {
        _id,
        email,
        name
      }`,
    );

    console.log(`Found ${users.length} users without role`);

    for (const user of users) {
      // Check if this is the admin email
      const role = user.email === "prodbysmig@gmail.com" ? "admin" : "customer";

      await client.patch(user._id).set({ role }).commit();

      console.log(`✅ Updated ${user.email} with role: ${role}`);
    }

    console.log("Migration complete!");
  } catch (error) {
    console.error("Error migrating users:", error);
  }
}

addRoleToExistingUsers();
