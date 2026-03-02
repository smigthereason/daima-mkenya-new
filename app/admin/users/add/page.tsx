// app/admin/users/add/page.tsx
import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserPlus, ArrowLeft } from "lucide-react"; // 1. Import ArrowLeft
import Link from "next/link"; // 2. Import Link

async function addUserAction(formData: FormData) {
  "use server";

  await client.create({
    _type: "user",
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role") || "customer",
    emailVerified: formData.get("emailVerified")
      ? new Date().toISOString()
      : null,
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export default function AddUserPage() {
  const inputClasses =
    "w-full p-5 bg-neutral-50 border border-neutral-100 rounded-none text-sm tracking-widest focus:ring-1 focus:ring-black focus:bg-white outline-none transition-all";
  const labelClasses =
    "text-[11px] font-black text-neutral-900 uppercase tracking-[0.3em] mb-2 block";

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-0 animate-fadeIn">
      {/* ── HEADER ── */}
      <div className="mb-12 border-b border-neutral-100 pb-10">
        {/* 3. Add Back Link */}
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-[10px] font-black text-neutral-500 hover:text-black uppercase tracking-widest mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Database
        </Link>

        <h1 className="text-4xl md:text-5xl font-light tracking-tighter uppercase leading-[0.9]">
          New <span className="font-black">Customer</span>
        </h1>
        <p className="text-[10px] md:text-[11px] text-neutral-400 uppercase tracking-widest font-medium mt-2">
          Create a new customer account manually
        </p>
      </div>

      <form
        action={addUserAction}
        className="bg-white p-8 md:p-12 border border-neutral-100 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <label className={labelClasses}>Full Name</label>
            <input
              name="name"
              required
              className={inputClasses}
              placeholder="John Doe"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClasses}>Email Address</label>
            <input
              name="email"
              type="email"
              required
              className={inputClasses}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className={labelClasses}>Role</label>
            <select name="role" className={inputClasses}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div>
            <label className={labelClasses}>Status</label>
            <div className="flex items-center gap-3 h-[58px] bg-neutral-50 border border-neutral-100 px-5">
              <input
                name="emailVerified"
                type="checkbox"
                className="w-5 h-5 rounded-none border-neutral-200 text-[#be1e2d] focus:ring-black"
              />
              <span className="text-xs font-bold text-neutral-900 uppercase tracking-widest">
                Mark as Verified
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 bg-black text-white py-6 text-[12px] font-black uppercase tracking-[0.4em] transition-all hover:bg-[#be1e2d]"
        >
          <UserPlus size={16} />
          Create Customer
        </button>
      </form>
    </div>
  );
}
