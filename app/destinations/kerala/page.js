import { HeroSection } from "@/components/destinations/kerala/HeroSection";
import { IntroSection } from "@/components/destinations/kerala/IntroSection";
import { JourneysSection } from "@/components/destinations/kerala/JourneysSection";
import { MustVisitSection } from "@/components/destinations/kerala/MustVisitSection";

import { HighlightsSection } from "@/components/destinations/kerala/HighlightsSection";

import { WhyTravelSection } from "@/components/destinations/kerala/WhyTravelSection";
import { SeasonsSection } from "@/components/destinations/kerala/SeasonsSection";
import { FixedPackagesSection } from "@/components/destinations/kerala/FixedPackagesSection";

export const metadata = {
  title: "Kerala | Fortune Travels",
  description: "Explore Kerala Beyond the Guidebooks.",
};

export default function KeralaPage() {
  return (
    <>
      {/* Pin scope for the sticky hero: sticky positioning is bounded by the
          parent box, so the hero stays pinned only while this wrapper is on
          screen. When the intro section's end scrolls up past the viewport
          bottom, it pushes the hero away with it instead of leaving it pinned
          for the rest of the page. */}
      <div>
        <HeroSection />
        <IntroSection />
      </div>
      <JourneysSection />
      <MustVisitSection />
      <HighlightsSection />
      <WhyTravelSection />
      <SeasonsSection />
      <FixedPackagesSection />
    </>
  );
}
