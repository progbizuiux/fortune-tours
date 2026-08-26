import { notFound } from "next/navigation";

import { HeroSection } from "@/components/destinations/kerala/HeroSection";
import { IntroSection } from "@/components/destinations/kerala/IntroSection";
import { JourneysSection } from "@/components/destinations/kerala/JourneysSection";
import { MustVisitSection } from "@/components/destinations/kerala/MustVisitSection";
import { HighlightsSection } from "@/components/destinations/kerala/HighlightsSection";
import { WhyTravelSection } from "@/components/common/WhyTravelSection";
import { SeasonsSection } from "@/components/destinations/kerala/SeasonsSection";
import { RegionFixedPackagesSection } from "@/components/destinations/RegionFixedPackagesSection";
import { getDestinationPage, getDestinationSlugs } from "@/lib/strapi/kerala";

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

/* Only the slugs the CMS actually holds get rendered; anything else 404s
   rather than being built on demand. That matters here because the site links
   to destinations that have no entry yet — the home page's cards point at
   /destinations/japan, /switzerland and /norway — and a 404 is the honest
   answer for those until someone writes the content. */
export const dynamicParams = false;

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
        <HeroSection {...page.hero} />
        <IntroSection {...page.intro} />
      </div>
      {/* Journeys fetches travel styles from /api/travel-styles endpoint.
          Same eight styles on every destination by design. */}
      <JourneysSection />
      <MustVisitSection {...page.mustVisit} />
      <HighlightsSection {...page.highlights} />
      <WhyTravelSection {...page.why} />
      <SeasonsSection />
      <RegionFixedPackagesSection {...page.packages} />
    </>
  );
}
