// scripts/sync-admin-role.ts
import { client } from "@/sanity/lib/client";

const ADMIN_EMAILS = ["prodbysmig@gmail.com"];

async function syncAdminRoles() {
  for (const email of ADMIN_EMAILS) {
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email },
    );

    if (user) {
      await client.patch(user._id).set({ role: "admin" }).commit();
      console.log(`Updated ${email} to admin role`);
    } else {
      // Create admin user if doesn't exist
      await client.create({
        _type: "user",
        name: email.split("@")[0],
        email: email,
        role: "admin",
        emailVerified: new Date().toISOString(),
      });
      console.log(`Created admin user for ${email}`);
    }
  }
}

syncAdminRoles().catch(console.error);
