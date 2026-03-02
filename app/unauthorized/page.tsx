// app/unauthorized/page.tsx
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md px-4">
        <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield size={32} className="text-[#be1e2d]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1d1d1d] mb-3">
          Access Denied
        </h1>
        <p className="text-[#989898] text-sm mb-8">
          You don't have permission to access this page. This area is restricted
          to administrators only.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#006241] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#006241]/90 transition-colors"
        >
          <ArrowLeft size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
}
