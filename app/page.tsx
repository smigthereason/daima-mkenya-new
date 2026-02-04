// app/page.tsx
"use client";

import AfricaDottedMap from "@/components/landing-page/AfricaDottedMap";
import Hero from "@/components/landing-page/Hero";
import NewArrivals from "@/components/landing-page/NewArrivals";
import SdgCommitment from "@/components/landing-page/SDGCommitment";

export default function Home() {
  return (
    <main className="relative">
      {/* Hero Section - Will fade backward */}
      <section 
        className="hero-section-wrapper relative"
        style={{ minHeight: "100vh" }}
      >
        <Hero />
      </section>

      {/* New Arrivals Section - Positioned behind hero initially */}
      <section 
        className="new-arrivals-wrapper relative"
        style={{ 
          minHeight: "100vh",
          marginTop: "-100vh", // This pulls it up behind the hero
          position: "relative",
          zIndex: 10, // Lower than hero initially
        }}
      >
        <NewArrivals />
      </section>

      {/* Africa Map Section */}
      <section className="africa-map-wrapper bg-transparent z-20">
        <div className="py-20">
          <AfricaDottedMap />
        </div>
      </section>

      {/* SDG Commitment Section */}
      <section className="sdg-section-wrapper z-30">
        <SdgCommitment />
      </section>
    </main>
  );
}