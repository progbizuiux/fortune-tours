import { HeroSection } from "@/components/home/HeroSection";
import { TravelStylesSection } from "@/components/home/TravelStylesSection";
import { GlobeSection } from "@/components/home/GlobeSection";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { CredentialsSection } from "@/components/home/CredentialsSection";
import { DeparturesSection } from "@/components/home/DeparturesSection";
import { JournalSection } from "@/components/home/JournalSection";
import { PolaroidGallery } from "@/components/home/PolaroidGallery";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";

export default function Home() {
  return (
    <>
      {/* Pin scope for the sticky hero: sticky positioning is bounded by the
          parent box, so the hero stays pinned only while this wrapper is on
          screen. When the destinations section's end scrolls up past the
          viewport bottom, it pushes the hero away with it instead of leaving
          it pinned for the rest of the page. */}
      <div>
        <HeroSection />
        <DestinationsSection />
      </div>
      <CredentialsSection />
      <TravelStylesSection />
      <FeaturedDestinations />
      <DeparturesSection />
      <JournalSection />
      {/* <GlobeSection /> */}
      <PolaroidGallery />
    </>
  );
}
