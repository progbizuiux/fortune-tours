import { HeroSection } from "@/components/home/HeroSection";
import { TravelStylesSection } from "@/components/home/TravelStylesSection";
import { GlobeSection } from "@/components/home/GlobeSection";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { CredentialsSection } from "@/components/common/CredentialsSection";
import { DeparturesSection } from "@/components/home/DeparturesSection";
import { JournalSection } from "@/components/common/JournalSection";
import { PolaroidGallery } from "@/components/home/PolaroidGallery";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { CloudTransition } from "@/components/common/CloudTransition";
import { getHomePage } from "@/lib/strapi/home";
import { getTravelStyles } from "@/lib/strapi/travel-styles";



/* ISR, same terms as the Kerala page: cached until POST /api/revalidate fires
   on publish, with this window as the backstop. No `export const dynamic` —
   force-dynamic would silently override it. */
export const revalidate = 3600;

export default async function Home() {
  /* Unlike a destination page, the home page is not meaningless without a CMS
     entry — every section still has its own copy — so a missing entry renders
     the design rather than a 404. A failed REQUEST still throws, which keeps
     Next serving the last good render instead of caching a stripped page. */
  const [page, travelStyles] = await Promise.all([
    getHomePage(),
    getTravelStyles(),
  ]);

  const homeData = page ?? {};

  /* The content type stores these sections in a dynamic zone, so the editor
     controls their ORDER as well as their content. This page still fixes the
     order in JSX, because two things do not line up one-to-one yet:
     `sections.brand` and `sections.reviews` both feed CredentialsSection,
     and `sections.map-cta` has no rendered component (GlobeSection is
     commented out below). Resolve those two and this becomes a map over the
     zone — see lib/strapi/blocks.js. */
  return (
    <>
      {/* Pin scope for the sticky hero: sticky positioning is bounded by the
          parent box, so the hero stays pinned only while this wrapper is on
          screen. When the destinations section's end scrolls up past the
          viewport bottom, it pushes the hero away with it instead of leaving
          it pinned for the rest of the page. */}
      <div>
        <HeroSection {...homeData.hero} />
        <DestinationsSection {...homeData.destinations} />
      </div>
      <CredentialsSection {...homeData.credentials} />
      <TravelStylesSection {...homeData.travelStyles} items={travelStyles} />
      <FeaturedDestinations {...homeData.featured} />
      <DeparturesSection {...homeData.departures} />
      <JournalSection {...homeData.journal} />
      <GlobeSection />
      {/* Same cloud bank that closes the hero, reused to close the globe. The
          art is white clouds fading to white, so it only reads when it lies
          over something — the pull-up sets it across the base of the sphere,
          the way the hero's sits across the photo. Ahead of the section in
          paint order, and z-20 to clear its `isolate z-0`.

          The navbar's transparency trigger reads the FIRST
          [data-navbar-solid-from] in the document, which is still the one
          inside DestinationsSection, so this second instance is decorative. */}
      {/* pointer-events-none is load-bearing: this wrapper is painted over the
          lower half of the globe, so without it the cloud box would swallow
          every drag that starts there and the globe would only be rotatable
          from the strip above the clouds. */}
      {/* The cloud art is a fixed 1580x440 strip whatever the viewport is, so
          below lg it is nearly as tall as the whole globe section. Every way of
          fitting it there traded one fault for another: cropping cut the bank
          mid-cloud, and pulling it up far enough to close the gap to the
          gallery dragged the clouds over the sphere.

          Below lg the design does not draw clouds at all — the sphere simply
          dissolves into the page ground, which GlobeSection's own bottom fade
          already does. So the bank is dropped there outright: display:none
          takes it out of layout, which also removes the empty tail that sat
          between the globe and the gallery. lg and up is untouched. */}
      <div className="pointer-events-none relative z-20 max-lg:hidden -mt-[calc(239px+9.6vw)]">
        <CloudTransition />
      </div>
      <PolaroidGallery {...homeData.gallery} />
    </>
  );
}
