import AfricaDottedMap from "@/components/landing-page/AfricaDottedMap";
import Hero from "@/components/landing-page/Hero";
import NewArrivals from "@/components/landing-page/NewArrivals";
import SdgCommitment from "@/components/landing-page/SDGCommitment";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <NewArrivals />

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
