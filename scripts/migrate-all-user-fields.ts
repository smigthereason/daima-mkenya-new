// scripts/migrate-all-user-fields.ts
import { config } from "dotenv";
import { createClient, SanityClient } from "@sanity/client";
import path from "path";

// Load environment variables from .env.local file
config({ path: path.resolve(process.cwd(), ".env.local") });

// Debug: Check if env vars are loaded
console.log("🔍 Checking environment variables from .env.local...");
console.log(
  `NEXT_PUBLIC_SANITY_PROJECT_ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? "✅ Found" : "❌ Missing"}`,
);
console.log(
  `NEXT_PUBLIC_SANITY_DATASET: ${process.env.NEXT_PUBLIC_SANITY_DATASET ? "✅ Found" : "❌ Missing"}`,
);
console.log(
  `SANITY_API_TOKEN: ${process.env.SANITY_API_TOKEN ? "✅ Found" : "❌ Missing"}`,
);
console.log("==========================================\n");

// Validate that required environment variables are present
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error(
    "❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local",
  );
  console.error("   Please make sure your .env.local file contains:");
  console.error("   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id");
  console.error("   SANITY_API_TOKEN=your_api_token");
  process.exit(1);
}

if (!process.env.SANITY_API_TOKEN) {
  console.error(
    "❌ Error: SANITY_API_TOKEN is not set in .env.local. You need a token with write permissions.",
  );
  console.error("   Get a token at: https://sanity.io/manage");
  process.exit(1);
}

// Initialize Sanity client with environment variables
const client: SanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-02",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Define interfaces for user data
interface User {
  _id: string;
  email: string;
  name?: string;
  role?: string;
  password?: string;
  hasResetToken: boolean;
  hasResetTokenExpiry: boolean;
  hasEmailVerified: boolean;
}

interface PatchSet {
  [key: string]: any;
}

interface MigrationResults {
  total: number;
  roleUpdated: number;
  resetFieldsUpdated: number;
  emailVerifiedUpdated: number;
  unchanged: number;
}

interface SanityError extends Error {
  statusCode?: number;
  statusMessage?: string;
  details?: any;
}

const ADMIN_EMAILS: string[] = ["prodbysmig@gmail.com"];

async function migrateAllUserFields(): Promise<void> {
  console.log("🚀 Starting comprehensive user migration...");
  console.log("==========================================");
  console.log(`📁 Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(
    `📁 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}`,
  );
  console.log("==========================================\n");

  try {
    // Test the connection
    console.log("🔍 Testing Sanity connection...");
    const testCount = await client.fetch(`count(*[_type == "user"])`);
    console.log(`✅ Connection successful! Found ${testCount} users total\n`);

    // Fetch all users with their current fields
    console.log("🔍 Fetching users from Sanity...");

    const users: User[] = await client.fetch(
      `*[_type == "user"] {
        _id,
        email,
        name,
        role,
        password,
        "hasResetToken": defined(resetToken),
        "hasResetTokenExpiry": defined(resetTokenExpiry),
        "hasEmailVerified": defined(emailVerified)
      }`,
    );

    console.log(`📊 Found ${users.length} users that need checking\n`);

    if (users.length === 0) {
      console.log("⚠️ No users found to migrate.");
      return;
    }

    const results: MigrationResults = {
      total: users.length,
      roleUpdated: 0,
      resetFieldsUpdated: 0,
      emailVerifiedUpdated: 0,
      unchanged: 0,
    };

    for (const user of users) {
      const patches: PatchSet = {};
      let needsUpdate = false;

      console.log(`\n👤 Processing: ${user.email}`);

      // 1. Add role if missing
      if (!user.role) {
        patches.role = ADMIN_EMAILS.includes(user.email) ? "admin" : "customer";
        needsUpdate = true;
        results.roleUpdated++;
        console.log(`   📝 Adding role: "${patches.role}"`);
      }

      // 2. Add password reset fields if missing
      if (!user.hasResetToken) {
        patches.resetToken = null;
        needsUpdate = true;
        results.resetFieldsUpdated++;
        console.log(`   📝 Adding resetToken: null`);
      }

      if (!user.hasResetTokenExpiry) {
        patches.resetTokenExpiry = null;
        needsUpdate = true;
        results.resetFieldsUpdated++;
        console.log(`   📝 Adding resetTokenExpiry: null`);
      }

      // 3. Add emailVerified if missing (for older users)
      if (!user.hasEmailVerified) {
        patches.emailVerified = new Date().toISOString();
        needsUpdate = true;
        results.emailVerifiedUpdated++;
        console.log(`   📝 Adding emailVerified: ${patches.emailVerified}`);
      }

      // Apply patches if needed
      if (needsUpdate) {
        await client.patch(user._id).set(patches).commit();
        console.log(`   ✅ Successfully updated ${user.email}`);
      } else {
        results.unchanged++;
        console.log(`   ⏭️ No changes needed`);
      }
    }

    console.log("\n==========================================");
    console.log("🎉 Migration Complete!");
    console.log("==========================================");
    console.log(`📊 Summary:`);
    console.log(`   Total users processed: ${results.total}`);
    console.log(`   Role updates: ${results.roleUpdated}`);
    console.log(
      `   Password reset fields added: ${results.resetFieldsUpdated}`,
    );
    console.log(`   Email verified updates: ${results.emailVerifiedUpdated}`);
    console.log(`   Unchanged users: ${results.unchanged}`);
    console.log("==========================================");
  } catch (error: unknown) {
    const sanityError = error as SanityError;
    console.error("\n❌ Error during migration:", sanityError.message);

    // Provide more helpful error messages
    if (sanityError.statusCode === 401) {
      console.error(
        "\n🔐 Authentication Error: Your SANITY_API_TOKEN might be invalid or missing write permissions.",
      );
      console.error("   Get a token at: https://sanity.io/manage");
    } else if (sanityError.statusCode === 403) {
      console.error(
        "\n🔐 Authorization Error: Your token doesn't have write permissions.",
      );
      console.error(
        "   Create a token with 'write' access at: https://sanity.io/manage",
      );
    } else if (sanityError.statusCode === 404) {
      console.error(
        "\n🔍 Not Found Error: Check your project ID and dataset name.",
      );
      console.error(
        `   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`,
      );
      console.error(
        `   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}`,
      );
    }

    process.exit(1);
  }
}

// Run the migration
migrateAllUserFields();
