// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      const isAdmin = session.user?.isAdmin || session.user?.role === "admin";
      console.log(
        "Auth callback - User:",
        session.user.email,
        "Is admin:",
        isAdmin,
      );

      if (isAdmin) {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } else {
      router.replace("/login");
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8e8e8]">
      <div className="w-10 h-10 border-2 border-[#006241] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
