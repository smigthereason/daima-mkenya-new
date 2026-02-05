import AfricaDottedMap from "@/components/landing-page/AfricaDottedMap";
import Hero from "@/components/landing-page/Hero";
import NewArrivals from "@/components/landing-page/NewArrivals";
import SdgCommitment from "@/components/landing-page/SDGCommitment";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <NewArrivals />

  
          <AfricaDottedMap />
      
    

      
        <SdgCommitment />
      
    </main>
  );
}
