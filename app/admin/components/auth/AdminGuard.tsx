// // components/admin/AdminGuard.tsx
// "use client";

// import { useSession } from "next-auth/react";
// import { redirect } from "next/navigation";
// import { ReactNode, useEffect } from "react";

// export default function AdminGuard({ children }: { children: ReactNode }) {
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     console.log("AdminGuard - Session status:", status);
//     console.log("AdminGuard - Session data:", session);

//     if (status === "loading") return;

//     if (!session) {
//       console.log("AdminGuard - No session, redirecting to login");
//       redirect("/login");
//     }

//     // Check if user is admin
//     const isAdmin =
//       session?.user?.isAdmin === true || session?.user?.role === "admin";
//     console.log("AdminGuard - Is admin:", isAdmin);
//     console.log("AdminGuard - User role:", session?.user?.role);
//     console.log("AdminGuard - User isAdmin:", session?.user?.isAdmin);

//     if (!isAdmin) {
//       console.log("AdminGuard - Not admin, redirecting to unauthorized");
//       redirect("/unauthorized");
//     }
//   }, [session, status]);

//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="w-10 h-10 border-[1px] border-[#006241] border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return <>{children}</>;
// }
// app/admin/components/auth/AdminGuard.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    console.log("AdminGuard - Status:", status);
    console.log("AdminGuard - Session:", session);
    console.log("AdminGuard - Pathname:", pathname);

    if (status === "loading") {
      return; // Wait for session to load
    }

    if (status === "unauthenticated") {
      console.log("AdminGuard - Unauthenticated, redirecting to login");
      // Store the attempted URL to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", pathname);
      router.replace("/login");
      return;
    }

    if (status === "authenticated") {
      const isAdmin =
        session?.user?.isAdmin ||
        session?.user?.role === "admin" ||
        session?.user?.email === "prodbysmig@gmail.com";

      console.log("AdminGuard - Authenticated, isAdmin:", isAdmin);

      if (!isAdmin) {
        console.log("AdminGuard - Not admin, redirecting to home");
        router.replace("/");
        return;
      }

      console.log("AdminGuard - Authorized admin, rendering children");
      setIsAuthorized(true);
    }
  }, [session, status, router, pathname]);

  // Show loading state while checking
  if (status === "loading" || (status === "authenticated" && !isAuthorized)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8e8e8]">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
