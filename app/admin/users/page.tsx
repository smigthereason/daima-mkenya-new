// app/admin/users/page.tsx
import { serverClient } from "@/sanity/lib/server-client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { deleteUser, updateUserRole } from "./action";
import UserGrid from "./UserGrid";

// Force dynamic rendering to always get fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Server Component - fetches data directly
export default async function UsersPage() {
  // Use serverClient (useCdn: false) so newly added/updated customers show
  // up immediately instead of waiting on Sanity's CDN cache.
  const users = await serverClient.fetch(
    `*[_type == "user"] | order(_createdAt desc) {
      _id,
      name,
      email,
      image,
      role,
      _createdAt,
      addresses[] {
        city,
        country
      }
    }`,
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12 animate-fadeIn">
      {/* ── HEADER ── */}
      <div className="border-b border-neutral-100 pb-8 md:pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter uppercase leading-[0.9]">
            Customer <span className="font-black">Database</span>
          </h1>
          <p className="text-[10px] md:text-[11px] text-neutral-400 uppercase tracking-widest font-medium mt-2">
            Manage customers and permissions
          </p>
        </div>
        <Link
          href="/admin/users/add"
          className="group inline-flex w-full md:w-auto items-center justify-center gap-3 py-3 md:py-4 px-6 md:px-8 border border-black bg-black text-white hover:bg-white hover:text-black transition-all rounded-none"
        >
          <Plus size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Add Customer
          </span>
        </Link>
      </div>

      <UserGrid
        users={users}
        deleteUser={deleteUser}
        updateUserRole={updateUserRole}
      />
    </div>
  );
}
