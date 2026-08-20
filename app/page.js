import { HeroSection } from "@/components/home/HeroSection";
import { TravelStylesSection } from "@/components/home/TravelStylesSection";
import { GlobeSection } from "@/components/home/GlobeSection";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { CredentialsSection } from "@/components/home/CredentialsSection";
import { DeparturesSection } from "@/components/home/DeparturesSection";
import { JournalSection } from "@/components/home/JournalSection";
import { PolaroidGallery } from "@/components/home/PolaroidGallery";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { getHomePage } from "@/lib/strapi/home";


/* ISR, same terms as the Kerala page: cached until POST /api/revalidate fires
   on publish, with this window as the backstop. No `export const dynamic` —
   force-dynamic would silently override it. */
export const revalidate = 3600;

export default async function Home() {
  /* Unlike a destination page, the home page is not meaningless without a CMS
     entry — every section still has its own copy — so a missing entry renders
     the design rather than a 404. A failed REQUEST still throws, which keeps
     Next serving the last good render instead of caching a stripped page. */
  const page = (await getHomePage()) ?? {};

  /* The content type stores these sections in a dynamic zone, so the editor
     controls their ORDER as well as their content. This page still fixes the
     order in JSX, because three things do not line up one-to-one yet:
     `sections.brand` and `sections.reviews` both feed CredentialsSection,
     `sections.map-cta` has no rendered component (GlobeSection is commented
     out below), and PolaroidGallery has no block at all. Resolve those three
     and this becomes a map over the zone — see lib/strapi/blocks.js. */
  return (
    <>
      {/* Pin scope for the sticky hero: sticky positioning is bounded by the
          parent box, so the hero stays pinned only while this wrapper is on
          screen. When the destinations section's end scrolls up past the
          viewport bottom, it pushes the hero away with it instead of leaving
          it pinned for the rest of the page. */}
      <div>
        <HeroSection {...page.hero} />
        <DestinationsSection {...page.destinations} />
      </div>
      <CredentialsSection {...page.credentials} />
      <TravelStylesSection {...page.travelStyles} />
      <FeaturedDestinations {...page.featured} />
      <DeparturesSection {...page.departures} />
      <JournalSection {...page.journal} />
      {/* <GlobeSection /> */}
      {/* No counterpart in the content type — keeps its own photographs. */}
      <PolaroidGallery />
    </>
  );
}
