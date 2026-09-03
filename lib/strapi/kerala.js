import { StrapiError, strapiFetch } from "./client";
import { mediaAlt, mediaUrl } from "./media";
import {
  cta,
  joinParts,
  list,
  slugify,
  splitList,
  splitMarkdown,
  text,
} from "./normalise";

/* Destination landing pages — query, cache tags, and the CMS→props normaliser.
 *
 * One design, many destinations. The content type is still called
 * `kerala-pages` because Kerala was the first entry, but it is generic: every
 * entry is a destination page and /destinations/[slug] renders whichever one
 * the slug resolves to.
 *
 * The normaliser is the layer worth having. Components upstream keep taking
 * the props they already took; everything Strapi-shaped (nested components,
 * media objects, `duration` + `places` needing to become one meta line) is
 * flattened here. Without it those conversions scatter across the section
 * files and every schema change becomes a hunt.
 *
 * Every field falls back to the copy the page shipped with, so a field an
 * editor has not filled in yet renders the original design rather than a gap.
 * A failed REQUEST is different and deliberately not caught — see client.js.
 */

export const KERALA_TAGS = ["kerala-page", "destinations"];

/* Media lives on components that also carry text, so `populate: "*"` on the
   section covers one level — but the repeatable inner lists (places, features,
   packages, faqs) each need their own rule or they come back missing. Spelled
   as an object so it stays readable; see lib/strapi/query.js. */
const KERALA_QUERY = {
  populate: {
    backgroundImage: true,
    introSection: { populate: "*" },
    shortlistSection: { populate: { places: { populate: "*" } } },
    highlightsSection: { populate: "*" },
    whySection: { populate: { features: { populate: "*" } } },
    packagesSection: { populate: { packages: { populate: "*" } } },
    faqSection: { populate: { faqs: { populate: "*" } } },
    travellerTypesSection: { populate: { cards: { populate: "*" } } },
    /* Deliberately "*" rather than a rule naming seasons.cards.
       Strapi rejects a populate path whose field it does not have — a 400
       naming the key, which takes the whole page down — and `cards` was added
       to sections.kerala-season after this panel was deployed. "*" asks for
       whatever the season holds, so it works against both versions.

       The cost is that card media stays unpopulated (one level only), so the
       cards fall back to the pictures the section shipped with. Once the
       backend carrying kerala-season-card is deployed, this can become
       `seasons: { populate: { cards: { populate: "*" } } }` and uploads will
       come through. */
    timingSection: { populate: { seasons: { populate: "*" } } },
  },
};

/* The images the page shipped with, used wherever the CMS media field is still
   empty — which is currently all of them. Ordered to match the CMS lists, so
   entry N keeps the picture the design paired it with. */
const FALLBACK = {
  heroImage: "/destinations/kerala/kerala.avif",
  introImage: "/destinations/kerala/house-boat.avif",
  placeImages: [
    "/destinations/kerala/hill-stations.avif",
    "/destinations/kerala/house-boat.avif",
    "/destinations/kerala/adventure-nature.avif",
    "/destinations/kerala/wildlife.avif",
    "/destinations/kerala/beaches.avif",
  ],
  highlightImages: [
    "/destinations/kerala/dancer-performing.png",
    "/destinations/kerala/elephants-sri-lanka.jpg",
    "/destinations/kerala/people-practicing.jpg",
    "/destinations/kerala/houseboat-alappuzha.jpg",
  ],
  /* Display sizes, not the files' native pixels — the four source PNGs are
     45x45, 51x51, 45x45 and 38x34, normalised to a common 42px optical
     height. Carried over from WhyTravelSection verbatim. */
  featureIcons: [
    { icon: "/destinations/kerala/icons/goggle.png", iconWidth: 42, iconHeight: 42 },
    { icon: "/destinations/kerala/icons/climb.png", iconWidth: 42, iconHeight: 42 },
    { icon: "/destinations/kerala/icons/diamond.png", iconWidth: 42, iconHeight: 42 },
    { icon: "/destinations/kerala/icons/support.png", iconWidth: 47, iconHeight: 42 },
  ],
  packageImages: [
    "/destinations/kerala/food-culinary.jpg",
    "/destinations/kerala/wildlife.avif",
    "/destinations/kerala/houseboat-alappuzha.jpg",
  ],
  /* Season cards are picture-led, so one is needed the moment a season names a
     card at all. Ordered as the shipped section had them, season by season. */
  seasonImages: [
    "/destinations/kerala/adventure-nature.avif",
    "/destinations/kerala/beaches.avif",
    "/destinations/kerala/hill-stations.avif",
    "/destinations/kerala/house-boat.avif",
    "/destinations/kerala/wildlife.avif",
    "/destinations/kerala/ayurveda-wellness.jpg",
  ],
  travellerImages: [
    "/destinations/kerala/house-boat.avif",
    "/destinations/kerala/hill-stations.avif",
    "/destinations/kerala/beaches.avif",
    "/destinations/kerala/adventure-nature.avif",
    "/destinations/kerala/culture-heritage.jpg",
    "/destinations/kerala/ayurveda-wellness.jpg",
    "/destinations/kerala/food-culinary.jpg",
    "/destinations/kerala/wildlife.avif",
  ],
};

/**
 * The URL slug for an entry, derived from its `internalName`.
 *
 * Editors name entries for the admin list ("Kerala Page v2"), not for the URL
 * bar, so a trailing "Page"/version is dropped before slugifying. That is what
 * keeps /destinations/kerala at the address the navbar already points to, and
 * gives the India entry the /destinations/india slug the home page has been
 * linking to all along.
 *
 * The tradeoff of deriving rather than storing: renaming an entry moves its
 * URL. Add a real `slug` field to the content type if that becomes a problem.
 */
export function destinationSlug(internalName) {
  return slugify(text(internalName, "").replace(/\s+page(\s+v\d+)?$/i, ""));
}

/* Every entry, once, so the slug transform can run in JS. Strapi cannot filter
   on a derived value, and a startsWith filter would break the moment an entry
   is named something the prefix does not match. A handful of destination pages
   makes one small request cheaper than the fragility. */
async function fetchEntries(query) {
  const json = await strapiFetch("kerala-pages", {
    query: { ...query, pagination: { pageSize: 100 } },
    tags: KERALA_TAGS,
  });

  return Array.isArray(json?.data) ? json.data : [];
}

/** Every destination slug the CMS holds — for generateStaticParams. */
export async function getDestinationSlugs() {
  /* [] rather than a throw on any Strapi failure — unset STRAPI_API_URL,
     unreachable panel, missing collection. This runs inside `next build`
     ("Collecting page data"), where a throw fails the whole build; with an
     empty list the route still exists and renders each slug on demand. The
     same contract getCountryParams() in ./country.js keeps. */
  try {
    const entries = await fetchEntries({ fields: ["internalName"] });
    return entries.map((e) => destinationSlug(e.internalName)).filter(Boolean);
  } catch (error) {
    if (error instanceof StrapiError) return [];
    throw error;
  }
}

/**
 * Fetch and normalise one destination page.
 * @returns the props tree, or null when no published entry has that slug.
 */
export async function getDestinationPage(slug) {
  const entries = await fetchEntries(KERALA_QUERY);
  const entry = entries.find((e) => destinationSlug(e.internalName) === slug);

  return entry ? normaliseKeralaPage(entry) : null;
}

export function normaliseKeralaPage(entry) {
  return {
    hero: normaliseHero(entry),
    intro: normaliseIntro(entry.introSection),
    mustVisit: normaliseMustVisit(entry.shortlistSection),
    highlights: normaliseHighlights(entry.highlightsSection),
    why: normaliseWhy(entry.whySection),
    packages: normalisePackages(entry.packagesSection),
    journeys: normaliseTravellerTypes(entry.travellerTypesSection),
    seasons: normaliseTiming(entry.timingSection),
    faq: normaliseFaq(entry.faqSection),
  };
}

/* ── sections ──────────────────────────────────────────────────────────── */

function normaliseHero(entry) {
  /* Two CMS fields, one <h1>. Joined rather than kept apart: the heading wraps
     on its own at every breakpoint, and a hard break between the lines is not
     what the design does. */
  const title = [text(entry.titleLine1), text(entry.titleLine2)]
    .filter(Boolean)
    .join(" ");

  return {
    eyebrow: text(entry.eyebrow),
    title: title || undefined,
    description: text(entry.description),
    image: mediaUrl(entry.backgroundImage, FALLBACK.heroImage),
    imageAlt: mediaAlt(
      entry.backgroundImage,
      "Kerala backwaters with palm trees and a boat",
    ),
    ctas: [
      cta(entry.primaryCtaLabel, entry.primaryCtaLink, "#packages"),
      cta(entry.secondaryCtaLabel, entry.secondaryCtaLink, "/plan-my-trip"),
    ].filter(Boolean),
  };
}

function normaliseIntro(section) {
  if (!section) return {};

  /* The CMS field is markdown. There is no markdown renderer in this project
     and one section does not justify adding one, so the two constructs the
     copy actually uses are handled directly: blank-line paragraph splits, and
     a leading bold line. That bold line maps onto the standfirst the design
     already has above the body copy. */
  const { lead, paragraphs } = splitMarkdown(section.description);

  return {
    eyebrow: text(section.label),
    title: text(section.title),
    lead,
    paragraphs: paragraphs.length ? paragraphs : undefined,
    ctaLabel: text(section.ctaLabel),
    ctaHref: text(section.ctaLink),
    image: mediaUrl(section.image, FALLBACK.introImage),
    imageAlt: mediaAlt(
      section.image,
      "House boat cruising Kerala backwaters at sunrise",
    ),
  };
}

function normaliseMustVisit(section) {
  if (!section) return {};

  const places = list(section.places);

  return {
    eyebrow: text(section.label),
    title: text(section.title),
    description: text(section.description),
    items: places.length
      ? places.map((place, i) => ({
          key: slugify(place.title) || `place-${place.id ?? i}`,
          title: text(place.title, ""),
          description: text(place.description, ""),
          image: mediaUrl(
            place.image,
            FALLBACK.placeImages[i % FALLBACK.placeImages.length],
          ),
          alt: mediaAlt(place.image, text(place.title, "")),
        }))
      : undefined,
  };
}

function normaliseHighlights(section) {
  if (!section) return {};

  /* The component draws three copy blocks and four pictures, and the CMS
     mirrors that with numbered fields rather than a repeatable list. Collapsed
     into arrays here so the component can map instead of reading eyebrow1,
     eyebrow2 and eyebrow3 by hand. */
  const blocks = [1, 2, 3].map((n) => {
    const block = {
      eyebrow: text(section[`eyebrow${n}`]),
      title: text(section[`title${n}`]),
      description: text(section[`description${n}`]),
    };
    return block.eyebrow || block.title || block.description ? block : null;
  });

  const images = [1, 2, 3, 4].map((n) =>
    mediaUrl(section[`image${n}`], FALLBACK.highlightImages[n - 1]),
  );

  return {
    eyebrow: text(section.label),
    title: text(section.title),
    blocks,
    images,
  };
}

function normaliseWhy(section) {
  if (!section) return {};

  const features = list(section.features);

  return {
    eyebrow: text(section.label),
    title: text(section.title),
    description: text(section.description),
    items: features.length
      ? features.map((feature, i) => {
          const preset = FALLBACK.featureIcons[i % FALLBACK.featureIcons.length];
          return {
            key: slugify(feature.title) || `feature-${feature.id ?? i}`,
            icon: mediaUrl(feature.icon, preset.icon),
            iconWidth: preset.iconWidth,
            iconHeight: preset.iconHeight,
            title: text(feature.title, ""),
            lead: text(feature.subtitle, ""),
            body: text(feature.description, ""),
          };
        })
      : undefined,
  };
}

function normalisePackages(section) {
  if (!section) return {};

  const packages = list(section.packages);

  return {
    eyebrow: text(section.label),
    title: text(section.title),
    description: text(section.description),
    ctaLabel: text(section.ctaLabel),
    ctaHref: text(section.ctaLink),
    items: packages.length
      ? packages.map((pkg, i) => ({
          id: slugify(pkg.title) || `package-${pkg.id ?? i}`,
          title: text(pkg.title, ""),
          /* The card's meta line is one uppercase dot-separated run; the CMS
             keeps duration and the place list apart, which is the right way to
             store it. Joined here rather than asking editors to type dots. */
          meta: joinParts([
            text(pkg.duration),
            ...splitList(pkg.places),
          ]).toUpperCase(),
          experiences: joinParts(splitList(pkg.experiences)),
          image: mediaUrl(
            pkg.image,
            FALLBACK.packageImages[i % FALLBACK.packageImages.length],
          ),
          alt: mediaAlt(pkg.image, text(pkg.title, "")),
        }))
      : undefined,
  };
}
/* Traveller types — the "pick a starting point" carousel.
 *
 * Heading only, in the common case. The cards this section draws are the eight
 * travel styles, which are their own collection type and already reach the
 * component through /api/travel-styles; duplicating them per destination entry
 * would mean editing the same eight cards on every page. So `cards` is left as
 * the override it is: fill it on an entry and that entry draws its own set,
 * leave it empty and every destination shares the travel styles.
 */
function normaliseTravellerTypes(section) {
  if (!section) return {};

  const cards = list(section.cards);

  return {
    eyebrow: text(section.label),
    title: text(section.title),
    description: text(section.description),
    items: cards.length
      ? cards.map((card, i) => ({
          key: slugify(card.title) || `traveller-${card.id ?? i}`,
          label: text(card.title, ""),
          description: text(card.description, ""),
          href: text(card.link),
          image: mediaUrl(
            card.image,
            FALLBACK.travellerImages[i % FALLBACK.travellerImages.length],
          ),
          alt: mediaAlt(card.image, text(card.title, "")),
        }))
      : undefined,
  };
}

/* Timing — the tabbed season section.
 *
 * One CMS season becomes one tab, and TabbedCardsSection wants its cards keyed
 * by that tab. Three shapes are accepted, in order, because the entries are at
 * three different stages of being filled in:
 *
 *   1. the season's own `cards` — the field the design actually wants, added to
 *      sections.kerala-season for this;
 *   2. failing that, the season's title and description as a single card, which
 *      is what the India entry holds today (Sep-Oct → Kashmir) and is worth
 *      rendering rather than discarding;
 *   3. failing both, nothing — and if no season produced a card at all, the
 *      whole tab set is dropped so the component keeps the copy it shipped
 *      with, rather than drawing empty tabs. That is the Kerala entry, whose
 *      seasons carry months and nothing else.
 *
 * The tab's `name` is the overlay word on each card. Taken from the first word
 * of the months range ("September – March" → "September"), which is what the
 * shipped section did by hand.
 */
function normaliseTiming(section) {
  if (!section) return {};

  const seasons = list(section.seasons);
  const heading = {
    eyebrow: text(section.label),
    title: text(section.title),
    description: text(section.description),
  };

  const tabs = [];
  const cardsData = {};
  let imageIndex = 0;

  seasons.forEach((season, i) => {
    const months = text(season.months, "");
    const key = slugify(months) || `season-${season.id ?? i}`;
    const cards = list(season.cards);

    const items = cards.length
      ? cards.map((card) => ({
          title: text(card.title, ""),
          meta: text(card.meta, ""),
          href: text(card.link),
          image: mediaUrl(
            card.image,
            FALLBACK.seasonImages[imageIndex++ % FALLBACK.seasonImages.length],
          ),
        }))
      : [text(season.title), text(season.description)].some(Boolean)
        ? [
            {
              title: text(season.title, months),
              meta: text(season.description, ""),
              image:
                FALLBACK.seasonImages[
                  imageIndex++ % FALLBACK.seasonImages.length
                ],
            },
          ]
        : [];

    if (!items.length) return;

    tabs.push({
      key,
      label: months,
      name: months.split(/[\s–—-]+/)[0] || months,
    });
    cardsData[key] = items;
  });

  return tabs.length ? { ...heading, tabs, cardsData } : heading;
}

/* FAQ — the accordion and the contact block beside it.
 *
 * Answers are richtext. splitMarkdown drops the emphasis markers and gives back
 * paragraphs, the same treatment the intro copy gets, so an answer written with
 * a blank line in it renders as two paragraphs instead of one run-on.
 */
function normaliseFaq(section) {
  if (!section) return {};

  const faqs = list(section.faqs);

  return {
    eyebrow: text(section.label),
    title: text(section.title),
    description: text(section.description),
    contactTitle: text(section.contactTitle),
    contactSubtitle: text(section.contactSubtitle),
    phone: text(section.phone),
    email: text(section.email),
    items: faqs.length
      ? faqs.map((faq, i) => {
          const { lead, paragraphs } = splitMarkdown(faq.answer);
          return {
            key: slugify(faq.question) || `faq-${faq.id ?? i}`,
            question: text(faq.question, ""),
            answer: [lead, ...paragraphs].filter(Boolean),
          };
        })
      : undefined,
  };
}
