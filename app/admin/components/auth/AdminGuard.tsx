// components/admin/AdminGuard.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("AdminGuard - Session status:", status);
    console.log("AdminGuard - Session data:", session);

    if (status === "loading") return;

    if (!session) {
      console.log("AdminGuard - No session, redirecting to login");
      redirect("/login");
    }

    // Check if user is admin
    const isAdmin =
      session?.user?.isAdmin === true || session?.user?.role === "admin";
    console.log("AdminGuard - Is admin:", isAdmin);
    console.log("AdminGuard - User role:", session?.user?.role);
    console.log("AdminGuard - User isAdmin:", session?.user?.isAdmin);

    if (!isAdmin) {
      console.log("AdminGuard - Not admin, redirecting to unauthorized");
      redirect("/unauthorized");
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-[1px] border-[#006241] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
