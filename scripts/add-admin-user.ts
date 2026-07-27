// scripts/add-admin-user.ts
//
// Creates (or promotes) an admin account in Sanity with a real, working
// password - not just a "role: admin" flag with no password, which would
// leave the account unable to log in via the credentials form.
//
// Run locally (needs SANITY_API_TOKEN with write access, loaded from
// .env.local, same as the other scripts in this folder):
//
//   npm run add:admin-user
//   (or directly: npx tsx scripts/add-admin-user.ts)
//
import { config } from "dotenv";
import { createClient } from "@sanity/client";
import path from "path";
import bcrypt from "bcryptjs";

config({ path: path.resolve(process.cwd(), ".env.local") });

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error("❌ NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local");
  process.exit(1);
}
if (!process.env.SANITY_API_TOKEN) {
  console.error("❌ SANITY_API_TOKEN is not set in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// ── Account to create ──────────────────────────────────────────────────
// Email is always stored lowercase (see lib/utils/normalizeEmail.ts) so it
// matches regardless of how it's typed at login.
const ADMIN_EMAIL = "info@daimamkenyaafrica.com";
const ADMIN_NAME = "Daima Mkenya Africa";
// Temporary password - change this after first login (Profile > Change
// Password, or via "Forgot password" on the sign-in page).
const TEMP_PASSWORD = "Daima@21";
// ─────────────────────────────────────────────────────────────────────

async function addAdminUser() {
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const hashedPassword = await bcrypt.hash(TEMP_PASSWORD, 10);

  const existingUser = await client.fetch(
    `*[_type == "user" && lower(email) == $email][0]{ _id, name, email }`,
    { email },
  );

  if (existingUser) {
    await client
      .patch(existingUser._id)
      .set({
        email,
        password: hashedPassword,
        role: "admin",
        isAdmin: true,
      })
      .commit();

    console.log(`✅ Updated existing user ${email} to admin with a new password`);
  } else {
    const newUser = await client.create({
      _type: "user",
      name: ADMIN_NAME,
      email,
      password: hashedPassword,
      role: "admin",
      isAdmin: true,
      emailVerified: new Date().toISOString(),
    });

    console.log(`✅ Created admin user ${email}`);
    console.log("   Sanity document ID:", newUser._id);
  }

  console.log("\n🔑 Login with:");
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${TEMP_PASSWORD}`);
  console.log("\n   Please change this password after first login.");
}

addAdminUser().catch((err) => {
  console.error("❌ Failed to add admin user:", err);
  process.exit(1);
});
