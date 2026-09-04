import { StrapiError, strapiFetch } from "./client";
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
 *   monthsSection    label, title, description + months[] tabs, each with
 *                    cards[] (month, title, description, link, image)
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
    /* Same rule again: the package cards' `image` sits two levels down, so
       `populate: "*"` alone leaves every card without its picture and the
       placeholders render instead of the editor's uploads. */
    packagesSection: { populate: { packages: { populate: "*" } } },
    closingSection: { populate: "*" },
    monthsSection: {
      populate: { months: { populate: { cards: { populate: "*" } } } },
    },
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
  /* [] rather than a throw on any Strapi failure — unset STRAPI_API_URL,
     unreachable panel, missing collection. This runs inside `next build`
     ("Collecting page data"), where a throw fails the whole build; with an
     empty list the route still exists and renders each slug on demand. The
     same contract getCountryParams() in ./country.js keeps. */
  try {
    const experiences = await getExperiences();
    return experiences?.map((exp) => exp.slug) ?? [];
  } catch (error) {
    if (error instanceof StrapiError) return [];
    throw error;
  }
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
      const months = normaliseMonths(
        experience.monthsSection,
        placeholders.hero,
      );
      const packages = experience.packagesSection ?? {};
      const packagesHasLabel = Boolean(text(packages.label, ""));
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
        /* Two arrangements exist in the CMS. Honeymoon fills the fields the way
           their names read — label "Find Your Package", title the heading,
           introTitle the line above the copy. The entries added later leave
           label empty and shift everything up a field. Reading both keeps the
           design's order on Honeymoon (heading, then the smaller line) without
           rewriting anyone's entry, and stops the others printing "Find Your
           Package" as the eyebrow AND the subheading. */
        packagesEyebrow: packagesHasLabel
          ? text(packages.label, "")
          : text(packages.title, ""),
        packagesTitle: packagesHasLabel
          ? text(packages.title, "")
          : text(packages.introTitle, text(packages.title, "")),
        packagesSubheading: packagesHasLabel
          ? text(packages.introTitle, "")
          : "",
        packagesDescription: text(packages.description, ""),
        packagesCtaLabel: text(packages.ctaLabel, ""),
        packagesCtaHref: text(packages.ctaLink, "/concierge"),
        packages: normalisePackages(packages.packages, placeholders.packages),

        // ── Callout Section (`closingSection`) ──
        calloutTitle: text(closing.title, ""),
        calloutLead: callout.lead ?? text(closing.label, undefined),
        calloutParagraphs: callout.paragraphs,
        calloutCtaLabel: text(closing.ctaLabel, ""),
        calloutCtaHref: text(closing.ctaLink, "/contact"),

        // ── Months/Seasonal Tabs (`monthsSection`) ──
        monthsLabel: months.title,
        monthsEyebrow: months.eyebrow,
        monthsTitle: months.title,
        monthsDescription: months.description,
        monthTabs: months.tabs,
        monthCards: months.cards,

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

/* `monthsSection` drives TabbedCardsSection. That component takes its tabs and
   its cards separately — tabs as a list, cards as an object keyed by tab — so
   the CMS's nested shape is flattened into both here.

   `name` is left empty on purpose: the component falls back to it for the
   small label on a card, and each card carries its own month instead. */
function normaliseMonths(section, heroFallback) {
  if (!section)
    return { eyebrow: "", title: "", description: "", tabs: [], cards: {} };

  const tabs = [];
  const cards = {};

  list(section.months).forEach((tab, index) => {
    const label = text(tab.label, "");
    const key = slugify(label) || `month-${tab.id ?? index}`;
    tabs.push({ key, label, name: "" });
    cards[key] = list(tab.cards).map((card) => {
      const title = text(card.title, "");
      return {
        month: text(card.month, ""),
        title,
        meta: text(card.description, ""),
        href: text(card.link, ""),
        image: mediaUrl(
          card.image,
          MONTH_CARD_IMAGES[slugify(title)] ?? heroFallback,
        ),
      };
    });
  });

  return {
    eyebrow: text(section.label, ""),
    title: text(section.title, ""),
    description: text(section.description, ""),
    tabs,
    cards,
  };
}

/* Month-card artwork by destination name, the way home.js matches its
   destination strip, so a card keeps the right picture wherever it sits in the
   list. Thailand has no photo of its own in public/experiance yet. */
const MONTH_CARD_IMAGES = {
  maldives: "/experiance/maldives.png",
  bali: "/experiance/bali.png",
  switzerland: "/experiance/switzerland.png",
  mauritius: "/experiance/mauritius.png",
  greece: "/experiance/greece.png",
  paris: "/experiance/paris.png",
  seychelles: "/experiance/seychelles.png",
  thailand: "/experiance/beach-escape.png",
};

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
      "/experiance/bali.png",
      "/experiance/greece.png",
      "/destinations/kerala/ayurveda-wellness.jpg",
    ],
  },
};
