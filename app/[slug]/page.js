import { notFound } from "next/navigation";

import { CloudTransition } from "@/components/common/CloudTransition";
import { PageHero } from "@/components/common/PageHero";
import { RegionIntroSection } from "@/components/destinations/RegionIntroSection";
import { RegionExperiencesSection } from "@/components/destinations/RegionExperiencesSection";
import { RegionDestinationsSection } from "@/components/destinations/RegionDestinationsSection";
import { RegionFeaturesSection } from "@/components/destinations/RegionFeaturesSection";
import { RegionJournalSection } from "@/components/destinations/RegionJournalSection";
import {
  getDestinationPage,
  getDestinationRegion,
  getDestinationSlugs,
} from "@/lib/strapi/destination";

/* Destination region pages: /africa, /asia, /europe … one file for all of
 * them, the way /experiences/[slug] serves every experience.
 *
 * The segment sits at the root because that is the URL the design asks for —
 * /africa, not /destinations/africa. Static segments win over a dynamic one in
 * Next's route matching, so /search, /experiences/* and /destinations/kerala
 * are untouched by it; and the slug is checked against the region list in
 * lib/navigation.js before anything else happens, so every other path still
 * 404s exactly as it did.
 */

/* ISR, same terms as the home and Kerala pages: cached until POST
   /api/revalidate fires on publish, with this window as the backstop. Must be a
   literal — Next reads it statically at build time. No `export const dynamic`;
   force-dynamic would silently override it. */
export const revalidate = 3600;

export function generateStaticParams() {
  return getDestinationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const region = getDestinationRegion(slug);

  // Not a region means notFound() below and Next renders the 404 — there is no
  // page here to describe.
  if (!region) return {};

  const page = await getDestinationPage(region).catch(() => null);

  /* The region's name, not the hero's headline: the headline is a sentence
     about travel that reads the same on every one of these pages until an
     editor makes it specific, which would leave thirteen identically-titled
     tabs. Bare, because the root layout carries a
     `template: "%s | Fortune Travels"`. */
  return {
    title: region.label,
    description: page?.hero?.description,
  };
}

export default async function DestinationRegionPage({ params }) {
  const { slug } = await params;
  const region = getDestinationRegion(slug);

  if (!region) notFound();

  const page = await getDestinationPage(region);

  return (
    <>
      {/* Pin scope for the sticky hero: sticky positioning is bounded by the
          parent box, so the hero stays pinned only while this wrapper is on
          screen. The sections below it go inside this div — once the last one's
          end scrolls past the viewport bottom it pushes the hero away instead
          of leaving it pinned for the rest of the page, exactly as the home and
          Kerala pages do. */}
      <div>
        <PageHero {...page.hero} priority />
        {/* The cloud bank that closes the hero, the same one the home page
            draws — see components/common/CloudTransition.jsx. Inside the pin
            scope so it scrolls up over the pinned hero rather than pushing it.
            It stays on the page rather than moving inside the section below:
            DestinationsSection carries it on the home page because the clouds
            are that section's own top edge, where here they close the hero and
            the section beneath opens on its heading. */}
        <CloudTransition />

        {/* z-10 for the same reason every block after the home hero carries it:
            the hero is z-0 and pinned, so anything that scrolls over it has to
            paint on top rather than slide underneath. */}
        <RegionIntroSection {...page.intro} className="relative z-10" />


        <RegionDestinationsSection className="!pt-0"/>

        <RegionFeaturesSection />
        <RegionExperiencesSection />
        <RegionJournalSection />
      </div>
    </>
  );
}
