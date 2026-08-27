import { notFound } from "next/navigation";

import { AtAGlanceSection } from "@/components/common/AtAGlanceSection";
import { Container } from "@/components/common/Container";
import { FaqSection } from "@/components/common/FaqSection";
import { FeatureRows } from "@/components/common/FeatureRows";
import { ImageIntroSection } from "@/components/common/ImageIntroSection";
import { PageHero } from "@/components/common/PageHero";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CountryRegionsSection } from "@/components/destinations/CountryRegionsSection";
import { RegionFeaturesSection } from "@/components/destinations/RegionFeaturesSection";
import { PlanMyTripSection } from "@/components/plan-my-trip/PlanMyTripSection";
import { getCountryPage, getCountryParams } from "@/lib/strapi/country";

/* Country pages: /africa/botswana and its siblings — one file for all of them.
 *
 * Both segments are load-bearing. `slug` is the region and `country` the
 * country, and the entry has to name both, so /africa/botswana resolves while
 * /asia/botswana does not — see lib/strapi/country.js. Static segments win
 * over a dynamic one in Next's route matching, so /destinations/*, /search and
 * /experiences/* are untouched by this route.
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
        <div className="bg-background relative z-10 pt-16 md:pt-24 lg:pt-[120px]">
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

      <FaqSection {...page.faq} />
    </div>
  );
}
