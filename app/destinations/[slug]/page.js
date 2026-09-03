import { notFound } from "next/navigation";

import { HeroSection } from "@/components/destinations/kerala/HeroSection";
import { IntroSection } from "@/components/common/IntroSection";
import { JourneysSection } from "@/components/destinations/kerala/JourneysSection";
import { MustVisitSection } from "@/components/destinations/kerala/MustVisitSection";
import { HighlightsSection } from "@/components/destinations/kerala/HighlightsSection";
import { WhyTravelSection } from "@/components/common/WhyTravelSection";
import { SeasonsSection } from "@/components/destinations/kerala/SeasonsSection";
import { FaqSection } from "@/components/destinations/kerala/FaqSection";
import { RegionFixedPackagesSection } from "@/components/destinations/RegionFixedPackagesSection";
import { PlanMyTripSection } from "@/components/plan-my-trip/PlanMyTripSection";
import { destinationNameForSlug } from "@/lib/navigation";
import { destinationOptionsFor } from "@/lib/planMyTrip";
import { getDestinationPage, getDestinationSlugs } from "@/lib/strapi/kerala";

/* The enquiry form's backdrop per destination. The kerala-pages content type
   has no planTripSection yet, so the form runs on its own copy here; the
   picture is the one thing that would look wrong left at the component's
   default (an African plain). Add a line when a destination page goes live. */
const PLAN_TRIP_IMAGES = {
  kerala: "/destinations/kerala/house-boat.avif",
  india: "/destination/india.avif",
};

/* One route for every destination. The design is fixed; the CMS supplies the
   content, and the slug picks which entry — see destinationSlug() in
   lib/strapi/kerala.js for how a slug maps onto an entry's internalName.

   The section components still live under components/destinations/kerala/.
   That folder name is now a misnomer rather than a constraint: none of them
   are Kerala-specific, they just take props. */

/* ISR. The page is built once and served from the cache; this window is only
   the backstop, because POST /api/revalidate drops the cache the moment an
   editor publishes. Deliberately NOT paired with `export const dynamic` —
   force-dynamic silently overrides revalidate and turns ISR back into SSR.

   Must be a literal: Next reads this statically at build time, so it cannot be
   the DEFAULT_REVALIDATE constant from lib/strapi/client.js. */
export const revalidate = 3600;

/* Deliberately NOT `dynamicParams = false`. Locking the route to the slugs
   known at build time is what made a newly published destination
   unreachable until someone redeployed: generateStaticParams runs once, at
   build, so an entry published afterwards was never in the allowlist — and
   no amount of tag revalidation can add a param to a closed list. The
   honest 404 still happens one level down, where getDestinationPage()
   returns null and the page calls notFound(). */

export async function generateStaticParams() {
  const slugs = await getDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  /* Same call as the page body below. Because the data layer uses native
     fetch, Next memoises it per request and this costs no second round trip —
     the reason lib/strapi/client.js does not go through axios. */
  const page = await getDestinationPage(slug).catch(() => null);

  /* Bare title on purpose — the root layout carries a
     `template: "%s | Fortune Travels"`, so adding the suffix here would print
     it twice. */
  return {
    title: page?.hero?.title ?? "Destinations",
    description:
      page?.hero?.description ?? "Explore destinations beyond the guidebooks.",
  };
}

export default async function DestinationPage({ params }) {
  const { slug } = await params;

  const page = await getDestinationPage(slug);

  if (!page) notFound();

  return (
    <>
      {/* Pin scope for the sticky hero: sticky positioning is bounded by the
          parent box, so the hero stays pinned only while this wrapper is on
          screen. When the intro section's end scrolls up past the viewport
          bottom, it pushes the hero away with it instead of leaving it pinned
          for the rest of the page. */}
      <div>
        <HeroSection {...page.hero} slug={slug} />
        <IntroSection {...page.intro} />
      </div>
      {/* The heading comes from the entry's traveller-types section; the cards
          are the travel styles, fetched client-side from /api/travel-styles —
          their own collection type, shared by every destination — unless the
          entry names its own set. */}
      <JourneysSection {...page.journeys} />
      <MustVisitSection {...page.mustVisit} />
      <HighlightsSection {...page.highlights} />
      <WhyTravelSection {...page.why} />
      {/* <SeasonsSection {...page.seasons} /> */}
      {/* <RegionFixedPackagesSection {...page.packages} /> */}

      {/* The enquiry form, then the FAQ — the order the country pages use.
          The destination chips are this place's own (Munnar, Alleppey … on
          Kerala; Kerala, Rajasthan … on India), from lib/countryPlaces.js via
          the same helper the country pages use. Everything else is the
          component's shipped copy until the CMS grows a planTripSection for
          this content type. */}
      <PlanMyTripSection
        backgroundImage={PLAN_TRIP_IMAGES[slug]}
        options={{
          destination: destinationOptionsFor({
            country: destinationNameForSlug(slug),
          }),
        }}
      />
      <FaqSection {...page.faq} />
    </>
  );
}
