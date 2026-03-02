// scripts/set-admin.ts
import { client } from "@/sanity/lib/client";

async function setAdminUser() {
  const adminEmail = "prodbysmig@gmail.com";

  try {
    // Check if user exists
    const existingUser = await client.fetch(
      `*[_type == "user" && email == $email][0] {
        _id,
        name,
        email,
        role
      }`,
      { email: adminEmail },
    );

    if (existingUser) {
      // Update existing user to admin
      await client.patch(existingUser._id).set({ role: "admin" }).commit();

      console.log(`✅ Updated ${adminEmail} to admin role`);
      console.log("User details:", existingUser);
    } else {
      // Create new admin user
      const newUser = await client.create({
        _type: "user",
        name: "Admin User",
        email: adminEmail,
        role: "admin",
        emailVerified: new Date().toISOString(),
      });

      console.log(`✅ Created admin user for ${adminEmail}`);
      console.log("New user ID:", newUser._id);
    }
  } catch (error) {
    console.error("Error setting admin user:", error);
  }
}

setAdminUser();
