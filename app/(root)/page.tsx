// // app/(root)/page.tsx

// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import AfricaDottedMap from "@/components/landing-page/AfricaDottedMap";
// import Hero from "@/components/landing-page/Hero";
// import NewArrivals from "@/components/landing-page/NewArrivals";
// import SdgCommitment from "@/components/landing-page/SDGCommitment";
// import OneOffArchive from "@/components/landing-page/OneOffArchive";

// export default function Home() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "loading") return;

//     // Redirect admins away from the landing page
//     if (session?.user?.isAdmin || session?.user?.role === "admin") {
//       router.replace("/admin");
//     }
//   }, [session, status, router]);

//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#e8e8e8]">
//         <div className="w-10 h-10 border-2 border-[#006241] border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   // Prevent admin users from seeing the landing page content briefly before redirect
//   if (session?.user?.isAdmin || session?.user?.role === "admin") {
//     return null;
//   }

//   return (
//     <main className="relative">
//       <Hero />
//       <NewArrivals />
//       <AfricaDottedMap />

//       <OneOffArchive />
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
import OneOffArchive from "@/components/landing-page/OneOffArchive";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Silently redirect admins in the background
    if (
      status !== "loading" &&
      (session?.user?.isAdmin || session?.user?.role === "admin")
    ) {
      router.replace("/admin");
    }
  }, [session, status, router]);

  // We render the landing page content immediately.
  // If the user is an admin, the useEffect above will trigger the redirect.
  // This removes the "Loading Spinner" penalty from Lighthouse.
  return (
    <main className="relative">
      <Hero />
      <NewArrivals />
      <AfricaDottedMap />
      <OneOffArchive />
      <SdgCommitment />
    </main>
  );
}
