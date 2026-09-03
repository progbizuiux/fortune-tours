import { notFound } from "next/navigation";

import { AtAGlanceSection } from "@/components/common/AtAGlanceSection";
import { Container } from "@/components/common/Container";
import { FaqSection } from "@/components/common/FaqSection";
import { FeatureRows } from "@/components/common/FeatureRows";
import { ImageIntroSection } from "@/components/common/ImageIntroSection";
import { PageHero } from "@/components/common/PageHero";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CountryRegionsSection } from "@/components/destinations/CountryRegionsSection";
import { RegionFeaturesSection } from "@/components/common/RegionFeaturesSection";
import { RegionFixedPackagesSection } from "@/components/destinations/RegionFixedPackagesSection";
import { PlanMyTripSection } from "@/components/plan-my-trip/PlanMyTripSection";
import { getCountryPage, getCountryParams } from "@/lib/strapi/country";

/* Country pages: /africa/botswana and its siblings — one file for all of them.
 *
 * Both segments are load-bearing. `country` names the Strapi entry and `slug`
 * must be a region that lists that country in lib/navigation.js — so
 * /africa/mauritius, /asia/mauritius and /indian-ocean/mauritius all render
 * Mauritius (a reader browsing the Indian Ocean stays in the Indian Ocean),
 * while /europe/mauritius 404s. The entry's own region is the canonical URL;
 * every alias carries a <link rel="canonical"> to it — see
 * lib/strapi/country.js. Static segments win over a dynamic one in Next's
 * route matching, so /destinations/*, /search and /experiences/* are untouched
 * by this route.
 *
 * Every word on the page comes from the CMS. The sections are shape-only and
 * take their copy as props; a field an editor has not filled falls through to
 * the design's own line rather than rendering a hole.
 */

/* ISR, same terms as the rest of the app: cached until POST /api/revalidate
   fires on publish, with this window as the backstop. Must be a literal —
   Next reads it statically at build time. No `dynamicParams` export, so a
   country published after the last build renders on demand instead of 404ing
   until a redeploy. */
export const revalidate = 3600;

export async function generateStaticParams() {
  return getCountryParams();
}

export async function generateMetadata({ params }) {
  const { slug, country } = await params;
  const page = await getCountryPage(slug, country).catch(() => null);

  // No entry means notFound() below and Next renders the 404 — there is no
  // page here to describe.
  if (!page) return {};

  /* Bare, because the root layout carries a
     `template: "%s | Fortune Travels"`. */
  return {
    title: page.meta?.title ?? page.hero?.title ?? page.name,
    description: page.meta?.description ?? page.hero?.description,
    /* One page, several URLs: the canonical points every alias at the region
       the entry names, so the copies are not indexed as duplicates. Resolved
       against metadataBase in the root layout. */
    alternates: page.canonicalPath ? { canonical: page.canonicalPath } : {},
    /* The root layout's openGraph.url is the site root; without this every
       country page would share it, contradicting the canonical above. */
    openGraph: page.canonicalPath ? { url: page.canonicalPath } : undefined,
  };
}

export default async function CountryPage({ params }) {
  const { slug, country } = await params;

  const page = await getCountryPage(slug, country);

  if (!page) notFound();

  return (
    <div>
      {/* Pin scope for the sticky hero: sticky positioning is bounded by the
          parent box, so the hero stays pinned only while this wrapper is on
          screen — the intro pushes it away as it scrolls up. */}
      <div>
        <PageHero {...page.hero} priority />
        <ImageIntroSection {...page.intro} className="relative z-10" />
      </div>

      <CountryRegionsSection {...page.regions} />

      <AtAGlanceSection {...page.glance} />

      {/* The heading sits in a Container and the rows run full-bleed beneath
          it, which is why the CMS section arrives as two props rather than
          being handed to one component. */}
      {page.ground?.rows?.length > 0 && (
        <div className="bg-background relative z-10 pt-16 md:pt-24 lg:pt-[120px] pb-16 md:pb-24 lg:pb-[120px]">
          <Container>
            <SectionHeading
              align="left"
              eyebrow={page.ground.heading?.eyebrow}
              title={page.ground.heading?.title}
              titleClassName="whitespace-pre-line max-w-[800px]"
            />
          </Container>
          <FeatureRows
            items={page.ground.rows}
            className="mt-12 md:mt-16 xl:mt-[60px]"
            stacked
          />
        </div>
      )}

      <RegionFeaturesSection {...page.about} />

      <PlanMyTripSection {...page.planTrip} className="!mt-0" />

      {/* Fixed departures, only when this country sells one. Guarded rather
          than fallen back on for the same reason the region pages guard it:
          this section's design copy is three Kerala itineraries, and Kozhikode
          under a South Africa heading is worse than no section at all. Fill
          packagesSection on the entry and the carousel appears. */}
      {page.packages?.items?.length ? (
        /* withTopSpacing because the section above it is the dark plan-my-trip
           panel, which ends flush at its own edge — without it the eyebrow
           starts immediately under the black. The region pages, where the
           preceding section closes with its own gap, leave it off. */
        <RegionFixedPackagesSection {...page.packages} withTopSpacing />
      ) : null}

      <FaqSection {...page.faq} />
    </div>
  );
}
