// // app/admin/users/page.tsx
// "use client";

// import { client } from "@/sanity/lib/client";
// import { Mail, Trash2, Plus } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// // 1. Import the actions
// import { deleteUser, updateUserRole } from "./action";

// export default function UsersPage() {
//   const [users, setUsers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

//   useEffect(() => {
//     async function fetchData() {
//       const data = await client.fetch(
//         `*[_type == "user"] | order(_createdAt desc) {
//           _id,
//           name,
//           email,
//           image,
//           role,
//           _createdAt,
//           addresses[] {
//             city,
//             country
//           }
//         }`,
//       );
//       setUsers(data);
//       setLoading(false);
//     }
//     fetchData();
//   }, []);

//   const handleImageError = (userId: string) => {
//     setImageErrors((prev) => ({ ...prev, [userId]: true }));
//   };

//   if (loading) {
//     return <div className="text-center p-10">Loading customers...</div>;
//   }

//   return (
//     // Responsive padding: px-4 (mobile), px-6 (tablet), px-8 (desktop)
//     <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12 animate-fadeIn">
//       {/* ── HEADER ── */}
//       <div className="border-b border-neutral-100 pb-8 md:pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
//         <div>
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter uppercase leading-[0.9]">
//             Customer <span className="font-black">Database</span>
//           </h1>
//           <p className="text-[10px] md:text-[11px] text-neutral-400 uppercase tracking-widest font-medium mt-2">
//             Manage customers and permissions
//           </p>
//         </div>
//         <Link
//           href="/admin/users/add"
//           className="group inline-flex w-full md:w-auto items-center justify-center gap-3 py-3 md:py-4 px-6 md:px-8 border border-black bg-black text-white hover:bg-white hover:text-black transition-all rounded-none"
//         >
//           <Plus size={16} />
//           <span className="text-[10px] font-black uppercase tracking-[0.2em]">
//             Add Customer
//           </span>
//         </Link>
//       </div>

//       {/* ── USERS GRID ── */}
//       {/* RESPONSIVE GRID ADJUSTMENT:
//         - grid-cols-1: Mobile (< 640px)
//         - sm:grid-cols-2: Small Tablets (640px+)
//         - lg:grid-cols-2: iPad Pro Landscape (1024px+) - Reduced from 3 to 2 for better spacing
//         - xl:grid-cols-3: Desktops (1280px+)
//         - 2xl:grid-cols-4: Large Screens (1536px+)
//       */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
//         {users.map((u: any) => (
//           <div
//             key={u._id}
//             // Reduced padding on small screens to fit content
//             className="bg-white p-5 sm:p-6 md:p-8 border border-neutral-100 rounded-none group hover:border-neutral-200 transition-all flex flex-col justify-between"
//           >
//             <div>
//               <div className="flex items-start justify-between mb-4 md:mb-6">
//                 <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
//                   {/* Image Implementation */}
//                   <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-lg md:text-xl overflow-hidden relative border border-neutral-100">
//                     {u.image && !imageErrors[u._id] ? (
//                       <Image
//                         src={u.image}
//                         alt={u.name || "User"}
//                         fill
//                         className="object-cover"
//                         sizes="56px"
//                         unoptimized
//                         onError={() => handleImageError(u._id)}
//                       />
//                     ) : (
//                       <span>{u.name?.[0] || "U"}</span>
//                     )}
//                   </div>
//                   <div className="overflow-hidden">
//                     <h3 className="font-black text-sm text-neutral-900 tracking-tight truncate">
//                       {u.name || "Unnamed User"}
//                     </h3>
//                     <p className="text-[10px] text-neutral-500 flex items-center gap-1.5 uppercase tracking-wider font-bold truncate">
//                       <Mail size={12} className="text-[#be1e2d] shrink-0" />{" "}
//                       {u.email}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4 pt-4 border-t border-neutral-100">
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-[9px] uppercase font-black text-neutral-400 tracking-widest">
//                   <span>Role</span>
//                   <form
//                     action={updateUserRole}
//                     className="flex items-center gap-2"
//                   >
//                     <input type="hidden" name="id" value={u._id} />
//                     <select
//                       name="role"
//                       defaultValue={u.role || "customer"}
//                       className="text-[10px] font-black bg-neutral-50 border border-neutral-100 p-2 rounded-none focus:ring-1 focus:ring-black outline-none uppercase tracking-widest w-full sm:w-auto"
//                     >
//                       <option value="customer">Customer</option>
//                       <option value="admin">Admin</option>
//                       <option value="manager">Manager</option>
//                     </select>
//                     <button
//                       type="submit"
//                       className="text-[8px] font-black bg-neutral-900 text-white px-3 py-2 rounded-none hover:bg-neutral-700 transition-colors uppercase tracking-widest shrink-0"
//                     >
//                       Update
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-between mt-6 md:mt-8 pt-4 border-t border-neutral-100">
//               <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
//                 {new Date(u._createdAt).toLocaleDateString("en-KE", {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </span>
//               <form
//                 action={deleteUser}
//                 className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <input type="hidden" name="id" value={u._id} />
//                 <button className="flex items-center gap-2 text-[9px] font-black text-[#be1e2d] hover:text-red-700 uppercase tracking-widest">
//                   <Trash2 size={12} /> Delete
//                 </button>
//               </form>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// app/admin/users/page.tsx
import { client } from "@/sanity/lib/client";
import { Mail, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { deleteUser, updateUserRole } from "./action";
import UserAvatar from "./UseAvatar";

// Force dynamic rendering to always get fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Server Component - fetches data directly
export default async function UsersPage() {
  // Fetch data on the server with proper authentication
  const users = await client.fetch(
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
    {},
    {
      // Ensure we get fresh data
      cache: "no-store",
      next: { tags: ["users"] },
    },
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

      {/* ── USERS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
        {users.map((user: any) => (
          <div
            key={user._id}
            className="bg-white p-5 sm:p-6 md:p-8 border border-neutral-100 rounded-none group hover:border-neutral-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                  {/* User Avatar - Using Client Component */}
                  <UserAvatar
                    image={user.image}
                    name={user.name}
                    email={user.email}
                  />

                  <div className="overflow-hidden">
                    <h3 className="font-black text-sm text-neutral-900 tracking-tight truncate">
                      {user.name || "Unnamed User"}
                    </h3>
                    <p className="text-[10px] text-neutral-500 flex items-center gap-1.5 uppercase tracking-wider font-bold truncate">
                      <Mail size={12} className="text-[#be1e2d] shrink-0" />{" "}
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-[9px] uppercase font-black text-neutral-400 tracking-widest">
                  <span>Role</span>
                  <form
                    action={updateUserRole}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="id" value={user._id} />
                    <select
                      name="role"
                      defaultValue={user.role || "customer"}
                      className="text-[10px] font-black bg-neutral-50 border border-neutral-100 p-2 rounded-none focus:ring-1 focus:ring-black outline-none uppercase tracking-widest w-full sm:w-auto"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                    </select>
                    <button
                      type="submit"
                      className="text-[8px] font-black bg-neutral-900 text-white px-3 py-2 rounded-none hover:bg-neutral-700 transition-colors uppercase tracking-widest shrink-0"
                    >
                      Update
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 md:mt-8 pt-4 border-t border-neutral-100">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                {new Date(user._createdAt).toLocaleDateString("en-KE", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <form
                action={deleteUser}
                className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <input type="hidden" name="id" value={user._id} />
                <button className="flex items-center gap-2 text-[9px] font-black text-[#be1e2d] hover:text-red-700 uppercase tracking-widest">
                  <Trash2 size={12} /> Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Show count */}
      <div className="text-center text-[10px] text-neutral-400 uppercase tracking-widest font-black pt-8 border-t border-neutral-100">
        Total Users: {users.length}
      </div>
    </div>
  );
}
