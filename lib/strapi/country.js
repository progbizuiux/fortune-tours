import { StrapiError, strapiFetch, strapiFindOne } from "./client";
import { getCountryCardImage } from "./destination";
import { mediaAlt, mediaUrl } from "./media";
import { cta, joinParts, list, slugify, splitList, text } from "./normalise";

/* Country pages (/africa/botswana and its siblings) — query, cache tags and
 * the CMS→props normaliser.
 *
 * WHICH COUNTRY a URL means is answered by the entry itself, not by a list in
 * the code: `slug` is the last segment and `continentSlug` the one before it,
 * so /africa/botswana resolves and /asia/botswana does not. That keeps this
 * two-segment dynamic route from swallowing paths that belong elsewhere while
 * still letting an editor publish a new country without a deployment.
 *
 * EVERY WORD on the page comes from here. The section components are
 * shape-only and take their copy as props, so a field left empty in the CMS
 * falls through to the design's own line rather than rendering a hole — the
 * same contract the Kerala and continent pages use.
 */

export const COUNTRY_TAGS = ["country", "countries", "destinations"];

/* One rule per section. Each repeatable list inside a section needs its own
   rule, because `populate: "*"` reaches one level only. */
const COUNTRY_QUERY = (continentSlug, slug) => ({
  filters: {
    slug: { $eq: slug },
    continentSlug: { $eq: continentSlug },
  },
  populate: {
    heroSection: { populate: "*" },
    introSection: { populate: "*" },
    regionsSection: { populate: { regions: { populate: "*" } } },
    glanceSection: { populate: { stats: true } },
    groundSection: { populate: { rows: { populate: "*" } } },
    aboutSection: { populate: { features: true } },
    planTripSection: { populate: "*" },
    /* Same nested rule as the other repeatables: the cards' media sits two
       levels down, so `populate: "*"` alone would drop every picture. */
    packagesSection: { populate: { packages: { populate: "*" } } },
    faqSection: { populate: { faqs: true } },
  },
});

/* The scrim over the hero still. The CMS picks the weight; the class stays in
   the code, so an editor cannot put a broken Tailwind string on a live page.
   "default" maps to undefined — PageHero then draws its own three-layer scrim,
   which is what the shared frame specifies. */
const HERO_OVERLAYS = {
  light: "bg-black/20",
  medium: "bg-black/40",
  dark: "bg-black/60",
  none: "bg-transparent",
};

/* The pictures the design shipped with, used until an editor uploads the real
   photographs. Copy comes back from the CMS as undefined and the component
   falls through to its own line, but next/image throws on a null `src`, so an
   image field needs a real path rather than nothing.

   The lists rotate: a section with more rows than the design drew reuses them
   from the top rather than leaving the extra rows blank. */
const COUNTRY_DEFAULTS = {
  hero: "/destinations/kerala/wildlife.avif",
  intro: "/destinations/africa.png",
  cards: [
    "/destinations/kerala/adventure-nature.avif",
    "/destinations/kerala/wildlife.avif",
    "/destinations/kerala/elephants-sri-lanka.jpg",
    "/destinations/africa.png",
  ],
};

/* The nth design picture, wrapping round. */
const fallbackCard = (index) =>
  COUNTRY_DEFAULTS.cards[index % COUNTRY_DEFAULTS.cards.length];

/* ── reads ─────────────────────────────────────────────────────────────── */

/**
 * The entry for a country, or null when there is none.
 *
 * A 404 is treated as "no content" rather than an error, the same way
 * lib/strapi/destination.js does: it means the collection has not reached this
 * Strapi yet, which is a real state and not something a retry fixes. Every
 * other failure still throws, which is what keeps ISR honest — a regeneration
 * that throws leaves Next serving the last good render instead of caching a
 * stripped page. See lib/strapi/client.js.
 */
async function fetchCountry(continentSlug, slug) {
  try {
    return await strapiFindOne("countries", {
      query: COUNTRY_QUERY(continentSlug, slug),
      tags: COUNTRY_TAGS,
    });
  } catch (error) {
    if (error instanceof StrapiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * Fetch and normalise one country page.
 * @returns the props tree, or null when no published entry matches.
 */
export async function getCountryPage(continentSlug, slug) {
  if (!continentSlug || !slug) return null;

  const entry = await fetchCountry(continentSlug, slug);
  if (!entry) return null;

  /* Only worth a second request when the country has no hero picture of its
     own — which is the state every country is in until someone uploads one,
     and none once they have. */
  const cardImage = entry.heroSection?.image
    ? null
    : await getCountryCardImage(continentSlug, slug);

  return normaliseCountry(entry, cardImage);
}

/**
 * Every published country as { slug, country } — for generateStaticParams.
 *
 * Returns [] rather than throwing when the collection is missing, so a build
 * against a Strapi without this content type still succeeds and the pages
 * render on demand instead.
 */
export async function getCountryParams() {
  try {
    const json = await strapiFetch("countries", {
      query: {
        fields: ["slug", "continentSlug"],
        pagination: { pageSize: 200 },
      },
      tags: COUNTRY_TAGS,
    });

    return list(json?.data)
      .map((entry) => ({
        slug: text(entry.continentSlug),
        country: text(entry.slug),
      }))
      .filter((params) => params.slug && params.country);
  } catch (error) {
    if (error instanceof StrapiError) return [];
    throw error;
  }
}

/* ── normalisers ───────────────────────────────────────────────────────── */

export function normaliseCountry(entry, cardImage) {
  return {
    name: text(entry?.name),
    hero: normaliseHero(entry?.heroSection, cardImage),
    intro: normaliseIntro(entry?.introSection),
    regions: normaliseRegions(entry?.regionsSection),
    glance: normaliseGlance(entry?.glanceSection),
    ground: normaliseGround(entry?.groundSection),
    about: normaliseAbout(entry?.aboutSection),
    planTrip: normalisePlanTrip(entry?.planTripSection),
    packages: normalisePackages(entry?.packagesSection),
    faq: normaliseFaq(entry?.faqSection),
    meta: {
      title: text(entry?.metaTitle),
      description: text(entry?.metaDescription),
    },
  };
}

/* The three fields every section heading carries. */
const heading = (section) => ({
  eyebrow: text(section?.eyebrow),
  title: text(section?.title),
  description: text(section?.description),
});

/* undefined for an empty list, so the component keeps its own fallback rather
   than rendering an empty grid. */
const cards = (items, map) => (items.length ? items.map(map) : undefined);

function normaliseHero(section, cardImage) {
  if (!section) return {};

  return {
    ...heading(section),
    /* Three deep, most specific first: the country's own hero upload, then the
       tile the parent region's grid shows for it, then the design still. The
       middle one is why every country stopped opening on the same Kerala
       backwater — see getCountryCardImage in lib/strapi/destination.js. */
    image: mediaUrl(section.image, cardImage ?? COUNTRY_DEFAULTS.hero),
    imageAlt: mediaAlt(section.image, text(section.title, "")),
    /* undefined for "default", so PageHero draws its own layered scrim. */
    overlayClassName: HERO_OVERLAYS[section.overlay],
    ctas: [
      cta(section.primaryCtaLabel, section.primaryCtaLink),
      cta(section.secondaryCtaLabel, section.secondaryCtaLink),
    ].filter(Boolean),
  };
}

function normaliseIntro(section) {
  if (!section) return {};

  return {
    ...heading(section),
    image: mediaUrl(section.image, COUNTRY_DEFAULTS.intro),
    imageAlt: mediaAlt(section.image, text(section.title, "")),
  };
}

function normaliseRegions(section) {
  if (!section) return {};

  return {
    ...heading(section),
    regions: cards(list(section.regions), (region, index) => ({
      title: text(region.title, ""),
      subtitle: text(region.subtitle),
      description: text(region.description),
      image: mediaUrl(region.image, fallbackCard(index)),
    })),
  };
}

function normaliseGlance(section) {
  if (!section) return {};

  return {
    ...heading(section),
    /* [] rather than undefined: AtAGlanceSection defaults `stats` to [] and
       maps over it, so an empty strip is the correct empty state here. */
    stats: list(section.stats).map((stat) => ({
      label: text(stat.label, ""),
      value: text(stat.value, ""),
    })),
  };
}

/* The heading and its rows come back as two props rather than one, because the
   design runs the heading inside a Container and the rows full-bleed beneath
   it — see the page body. */
function normaliseGround(section) {
  if (!section) return {};

  return {
    heading: {
      eyebrow: text(section.eyebrow),
      title: text(section.title),
    },
    rows: cards(list(section.rows), (row, index) => ({
      /* FeatureRows keys on this. Nothing in the CMS is guaranteed unique, so
         the index is what keeps two identically-titled rows apart. */
      key: `row-${index}`,
      eyebrow: text(row.eyebrow),
      title: text(row.title),
      description: text(row.description),
      ctaLabel: text(row.ctaLabel),
      ctaHref: text(row.ctaLink),
      image: mediaUrl(row.image, fallbackCard(index)),
      alt: mediaAlt(row.image, text(row.title, "")),
    })),
  };
}

function normaliseAbout(section) {
  if (!section) return {};

  return {
    ...heading(section),
    features: cards(list(section.features), (feature) => ({
      title: text(feature.title, ""),
      body: text(feature.body),
    })),
  };
}

/* The enquiry wizard. Flat rather than nested: the component reads a question
   and its chips as two separate props, and the CMS stores the chips one per
   line. splitLines is the whole conversion.
 *
 * Shares the `continent.plan-trip` component, so the wizard's forty labels are
 * defined once and a country entry edits the same fields a region entry does.
 * Kept in step with normalisePlanTrip in lib/strapi/destination.js. */
function normalisePlanTrip(section) {
  if (!section) return {};

  return {
    ...heading(section),
    backgroundImage: mediaUrl(section.backgroundImage, null),
    stepWordLabel: text(section.stepWordLabel),
    stepLabels: [
      text(section.stepOneLabel),
      text(section.stepTwoLabel),
      text(section.stepThreeLabel),
      text(section.stepFourLabel),
    ],
    questions: {
      destination: text(section.destinationQuestion),
      dates: text(section.datesQuestion),
      duration: text(section.durationQuestion),
      travellers: text(section.travellersQuestion),
      interests: text(section.interestsQuestion),
      special: text(section.specialQuestion),
    },
    options: {
      destination: splitLines(section.destinationOptions),
      duration: splitLines(section.durationOptions),
      travellers: splitLines(section.travellerOptions),
      interests: splitLines(section.interestOptions),
    },
    labels: {
      arriving: text(section.arrivingLabel),
      returning: text(section.returningLabel),
      message: text(section.messageLabel),
      messagePlaceholder: text(section.messagePlaceholder),
      name: text(section.nameLabel),
      namePlaceholder: text(section.namePlaceholder),
      email: text(section.emailLabel),
      emailPlaceholder: text(section.emailPlaceholder),
      phone: text(section.phoneLabel),
      phonePlaceholder: text(section.phonePlaceholder),
      back: text(section.backLabel),
      continue: text(section.continueLabel),
      submit: text(section.submitLabel),
    },
    reassuranceText: text(section.reassuranceText),
    successTitle: text(section.successTitle),
    successMessage: text(section.successMessage),
  };
}

/* The fixed-departure carousel, shared with the region pages — a country that
   sells a set departure advertises it here rather than in prose.
 *
 * Uses the same `continent.packages` component the region pages do, so this
 * mirrors normalisePackages in lib/strapi/destination.js field for field and
 * the two must be kept in step. PackageCard renders `meta` and `experiences`
 * as plain strings, so the CMS's separate duration / places fields are joined
 * here rather than in the component. */
function normalisePackages(section) {
  if (!section) return {};

  return {
    ...heading(section),
    ctaLabel: text(section.ctaLabel),
    ctaHref: text(section.ctaLink),
    experiencesLabel: text(section.experiencesLabel),
    items: cards(list(section.packages), (pkg, index) => ({
      id: slugify(pkg.title) || `package-${pkg.id ?? index}`,
      title: text(pkg.title, ""),
      meta: joinParts([
        text(pkg.duration),
        ...splitList(pkg.places),
      ]).toUpperCase(),
      experiences: joinParts(splitList(pkg.experiences)),
      href: text(pkg.link),
      image: mediaUrl(pkg.image, fallbackCard(index)),
      alt: mediaAlt(pkg.image, text(pkg.title, "")),
    })),
  };
}

function normaliseFaq(section) {
  if (!section) return {};

  return {
    eyebrow: text(section.eyebrow),
    title: text(section.title),
    contactInfo: text(section.contactInfo),
    /* [] rather than undefined: FaqSection itself checks `faqs.length` and
       renders nothing when the CMS has none, so an empty array is what
       hides the section rather than what leaves an empty accordion up. */
    faqs: list(section.faqs).map((faq) => ({
      question: text(faq.question, ""),
      answer: text(faq.answer, ""),
    })),
  };
}

/* One chip per line. Blank lines are dropped so a trailing newline in the
   textarea does not become an empty chip. undefined for an empty field, which
   is what leaves the wizard on its own list. */
function splitLines(value) {
  const lines = text(value, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length ? lines : undefined;
}
