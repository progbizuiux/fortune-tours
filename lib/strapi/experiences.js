import { strapiFetch } from "./client";
import { mediaAlt, mediaUrl } from "./media";
import { joinParts, list, slugify, splitMarkdown, text } from "./normalise";

/* Experience pages — query, cache tags, and CMS→props normaliser.
 *
 * The `experience` content type is shaped as:
 *   scalars          name, title, slug, description, shortDescription,
 *                    ctaLabel, ctaLink, eyebrow, imageAlt, order, featured
 *   media            image, mobileImage
 *   sections[]       repeatable — label, title, description, ctaLabel,
 *                    ctaLink, image, imageAlt, imagePosition
 *   destinationsSection
 *                    label, title, description + destinations[] cards
 *                    (title, description, link, image)
 *   packagesSection  label, title, introTitle, description, ctaLabel, ctaLink
 *   closingSection   label, title, description, ctaLabel, ctaLink
 *
 * Populate keys MUST match those names. A key that does not exist makes Strapi
 * answer 400 ValidationError for the whole request, which is how this file
 * previously ended up serving one hardcoded entry instead of the CMS's five.
 */

export const EXPERIENCES_TAGS = ["experience", "experiences"];

const EXPERIENCES_QUERY = {
  populate: {
    image: true,
    mobileImage: true,
    sections: { populate: "*" },
    /* The cards are a repeatable list inside the section, so they need their
       own rule or they come back missing — same as Kerala's `places`. */
    destinationsSection: { populate: { destinations: { populate: "*" } } },
    packagesSection: { populate: "*" },
    closingSection: { populate: "*" },
  },
  sort: ["order:asc", "id:asc"],
  pagination: { pageSize: 100 },
};

/**
 * Fetch and normalise all experiences.
 *
 * Throws on a transport or validation failure, same as every other read in
 * this app — see the note in lib/strapi/client.js. Swallowing the error here
 * is what hid the broken populate query behind plausible-looking output.
 *
 * @returns array of normalized experiences, or undefined when CMS has nothing
 */
export async function getExperiences() {
  const json = await strapiFetch("experiences", {
    query: EXPERIENCES_QUERY,
    tags: EXPERIENCES_TAGS,
  });

  return normaliseExperiences(json?.data);
}

/**
 * Fetch and normalise one experience by slug.
 * @returns the experience object, or null when no match
 */
export async function getExperience(slug) {
  if (!slug) return null;
  const experiences = await getExperiences();
  return experiences?.find((exp) => exp.slug === slug) ?? null;
}

/**
 * Get all experience slugs for generateStaticParams.
 */
export async function getExperienceSlugs() {
  const experiences = await getExperiences();
  return experiences?.map((exp) => exp.slug) ?? [];
}

export function normaliseExperiences(data) {
  const items = list(data)
    .map((experience) => {
      /* `name` ("Adventure"), not `title` ("Built for the Bold") — only
         Honeymoon has an explicit slug set, and the rest must not fall back to
         a URL built from their headline. */
      const slug =
        text(experience.slug) ||
        slugify(text(experience.name, "")) ||
        slugify(text(experience.title, ""));
      if (!slug) return null;

      const name = text(experience.name, "") || text(experience.title, "");
      const placeholders = PLACEHOLDERS[slug] ?? PLACEHOLDERS.default;
      const closing = experience.closingSection ?? {};
      const destinationPicks = experience.destinationsSection ?? {};
      const packages = experience.packagesSection ?? {};
      const callout = splitMarkdown(closing.description);

      return {
        // ── Hero Section ──
        slug,
        name,
        crumbs: [{ label: "Experience" }, { label: name }],
        title: text(experience.title, name),
        description: text(experience.description, ""),
        shortDescription: text(
          experience.shortDescription,
          text(experience.description, ""),
        ),
        ctaLabel: text(experience.ctaLabel, "Make It Yours"),
        ctaHref: text(experience.ctaLink, "/concierge"),
        image: mediaUrl(experience.image, placeholders.hero),
        imageAlt: mediaAlt(experience.image, text(experience.imageAlt, name)),

        // ── Destinations Carousel (`destinationsSection`) ──
        /* Stays empty for an entry whose section an editor has not filled in,
           which is what the page tests for — it skips the section rather than
           rendering a bare heading. */
        destinationsEyebrow: text(destinationPicks.label, ""),
        destinationsTitle: text(destinationPicks.title, ""),
        destinations: normaliseDestinations(
          destinationPicks.destinations,
          placeholders.destinations,
        ),

        // ── Feature Rows (the `sections` repeatable) ──
        escapesLabel: text(
          packages.experiencesLabel,
          `Ways to travel — ${name}`,
        ),
        escapes: normaliseSections(experience.sections, placeholders.rows),

        // ── Packages Carousel ──
        packagesEyebrow: text(packages.label, text(packages.title, "")),
        packagesTitle: text(packages.introTitle, text(packages.title, "")),
        packagesSubheading: text(packages.title, ""),
        packagesDescription: text(packages.description, ""),
        packagesCtaLabel: text(packages.ctaLabel, ""),
        packagesCtaHref: text(packages.ctaLink, "/concierge"),
        packages: normalisePackages(packages.packages, placeholders.packages),

        // ── Callout Section (`closingSection`) ──
        calloutTitle: text(closing.title, ""),
        calloutLead: callout.lead ?? text(closing.label, undefined),
        calloutParagraphs: callout.paragraphs,
        calloutCtaLabel: text(closing.ctaLabel, ""),
        calloutCtaHref: text(closing.ctaLink, "/concierge"),

        // ── Months/Seasonal Tabs ──
        /* Same as destinations: no field on the content type yet. */
        monthsLabel: "",
        monthsEyebrow: "",
        monthsTitle: "",
        monthsDescription: "",
        monthTabs: [],
        monthCards: {},

        // ── SEO / ordering ──
        metaTitle: text(experience.metaTitle, undefined),
        metaDescription: text(experience.metaDescription, undefined),
        order: Number(experience.order) || 0,
        featured: Boolean(experience.featured),
      };
    })
    .filter(Boolean);

  return items.length ? items : undefined;
}

/* `sections` drives FeatureRows. Rows are NOT dropped when the CMS has no
   image — every entry is imageless today, and filtering on it would empty the
   page. A placeholder stands in until an editor uploads one. */
function normaliseSections(sections, fallbacks = []) {
  return list(sections).map((section, index) => {
    const title = text(section.title, "");
    return {
      key: slugify(title) || `section-${section.id ?? index}`,
      eyebrow: text(section.label, ""),
      title,
      description: text(section.description, ""),
      ctaLabel: text(section.ctaLabel, ""),
      ctaHref: text(section.ctaLink, ""),
      image: mediaUrl(section.image, fallbacks[index % fallbacks.length]),
      alt: mediaAlt(section.image, text(section.imageAlt, title)),
      imagePosition: text(section.imagePosition, "right"),
    };
  });
}

/* `destinationsSection.destinations` drives the card carousel. The card's
   `link` is not mapped: CardCarouselSection does not wrap its cards in an
   anchor today, so it would be a prop nothing reads. */
function normaliseDestinations(destinations, fallbacks = []) {
  return list(destinations).map((destination, index) => {
    const title = text(destination.title, "");
    return {
      key: slugify(title) || `destination-${destination.id ?? index}`,
      title,
      description: text(destination.description, ""),
      /* next/image throws on a null `src` and every card is imageless in the
         CMS today, so the placeholder is load-bearing, not decoration. */
      image: mediaUrl(destination.image, fallbacks[index % fallbacks.length]),
      alt: mediaAlt(destination.image, title),
    };
  });
}

/* `packagesSection.packages` drives the package carousel. PackageCard renders
   `meta` and `experiences` as plain strings, so the CMS's separate nights /
   places fields are joined here rather than in the component. */
function normalisePackages(packages, fallbacks = []) {
  return list(packages).map((pkg, index) => {
    const title = text(pkg.title, "");
    return {
      key: slugify(title) || `package-${pkg.id ?? index}`,
      title,
      meta: joinParts([text(pkg.nights, ""), text(pkg.places, "")]),
      experiences: text(pkg.experiences, ""),
      href: text(pkg.link, ""),
      image: mediaUrl(pkg.image, fallbacks[index % fallbacks.length]),
      alt: mediaAlt(pkg.image, title),
    };
  });
}

/* Stand-in artwork, used only where a Strapi media field is empty. The CMS has
   no uploads against these entries yet, and both the hero and FeatureRows size
   themselves from a real image, so a null would collapse the layout. Delete an
   entry here once its images are in the media library. */
const PLACEHOLDERS = {
  default: {
    hero: "/experiance/honey-moon.jpg",
    destinations: [
      "/experiance/maldives.png",
      "/experiance/bali.png",
      "/experiance/switzerland.png",
      "/experiance/mauritius.png",
    ],
    rows: [
      "/experiance/mountain-escape.png",
      "/experiance/beach-escape.png",
      "/experiance/city-escape.png",
    ],
    packages: [
      "/experiance/seychelles.png",
      "/experiance/paris.png",
      "/experiance/greece.png",
    ],
  },
  honeymoon: {
    hero: "/experiance/honey-moon.jpg",
    destinations: [
      "/experiance/maldives.png",
      "/experiance/bali.png",
      "/experiance/switzerland.png",
      "/experiance/mauritius.png",
    ],
    rows: [
      "/experiance/mountain-escape.png",
      "/experiance/beach-escape.png",
      "/experiance/city-escape.png",
    ],
    packages: [
      "/experiance/seychelles.png",
      "/experiance/paris.png",
      "/experiance/greece.png",
    ],
  },
  adventure: {
    hero: "/experiance/switzerland.png",
    destinations: [
      "/experiance/switzerland.png",
      "/experiance/bali.png",
      "/experiance/greece.png",
      "/experiance/maldives.png",
    ],
    rows: [
      "/experiance/switzerland.png",
      "/experiance/mountain-escape.png",
      "/experiance/bali.png",
    ],
    packages: [
      "/experiance/switzerland.png",
      "/experiance/mountain-escape.png",
      "/experiance/bali.png",
    ],
  },
  luxury: {
    hero: "/experiance/seychelles.png",
    destinations: [
      "/experiance/maldives.png",
      "/experiance/seychelles.png",
      "/experiance/paris.png",
      "/experiance/mauritius.png",
    ],
    rows: [
      "/experiance/seychelles.png",
      "/experiance/mauritius.png",
      "/experiance/maldives.png",
    ],
    packages: [
      "/experiance/seychelles.png",
      "/experiance/mauritius.png",
      "/experiance/maldives.png",
    ],
  },
  families: {
    hero: "/experiance/bali.png",
    destinations: [
      "/experiance/bali.png",
      "/experiance/switzerland.png",
      "/experiance/mauritius.png",
      "/experiance/greece.png",
    ],
    rows: [
      "/experiance/bali.png",
      "/experiance/beach-escape.png",
      "/experiance/city-escape.png",
      "/experiance/greece.png",
    ],
    packages: [
      "/experiance/bali.png",
      "/experiance/greece.png",
      "/experiance/beach-escape.png",
    ],
  },
  spiritual: {
    hero: "/experiance/greece.png",
    destinations: [
      "/experiance/bali.png",
      "/experiance/greece.png",
      "/experiance/switzerland.png",
      "/experiance/mauritius.png",
    ],
    rows: [
      "/experiance/greece.png",
      "/experiance/paris.png",
      "/experiance/city-escape.png",
    ],
    packages: [
      "/experiance/greece.png",
      "/experiance/paris.png",
      "/experiance/city-escape.png",
    ],
  },
};
