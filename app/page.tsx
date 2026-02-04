// app/page.tsx
"use client";

import AfricaDottedMap from "@/components/landing-page/AfricaDottedMap";
import Hero from "@/components/landing-page/Hero";
import NewArrivals from "@/components/landing-page/NewArrivals";
import SdgCommitment from "@/components/landing-page/SDGCommitment";

export default function Home() {
  return (
    <main className="relative">
      {/* Hero Section */}
      <section 
        className="scroll-section hero-section-wrapper relative"
        style={{ minHeight: "100vh" }}
      >
        <Hero />
      </section>

      {/* New Arrivals Section */}
      <section 
        className="scroll-section new-arrivals-wrapper relative z-20"
        style={{ minHeight: "100vh" }}
      >
        <NewArrivals />
      </section>

      {/* Africa Map Section */}
      <section className="scroll-section africa-map-wrapper bg-transparent z-10">
        <div className="py-20">
          <AfricaDottedMap />
        </div>
      </section>

      {/* SDG Commitment Section */}
      <section className="sdg-section-wrapper z-5">
        <SdgCommitment />
      </section>
    </main>
  );
}