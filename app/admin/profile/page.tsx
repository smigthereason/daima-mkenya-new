// app/admin/profile/page.tsx
import { client } from "@/sanity/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import ProfileForm from "../components/profile/ProfileForm";

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const isAdmin = session?.user?.isAdmin || session?.user?.role === "admin";

  if (!isAdmin) {
    redirect("/unauthorized");
  }

  const user = await client.fetch(
    `*[_type == "user" && email == $email][0] {
      _id,
      name,
      email,
      image,
      role,
      addresses[] {
        id, type, recipientName, phoneNumber, addressLine1,
        addressLine2, city, state, postalCode, country, isDefault
      }
    }`,
    { email: session.user.email },
  );

  const userData = user || {
    _id: session.user.id,
    name: session.user.name || "",
    email: session.user.email,
    image: session.user.image || "",
    role: "admin",
    addresses: [],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 animate-fadeIn">
      {/* Header with ProductCard typography */}
      <div className="mb-12 border-b border-neutral-100 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tighter uppercase leading-[0.9]">
            Account <span className="font-black">Settings</span>
          </h1>
          <p className="text-[10px] md:text-[11px] text-neutral-400 uppercase tracking-widest font-medium mt-2">
            Manage your credentials and security
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-none border border-neutral-100 text-[9px] font-black uppercase tracking-widest text-neutral-500">
          <ShieldCheck size={12} className="text-[#238737]" />
          Authenticated Admin
        </div>
      </div>

      {/* Profile Content Area */}
      <div className="bg-white p-8 md:p-12 border border-neutral-100">
        <ProfileForm user={userData} />
      </div>
    </div>
  );
}
