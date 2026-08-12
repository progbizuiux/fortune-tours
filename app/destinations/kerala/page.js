import { HeroSection } from "@/components/destinations/kerala/HeroSection";
import { IntroSection } from "@/components/destinations/kerala/IntroSection";
import { JourneysSection } from "@/components/destinations/kerala/JourneysSection";
import { MustVisitSection } from "@/components/destinations/kerala/MustVisitSection";

import { HighlightsSection } from "@/components/destinations/kerala/HighlightsSection";

import { PlanJourneySection } from "@/components/destinations/kerala/PlanJourneySection";

export const metadata = {
  title: "Kerala | Fortune Travels",
  description: "Explore Kerala Beyond the Guidebooks.",
};

export default function KeralaPage() {
  return (
    <>
      <div>
        <HeroSection />
      </div>
      <IntroSection />
      <JourneysSection />
      <MustVisitSection />
      <HighlightsSection />
      <PlanJourneySection />
    </>
  );
}
