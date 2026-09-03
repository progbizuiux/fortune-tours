import { notFound } from "next/navigation";

import { PageHero } from "@/components/common/PageHero";
import { ImageIntroSection } from "@/components/common/ImageIntroSection";
import { FaqSection } from "@/components/common/FaqSection";
import { RegionFeaturesSection } from "@/components/common/RegionFeaturesSection";
import { ItinerarySection } from "@/components/packages/ItinerarySection";
import { InclusionsSection } from "@/components/packages/InclusionsSection";
import { DocumentsSection } from "@/components/packages/DocumentsSection";
import { CancellationSection } from "@/components/packages/CancellationSection";
import { BookingCtaSection } from "@/components/packages/BookingCtaSection";
import { getPackage, getPackageParams } from "@/lib/packages";

/* One route for every package — /destinations/kerala/lakshadweep-agatti-kalpitti
   and its siblings. The design is fixed; the two params pick the entry.

   The opening hero and the picture-and-story section below it are the shared
   ones every destination page already draws (components/common/PageHero and
   ImageIntroSection), and the FAQ is the shared accordion. Only the four
   middle sections are specific to a package, and they live under
   components/packages/.

   Content comes from lib/packages.js, which reads the hero from Strapi and
   keeps the design's copy for the sections the content type does not carry
   yet. That module is the only seam — see its header. */

/* ISR on the same terms as the rest of the app. Must be a literal: Next reads
   this statically at build time, so it cannot be DEFAULT_REVALIDATE from
   lib/strapi/client.js. */
export const revalidate = 3600;

/* Deliberately NOT `dynamicParams = false`, matching the destination route one
   level up: a closed allowlist is what makes a newly added package unreachable
   until someone redeploys. The honest 404 happens below, where getPackage()
   returns null. */

export function generateStaticParams() {
  return getPackageParams();
}

export async function generateMetadata({ params }) {
  const { slug, package: packageSlug } = await params;
  const entry = await getPackage(slug, packageSlug);

  if (!entry) return {};

  /* Bare title on purpose — the root layout carries a
     `template: "%s | Fortune Travels"`, so adding the suffix here would print
     it twice. The hero title sets its own line break, which belongs on the
     page and not in a <title>. */
  return {
    title: entry.hero?.title?.replace(/\n/g, " "),
    description: entry.hero?.description,
  };
}

export default async function PackagePage({ params }) {
  const { slug, package: packageSlug } = await params;
  const entry = await getPackage(slug, packageSlug);

  if (!entry) notFound();
  return (
    <>
      {/* Pin scope for the sticky hero: sticky positioning is bounded by the
          parent box, so the hero stays pinned only while this wrapper is on
          screen. When the intro section's end scrolls up past the viewport
          bottom, it pushes the hero away instead of leaving it pinned for the
          rest of the page — the same wrapper the destination route uses. */}
      <div>
        <PageHero {...entry.hero} priority />
        {/* A taller crop than the region pages' 1755x635. Their strip carries a
            single row of place names under the story; this one carries six
            label/value pairs, which needs the extra height to sit clear of the
            copy above it. Passed here rather than put in lib/packages.js
            because it is the frame, not the content. */}
        <ImageIntroSection
          {...entry.intro}
          imageClassName="xl:aspect-[1764/722]"
        />
      </div>

      <ItinerarySection {...entry.itinerary} />
      <InclusionsSection {...entry.inclusions} />
      <DocumentsSection {...entry.documents} />
      {entry.whyUs && <RegionFeaturesSection {...entry.whyUs} />}
      <CancellationSection {...entry.cancellation} />
      {/* The closing "hold your seat" band, between the cancellation table and
          the FAQ. Its own short photo strip rather than a second PageHero —
          see the note in the component for why the opening frame is wrong
          halfway down a page. Copy comes from the CMS `ctaSection`. */}
      <BookingCtaSection {...entry.cta} />
      <FaqSection {...entry.faq} />
    </>
  );
}
