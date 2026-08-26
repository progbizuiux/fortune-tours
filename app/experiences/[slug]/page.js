import { notFound } from "next/navigation";
import { CalloutSection } from "@/components/common/CalloutSection";
import { CardCarouselSection } from "@/components/common/CardCarouselSection";
import { FeatureRows } from "@/components/common/FeatureRows";
import { PackageCarouselSection } from "@/components/common/PackageCarouselSection";
import { TabbedCardsSection } from "@/components/common/TabbedCardsSection";
import { JournalSection } from "@/components/common/JournalSection";
import { ExperienceHero } from "@/components/experiences/ExperienceHero";
import {
  getExperience,
  getExperienceSlugs,
} from "@/lib/strapi/experiences";

/* Every experience renders through this one file — the sections are shape-only
   and all the content comes from Strapi, so adding an experience is
   a CMS entry rather than a code change. */

export async function generateStaticParams() {
  const slugs = await getExperienceSlugs();
  return (slugs || []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const experience = await getExperience(slug);

  if (!experience) return {};

  return {
    title: experience.title,
    description: experience.description,
  };
}

export default async function ExperiencePage({ params }) {
  const { slug } = await params;
  const experience = await getExperience(slug);

  if (!experience) notFound();

  return (
    <>
      <ExperienceHero
        crumbs={experience.crumbs}
        title={experience.title}
        description={experience.description}
        ctaLabel={experience.ctaLabel}
        ctaHref={experience.ctaHref}
        image={experience.image}
        imageAlt={experience.imageAlt}
      />

      {experience.destinations?.length > 0 && (
      <CardCarouselSection
        ariaLabel={experience.destinationsTitle}
        eyebrow={experience.destinationsEyebrow}
        title={experience.destinationsTitle}
        items={experience.destinations}
        /* No `className`: this section sits on the page's white ground, where
           Kerala's is on cream. And no `description` — the design carries the
           eyebrow and heading alone, which SectionHeading already allows for.

           The track lines up with Container's padding rather than running
           toward the viewport edge, so the first card's left edge sits under
           the hero copy above it — that is what the design shows. */
        trackClassName="px-4 md:px-8 lg:px-20 scroll-pl-4 md:scroll-pl-8 lg:scroll-pl-20"
        /* The cards rise in on the shared scroll-scrubbed entrance the home
           page's destination strip uses — see lib/gsap/useRowRise.js. Kerala renders
           the same section and is deliberately left without it. */
        riseOnScroll
      />
      )}

      {experience.escapes?.length > 0 && (
      <FeatureRows
        ariaLabel={experience.escapesLabel}
        items={experience.escapes}
        className="!py-0"
        /* Each escape row is a full screen that the next one slides up over and
           covers, from xl up — the stacked-panel scroll the design references.
           See components/common/FeatureRows.jsx for how it is built. */
        stacked
      />
      )}

      {experience.packages?.length > 0 && (
      <PackageCarouselSection
        ariaLabel={experience.packagesTitle}
        eyebrow={experience.packagesEyebrow}
        title={experience.packagesTitle}
        subheading={experience.packagesSubheading}
        description={experience.packagesDescription}
        ctaLabel={experience.packagesCtaLabel}
        ctaHref={experience.packagesCtaHref}
        items={experience.packages}
        /* The vita-travel.webflow.io statistics cascade, on the one section
           here that had no motion of its own — see lib/gsap/useCardCascade.js. */
        cascade
      />
      )}

      {experience.calloutTitle && (
      <CalloutSection
        ariaLabel={experience.calloutTitle}
        title={experience.calloutTitle}
        lead={experience.calloutLead}
        paragraphs={experience.calloutParagraphs}
        ctaLabel={experience.calloutCtaLabel}
      />
      )}

      {experience.monthTabs?.length > 0 && (
      <TabbedCardsSection
        sectionAriaLabel={experience.monthsLabel}
        eyebrow={experience.monthsEyebrow}
        title={experience.monthsTitle}
        description={experience.monthsDescription}
        tabs={experience.monthTabs}
        cardsData={experience.monthCards}
        extraCls="!py-0 xl:!py-[100px]"
      />
      )}

      {/* !mt-0 cancels the negative top margin the home page needs to tuck this
          strip under its cloud transition — there is nothing to tuck under
          here, and left in it would ride up over the section above. */}
      <JournalSection className="!mt-0" />
    </>
  );
}
