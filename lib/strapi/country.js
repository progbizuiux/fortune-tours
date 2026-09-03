import { StrapiError, strapiFetch } from "./client";
import { getCountryCardImage } from "./destination";
import { mediaAlt, mediaUrl } from "./media";
import { cta, joinParts, list, slugify, splitList, text } from "./normalise";
import { destinationOptionsFor } from "@/lib/planMyTrip";
import { homeRegionForCountry, regionKeysForCountry } from "@/lib/navigation";

/* Country pages (/africa/botswana and its siblings) — query, cache tags and
 * the CMS→props normaliser.
 *
 * WHICH COUNTRY a URL means: the last segment is the country's `slug`, and the
 * segment before it must be a region that LISTS that country in
 * lib/navigation.js. A country sits under several regions there — Mauritius
 * under Africa, Asia and the Indian Ocean — and its one Strapi entry serves
 * every one of those URLs, so /africa/mauritius, /asia/mauritius and
 * /indian-ocean/mauritius all render the same page while /europe/mauritius
 * still 404s. The entry's own `continentSlug` names the canonical URL among
 * them (see `canonicalPath`), so search engines index one copy. An editor can
 * still publish a new country without a deployment.
 *
 * EVERY WORD on the page comes from here. The section components are
 * shape-only and take their copy as props, so a field left empty in the CMS
 * falls through to the design's own line rather than rendering a hole — the
 * same contract the Kerala and continent pages use.
 */

export const COUNTRY_TAGS = ["country", "countries", "destinations"];

/* One rule per section. Each repeatable list inside a section needs its own
   rule, because `populate: "*"` reaches one level only. */
const COUNTRY_QUERY = (slug) => ({
  /* By slug alone — the URL's region segment is validated against
     lib/navigation.js instead, so one entry answers under every region that
     lists the country. */
  filters: {
    slug: { $eq: slug },
  },
  /* Oldest first, so a duplicated slug resolves the same way every time. */
  sort: ["publishedAt:asc", "id:asc"],
  pagination: { pageSize: 10 },
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
async function fetchCountry(slug, preferredRegion) {
  let json;
  try {
    json = await strapiFetch("countries", {
      query: COUNTRY_QUERY(slug),
      tags: COUNTRY_TAGS,
    });
  } catch (error) {
    if (error instanceof StrapiError && error.status === 404) return null;
    throw error;
  }

  /* Slugs are not unique across regions in Strapi, so if two entries share
     one, the entry whose own region is the URL's wins; otherwise the first
     returned — deterministic thanks to the sort in COUNTRY_QUERY. */
  const entries = list(json?.data);
  return (
    entries.find((entry) => text(entry.continentSlug) === preferredRegion) ??
    entries[0] ??
    null
  );
}

/* The region an entry's page canonically lives under — see
   homeRegionForCountry() in lib/navigation.js for the blank-field rule. */
const homeRegionOf = (entry) =>
  homeRegionForCountry(text(entry?.slug, ""), text(entry?.continentSlug));

/**
 * Fetch and normalise one country page.
 * @returns the props tree, or null when no published entry matches.
 */
export async function getCountryPage(continentSlug, slug) {
  if (!continentSlug || !slug) return null;

  const entry = await fetchCountry(slug, continentSlug);
  if (!entry) return null;

  /* The region the entry itself names — the canonical one, and always a
     valid URL for the page even when the navbar's lists do not know the
     slug (Strapi says `maldives`, the navbar says `the-maldives`). */
  const homeRegion = homeRegionOf(entry);

  /* Beyond that, the region segment has to be one the navbar lists this
     country under, or the URL is not a page: /europe/mauritius 404s even
     though the entry exists. */
  if (
    continentSlug !== homeRegion &&
    !regionKeysForCountry(slug).includes(continentSlug)
  )
    return null;

  /* Only worth a second request when the country has no hero picture of its
     own — which is the state every country is in until someone uploads one,
     and none once they have. The tile comes from the grid of the region the
     reader is browsing, falling back to the home region's grid. */
  const cardImage = entry.heroSection?.image
    ? null
    : ((await getCountryCardImage(continentSlug, slug)) ??
      (continentSlug === homeRegion
        ? null
        : await getCountryCardImage(homeRegion, slug)));

  return normaliseCountry(entry, cardImage, continentSlug, homeRegion);
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

    /* One row per URL, not per entry: a published country is a page under
       EVERY region lib/navigation.js lists it in, so Mauritius yields
       africa, asia and indian-ocean rows. The entry's own region is kept
       even if the lists ever drop it, so its canonical URL always builds.
       Consumers that build a "published" set from this (the navbar, the
       A to Z, /search) therefore see every alias as live. */
    const rows = [];
    for (const entry of list(json?.data)) {
      const country = text(entry.slug);
      if (!country) continue;

      /* The home region leads and is flagged, so publishedCountrySet() in
         lib/navigation.js can tell the canonical URL from its aliases. */
      const home = homeRegionOf(entry);
      const regions = new Set([
        ...(home ? [home] : []),
        ...regionKeysForCountry(country),
      ]);
      for (const slug of regions)
        rows.push({ slug, country, canonical: slug === home });
    }
    return rows;
  } catch (error) {
    if (error instanceof StrapiError) return [];
    throw error;
  }
}

/* ── normalisers ───────────────────────────────────────────────────────── */

export function normaliseCountry(entry, cardImage, continentSlug, homeRegion) {
  const slug = text(entry?.slug, "");
  const home = homeRegion ?? homeRegionOf(entry) ?? continentSlug;

  return {
    name: text(entry?.name),
    /* Where this page canonically lives — the entry's own region — for the
       <link rel="canonical"> on every alias URL. */
    canonicalPath: home && slug ? `/${home}/${slug}` : undefined,
    hero: normaliseHero(entry?.heroSection, cardImage),
    intro: normaliseIntro(entry?.introSection),
    regions: normaliseRegions(entry?.regionsSection),
    glance: normaliseGlance(entry?.glanceSection),
    ground: normaliseGround(entry?.groundSection),
    about: normaliseAbout(entry?.aboutSection),
    planTrip: normalisePlanTrip(entry?.planTripSection, {
      regionKey: continentSlug ?? text(entry?.continentSlug),
      country: text(entry?.name),
    }),
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
/* The destination chips default to the places inside this country
   (lib/countryPlaces.js — Chobe, Kasane, the Okavango Delta … on
   /africa/botswana), or to the country and the rest of its region where no
   places are listed. The CMS field still wins where an editor has filled it,
   and the list is returned even when the whole section is unfilled, because
   the component's own fallback is the design's fixed six. */
function normalisePlanTrip(section, scope) {
  const destinations = destinationOptionsFor(scope);
  if (!section) return { options: { destination: destinations } };

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
      destination: splitLines(section.destinationOptions) ?? destinations,
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
