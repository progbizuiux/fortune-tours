import { DESTINATION_REGIONS } from "@/lib/navigation";
import { destinationOptionsFor } from "@/lib/planMyTrip";
import { StrapiError, strapiFindOne } from "./client";
import { mediaAlt, mediaUrl } from "./media";
import { cta, joinParts, list, slugify, splitList, text } from "./normalise";

/* Destination region pages (/africa, /asia, /europe …) — query, cache tags and
 * the CMS→props normaliser.
 *
 * WHICH SLUGS EXIST is answered locally, from DESTINATION_REGIONS in
 * lib/navigation.js — the same list the navbar's Destinations menu draws. That
 * keeps the route's allowlist and the menu that links into it from ever
 * disagreeing, and it means /africa resolves even before the CMS entry is
 * written. Anything not in that list is a 404, so this dynamic segment sitting
 * at the root of the app cannot swallow paths that belong to other pages.
 *
 * WHAT IS ON A PAGE comes from Strapi. The content type mirrors `homepages`:
 * a `slug` matching the region key, and a DYNAMIC ZONE named `sections` whose
 * first block is `sections.hero` — deliberately the same component the home
 * page's hero already uses, because it is the same section (see
 * components/common/PageHero.jsx). Adding the rest of the page's sections is
 * then a new entry in BLOCK_POPULATE plus a normaliser below, not a new query.
 *
 * Every field falls back to the copy the design shipped with, so a region whose
 * entry is empty — or not written yet — renders the design rather than a hole.
 */

export const DESTINATION_TAGS = ["destination-page", "destinations"];

/* One rule per section. Named components rather than a dynamic zone, so each
   one is a field on the entry — and each repeatable list inside a section
   needs its own rule, because `populate: "*"` reaches one level only. */
const CONTINENT_QUERY = (slug) => ({
  filters: { slug: { $eq: slug } },
  populate: {
    heroSection: { populate: "*" },
    introSection: { populate: { image: true, places: true } },
    countriesSection: { populate: { countries: { populate: "*" } } },
    whyUsSection: { populate: { reasons: true } },
    experiencesSection: { populate: { experiences: { populate: "*" } } },
    journalSection: { populate: { articles: { populate: "*" } } },
    planTripSection: { populate: "*" },
    highlightsSection: { populate: { places: { populate: "*" } } },
    storiesSection: { populate: { stories: { populate: "*" } } },
    packagesSection: { populate: { packages: { populate: "*" } } },
  },
});

/* The hero's copy in the design frame, used until an editor fills the entry.
   Generic on purpose — that is what the frame draws, and the region's own line
   is what the CMS is there to supply. `region` is passed to every default
   below, so switching these to name the region is a one-line change. */
const HERO_DEFAULTS = {
  eyebrow: "Explore the world",
  title: "Destinations that inspire you to go further.",
  description:
    "Discover remarkable places, unforgettable landscapes and experiences curated for the way you love to travel.",
  primaryCtaLabel: "Explore Destinations",
  secondaryCtaLabel: "Plan Your Journey",
  secondaryCtaLink: "/itinerary",
};

/* No region photographs are in the repo — the design's are stock and the CMS
   media field is where they land. Until then the hero falls back to the home
   page's footage rather than to a black frame: it is the same full-bleed
   background under the same scrim, so the section reads as designed, and the
   moment `backgroundImage` is uploaded it becomes the still the frame calls
   for. Nothing else has to change when it does. */
const FALLBACK_VIDEO = "/home-banner-asset/hero-bg.mov";

/* The intro section's copy in the design frame.
 *
 * The eyebrow and the heading are templated on the region's name, because the
 * frame's own lines are ("Discover Africa" / "Africa is not one trip…") — so
 * they read correctly on all thirteen pages, and reproduce the frame exactly on
 * the one it was drawn for.
 *
 * The story and the place list cannot be templated: they are prose about a
 * particular part of the world, which is the whole reason the CMS holds them.
 * Africa's are the frame's, verbatim, and a region with no entry yet renders
 * the heading and the photograph without them — the section is built to leave
 * either one out. Add a region here to give it copy before its CMS entry
 * exists; the CMS wins over anything in this map. */
const introDefaults = (region) => ({
  eyebrow: `Discover ${region.label}`,
  title: `${region.label} is not one trip. It is a dozen different ones.`,
  ...(INTRO_COPY[region.key] ?? {}),
});

const INTRO_COPY = {
  africa: {
    description:
      "Kenya's Masai Mara delivers the raw theatre of the wild — lion prides, elephant herds and the spectacle of the Great Migration. South Africa moves between dramatic coastline, wine-country estates and Big Five reserves. Victoria Falls answers with sheer, thundering scale. Tanzania's Serengeti stretches without horizon. Egypt layers five thousand years onto every landscape. Mauritius and the Seychelles offer the other side of the continent — reef-rich water and unhurried island time. Fortune Tours builds these destinations individually, or weaves multiple countries into one itinerary shaped around how much time you have and what draws you most.",
    places: [
      "Kenya · Masai Mara",
      "South Africa",
      "Tanzania · Serengeti",
      "Egypt · Nile",
      "Mauritius · Seychelles",
    ],
  },
};

/* The picture the section shipped with. It used to be written into
   RegionIntroSection as a literal, which meant the component ignored its own
   `image` prop and all thirteen regions drew Africa's photograph — including
   after an editor uploaded their own. The component now honours the prop and
   this is what stands in until each entry has an upload. */
const FALLBACK_INTRO_IMAGE = "/destinations/africa.png";

/* Stand-in art for any card whose CMS media field is empty. The sections each
   shipped with their own placeholder set drawn from the same handful of files;
   one list serves them all, indexed by position, so a card keeps the same
   picture between renders rather than shuffling. */
const FALLBACK_CARD_IMAGES = [
  "/destinations/kerala/wildlife.avif",
  "/destination/india.avif",
  "/destinations/kerala/elephants-sri-lanka.jpg",
  "/experiance/bali.png",
  "/experiance/paris.png",
  "/destination/japan.avif",
  "/destination/switzerland.avif",
  "/experiance/mauritius.png",
];

const FALLBACK_AVATAR = "/countries/africa/sarah.png";

/* ── slugs ─────────────────────────────────────────────────────────────── */

/** Every region slug, for generateStaticParams. */
export function getDestinationSlugs() {
  return DESTINATION_REGIONS.map((region) => region.key);
}

/** The region behind a slug, or null — which the route turns into a 404. */
export function getDestinationRegion(slug) {
  return DESTINATION_REGIONS.find((region) => region.key === slug) ?? null;
}

/* ── page ──────────────────────────────────────────────────────────────── */

/**
 * Fetch and normalise one region page.
 *
 * Always resolves to a props tree, never null: the region is known from
 * lib/navigation.js, so "Strapi has no entry for it" is a page with the
 * design's own copy, not a 404. Only an unknown SLUG is a 404, and the route
 * decides that before calling here.
 *
 * @param {{ key: string, label: string }} region
 */
export async function getDestinationPage(region) {
  const entry = await fetchContinent(region.key);

  return {
    hero: normaliseHero(entry?.heroSection, region),
    intro: normaliseIntro(entry?.introSection, region),
    countries: normaliseCountries(entry?.countriesSection),
    whyUs: normaliseWhyUs(entry?.whyUsSection),
    experiences: normaliseExperiences(entry?.experiencesSection),
    journal: normaliseJournal(entry?.journalSection),
    planTrip: normalisePlanTrip(entry?.planTripSection, region),
    highlights: normaliseHighlights(entry?.highlightsSection),
    stories: normaliseStories(entry?.storiesSection),
    packages: normalisePackages(entry?.packagesSection),
    meta: {
      title: text(entry?.metaTitle),
      description: text(entry?.metaDescription),
    },
  };
}

/* Just the country grid, for a country page that wants the tile a reader
   clicked as its own banner. Its own query rather than CONTINENT_QUERY: this
   runs on every country page, and pulling ten sections of a continent to read
   one picture out of one of them is a lot of payload to throw away. */
const CONTINENT_CARDS_QUERY = (slug) => ({
  filters: { slug: { $eq: slug } },
  fields: ["slug"],
  populate: {
    countriesSection: {
      populate: { countries: { populate: { image: true } } },
    },
  },
});

/**
 * The picture the continent's grid shows for one country, or null.
 *
 * The country pages have their own entries, and a hero image nobody has
 * uploaded yet falls through to a design still — which is how every country
 * ended up opening on the same Kerala backwater. The tile in the parent
 * region's grid is already the right photograph of the right place, chosen by
 * an editor, so it stands in until the country's own hero is filled.
 *
 * Matched on `link` first and the slugified name second. The name is the
 * obvious key and the wrong one to trust alone: "The Cook Islands" slugifies
 * to `the-cook-islands` while the entry's slug is whatever an editor typed,
 * and the link already carries the real path.
 *
 * Shares DESTINATION_TAGS, so publishing a region drops the country pages that
 * borrow its pictures along with the region page itself.
 */
export async function getCountryCardImage(continentSlug, countrySlug) {
  if (!continentSlug || !countrySlug) return null;

  let entry;
  try {
    entry = await strapiFindOne("continents", {
      query: CONTINENT_CARDS_QUERY(continentSlug),
      tags: DESTINATION_TAGS,
    });
  } catch (error) {
    /* Same reading as fetchContinent: a missing collection is "no picture",
       not a reason to take a country page down. */
    if (error instanceof StrapiError && error.status === 404) return null;
    throw error;
  }

  const cards = list(entry?.countriesSection?.countries);
  const wanted = `/${continentSlug}/${countrySlug}`;

  const match =
    cards.find((card) => text(card.link, "").replace(/\/$/, "") === wanted) ??
    cards.find((card) => slugify(text(card.name, "")) === countrySlug);

  return match ? mediaUrl(match.image, null) : null;
}

/* The entry, or null when there is none — so every normaliser below reads the
   same way whether the entry exists, is empty, or the collection has not
   reached this Strapi yet. */
async function fetchContinent(slug) {
  try {
    return await strapiFindOne("continents", {
      query: CONTINENT_QUERY(slug),
      tags: DESTINATION_TAGS,
    });
  } catch (error) {
    /* A 404 here is the collection type not existing yet, which is where the
       backend stands today. That is the same "no content" state as an empty
       collection, so it renders the design rather than taking the page down —
       and unlike a transport failure it will not fix itself on a retry.

       Every other failure still throws, which is what keeps ISR honest: a
       regeneration that throws leaves Next serving the last good render
       instead of caching a stripped page. See lib/strapi/client.js. */
    if (error instanceof StrapiError && error.status === 404) return null;
    throw error;
  }
}

/* ── blocks ────────────────────────────────────────────────────────────── */

function normaliseHero(block, region) {
  const image = mediaUrl(block?.backgroundImage, null);

  return {
    eyebrow: text(block?.eyebrow, HERO_DEFAULTS.eyebrow),
    title: text(block?.title, HERO_DEFAULTS.title),
    description: text(block?.description, HERO_DEFAULTS.description),
    /* PageHero takes one background or the other. Only fall back to the video
       when the CMS has no still — passing both would stack them. */
    image,
    video: image ? undefined : FALLBACK_VIDEO,
    imageAlt: mediaAlt(block?.backgroundImage, `Travelling in ${region.label}`),
    ctas: [
      cta(
        text(block?.primaryCtaLabel, HERO_DEFAULTS.primaryCtaLabel),
        block?.primaryCtaLink,
        /* /search is the one live route that takes any place name today, the
           same landing the Destinations menu uses — see lib/navigation.js. */
        `/search?term=${encodeURIComponent(region.label)}`,
      ),
      cta(
        text(block?.secondaryCtaLabel, HERO_DEFAULTS.secondaryCtaLabel),
        block?.secondaryCtaLink,
        HERO_DEFAULTS.secondaryCtaLink,
      ),
    ].filter(Boolean),
  };
}

/* Every section below returns only what the CMS holds: an unfilled field comes
   back undefined and the component falls through to the copy it shipped with,
   the same contract the Kerala page sections use. That is what lets this run
   against a Strapi that does not have the Continent type yet — fetchContinent
   returns null, every normaliser sees undefined, and all thirteen pages render
   exactly as they did before.

   The one exception is a list: an entry with no cards returns undefined rather
   than [], because an empty array would draw an empty carousel where the
   fallback would have drawn the design. */
const heading = (section) => ({
  eyebrow: text(section?.eyebrow),
  title: text(section?.title),
  description: text(section?.description),
});

/* undefined for an empty list, so the component keeps its own. */
const cards = (items, map) => (items.length ? items.map(map) : undefined);

function normaliseIntro(block, region) {
  const fallback = introDefaults(region);
  const places = list(block?.places);

  return {
    eyebrow: text(block?.eyebrow ?? block?.chapterLabel, fallback.eyebrow),
    title: text(block?.title ?? block?.mainTitle, fallback.title),
    description: text(block?.description, fallback.description),
    /* Places are one line each in the frame — "Kenya · Masai Mara". An editor
       can type that whole line, or keep the country and the place apart and
       let the dot be added here, which is what the Kerala packages do with
       duration and place list rather than asking anyone to type punctuation. */
    places: places.length
      ? places
          .map(
            (place) =>
              text(place.label) ??
              joinParts([text(place.name), text(place.place ?? place.tagline)]),
          )
          .filter(Boolean)
      : fallback.places,
    image: mediaUrl(block?.image, FALLBACK_INTRO_IMAGE),
    imageAlt: mediaAlt(block?.image, `Travelling in ${region.label}`),
  };
}

/* Choose your next story — the country grid. `link` is optional: without it a
   tile points at /destinations/<name>, which is what the section did on its
   own before the CMS could say otherwise. */
function normaliseCountries(section) {
  if (!section) return {};

  return {
    ...heading(section),
    viewMoreLabel: text(section.viewMoreLabel),
    destinations: cards(list(section.countries), (country, i) => ({
      key: slugify(country.name) || `country-${country.id ?? i}`,
      name: text(country.name, ""),
      href: text(country.link),
      image: mediaUrl(
        country.image,
        FALLBACK_CARD_IMAGES[i % FALLBACK_CARD_IMAGES.length],
      ),
      alt: mediaAlt(country.image, text(country.name, "")),
    })),
  };
}

/* Why Fortune Tours — the row of reasons. */
function normaliseWhyUs(section) {
  if (!section) return {};

  return {
    ...heading(section),
    features: cards(list(section.reasons), (reason, i) => ({
      key: slugify(reason.title) || `reason-${reason.id ?? i}`,
      title: text(reason.title, ""),
      body: text(reason.description, ""),
    })),
  };
}

/* Travel your way — the experience carousel. `id` is what the card's link is
   built from (/experiences/<id>), so it comes off the title when the CMS has
   no explicit link. */
function normaliseExperiences(section) {
  if (!section) return {};

  return {
    ...heading(section),
    experiences: cards(list(section.experiences), (experience, i) => ({
      id: slugify(experience.title) || `experience-${experience.id ?? i}`,
      title: text(experience.title, ""),
      subtitle: text(experience.subtitle, ""),
      description: text(experience.description, ""),
      href: text(experience.link),
      image: mediaUrl(
        experience.image,
        FALLBACK_CARD_IMAGES[i % FALLBACK_CARD_IMAGES.length],
      ),
      alt: mediaAlt(experience.image, text(experience.title, "")),
    })),
  };
}

/* Go beyond the destination — the journal row. */
function normaliseJournal(section) {
  if (!section) return {};

  return {
    ...heading(section),
    readLabel: text(section.readLabel),
    items: cards(list(section.articles), (article, i) => ({
      meta: text(article.meta, ""),
      title: text(article.title, ""),
      description: text(article.description, ""),
      href: text(article.link, "#"),
      image: mediaUrl(
        article.image,
        FALLBACK_CARD_IMAGES[i % FALLBACK_CARD_IMAGES.length],
      ),
    })),
  };
}

/* Curated for you — places worth the detour. */
function normaliseHighlights(section) {
  if (!section) return {};

  return {
    ...heading(section),
    places: cards(list(section.places), (place, i) => ({
      key: slugify(place.title) || `place-${place.id ?? i}`,
      title: text(place.title, ""),
      description: text(place.description, ""),
      href: text(place.link),
      image: mediaUrl(
        place.image,
        FALLBACK_CARD_IMAGES[i % FALLBACK_CARD_IMAGES.length],
      ),
      alt: mediaAlt(place.image, text(place.title, "")),
    })),
  };
}

/* Traveller stories. The quote marks are the design's, not the copy's — an
   editor typing a quotation types words, so the curly pair is added here
   unless they have already been typed. */
function normaliseStories(section) {
  if (!section) return {};

  return {
    ...heading(section),
    stories: cards(list(section.stories), (story, i) => {
      const quote = text(story.quote, "");
      return {
        key: slugify(story.author) || `story-${story.id ?? i}`,
        /* An empty quote stays empty rather than becoming a bare “”. A card
           can reach the site with its destination line filled and the
           quotation still to come — testimonials are gathered from real
           travellers, so the copy arrives after the card does. */
        quote: !quote || /^[“"]/.test(quote) ? quote : `“${quote}”`,
        author: text(story.author, ""),
        meta: text(story.meta, ""),
        rating: Number.isFinite(story.rating) ? story.rating : 5,
        image: mediaUrl(
          story.image,
          FALLBACK_CARD_IMAGES[i % FALLBACK_CARD_IMAGES.length],
        ),
        authorImage: mediaUrl(story.authorImage, FALLBACK_AVATAR),
      };
    }),
  };
}

/* Fixed packages. Same meta-line treatment as the Kerala page's cards: the CMS
   keeps duration and the place list apart and the dots are added here. */
function normalisePackages(section) {
  if (!section) return {};

  return {
    ...heading(section),
    ctaLabel: text(section.ctaLabel),
    ctaHref: text(section.ctaLink),
    experiencesLabel: text(section.experiencesLabel),
    items: cards(list(section.packages), (pkg, i) => ({
      id: slugify(pkg.title) || `package-${pkg.id ?? i}`,
      title: text(pkg.title, ""),
      meta: joinParts([
        text(pkg.duration),
        ...splitList(pkg.places),
      ]).toUpperCase(),
      experiences: joinParts(splitList(pkg.experiences)),
      image: mediaUrl(
        pkg.image,
        FALLBACK_CARD_IMAGES[i % FALLBACK_CARD_IMAGES.length],
      ),
      alt: mediaAlt(pkg.image, text(pkg.title, "")),
    })),
  };
}

/* The enquiry wizard.
 *
 * Flat rather than nested: the component reads a question and its chips as two
 * separate props, and the CMS stores the chips one per line. splitLines is the
 * whole conversion — an editor types a list, the wizard gets an array.
 */
/* The destination chips are the one list with a data-driven default: the
   region's own countries from lib/navigation.js, so /africa asks about
   African countries and /asia about Asian ones. The CMS field still wins
   where an editor has filled it. Returned even when the whole section is
   unfilled, because the component's own fallback is the design's Africa
   list, which is wrong on every other region. */
function normalisePlanTrip(section, region) {
  const destinations = destinationOptionsFor({ regionKey: region?.key });
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
