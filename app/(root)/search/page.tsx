import SearchPage from "@/components/SearchPage";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Search | Daima Mkenya Africa",
  description: "Search our collection of heartbeat pieces worn proudly.",
};

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPage />
    </Suspense>
  );
}