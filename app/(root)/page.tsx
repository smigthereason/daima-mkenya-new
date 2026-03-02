// import AfricaDottedMap from "@/components/landing-page/AfricaDottedMap";
// import Hero from "@/components/landing-page/Hero";
// import NewArrivals from "@/components/landing-page/NewArrivals";
// import SdgCommitment from "@/components/landing-page/SDGCommitment";

// export default function Home() {
//   return (
//     <main className="relative">
//       <Hero />
//       <NewArrivals />

//       <AfricaDottedMap />

//       <SdgCommitment />
//     </main>
//   );
// }
// app/(root)/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AfricaDottedMap from "@/components/landing-page/AfricaDottedMap";
import Hero from "@/components/landing-page/Hero";
import NewArrivals from "@/components/landing-page/NewArrivals";
import SdgCommitment from "@/components/landing-page/SDGCommitment";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // If user is admin, redirect to admin panel
    if (session?.user?.isAdmin || session?.user?.role === "admin") {
      console.log("Admin detected on home page, redirecting...");
      router.replace("/admin");
    }
  }, [session, status, router]);

  // Don't render anything while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8e8e8]">
        <div className="w-10 h-10 border-2 border-[#006241] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Only render home page for non-admin users
  if (
    session?.user &&
    !(session.user.isAdmin || session.user.role === "admin")
  ) {
    return (
      <main className="relative">
        <Hero />
        <NewArrivals />
        <AfricaDottedMap />
        <SdgCommitment />
      </main>
    );
  }

  // If no session, show home page
  if (!session) {
    return (
      <main className="relative">
        <Hero />
        <NewArrivals />
        <AfricaDottedMap />
        <SdgCommitment />
      </main>
    );
  }

  return null;
}
