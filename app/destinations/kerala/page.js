import { notFound } from "next/navigation";

import { HeroSection } from "@/components/destinations/kerala/HeroSection";
import { IntroSection } from "@/components/destinations/kerala/IntroSection";
import { JourneysSection } from "@/components/destinations/kerala/JourneysSection";
import { MustVisitSection } from "@/components/destinations/kerala/MustVisitSection";

import { HighlightsSection } from "@/components/destinations/kerala/HighlightsSection";

import { WhyTravelSection } from "@/components/destinations/kerala/WhyTravelSection";
import { SeasonsSection } from "@/components/destinations/kerala/SeasonsSection";
import { FixedPackagesSection } from "@/components/destinations/kerala/FixedPackagesSection";
import { getKeralaPage } from "@/lib/strapi/kerala";

/* ISR. The page is built once and served from the cache; this window is only
   the backstop, because POST /api/revalidate drops the cache the moment an
   editor publishes. Deliberately NOT paired with `export const dynamic` —
   force-dynamic silently overrides revalidate and turns ISR back into SSR.

   Must be a literal: Next reads this statically at build time, so it cannot be
   the DEFAULT_REVALIDATE constant from lib/strapi/client.js. */
export const revalidate = 3600;

export async function generateMetadata() {
  /* Same call as the page body below. Because the data layer uses native
     fetch, Next memoises it per request and this costs no second round trip —
     the reason lib/strapi/client.js does not go through axios. */
  const page = await getKeralaPage().catch(() => null);

  /* Bare title on purpose — the root layout carries a
     `template: "%s | Fortune Travels"`, so adding the suffix here would print
     it twice. */
  return {
    title: page?.hero?.title ?? "Kerala",
    description:
      page?.hero?.description ?? "Explore Kerala Beyond the Guidebooks.",
  };
}

export default async function KeralaPage() {
  const page = await getKeralaPage();
console.log(page,"Dataaa")
  /* null means Strapi has no published entry — a real 404. A failed request
     throws instead, which lets Next keep serving the last good render rather
     than caching an empty page. */
  if (!page) notFound();

  return (
    <>
      {/* Pin scope for the sticky hero: sticky positioning is bounded by the
          parent box, so the hero stays pinned only while this wrapper is on
          screen. When the intro section's end scrolls up past the viewport
          bottom, it pushes the hero away with it instead of leaving it pinned
          for the rest of the page. */}
      <div>
        <HeroSection {...page.hero} />
        <IntroSection {...page.intro} />
      </div>
      {/* Journeys and Seasons have no counterpart in the kerala-pages content
          type yet, so they keep their own copy until the schema grows fields
          for them. */}
      <JourneysSection />
      <MustVisitSection {...page.mustVisit} />
      <HighlightsSection {...page.highlights} />
      <WhyTravelSection {...page.why} />
      <SeasonsSection />
      <FixedPackagesSection {...page.packages} />
    </>
  );
}
