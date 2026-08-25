import { DESTINATION_REGIONS } from "@/lib/navigation";
import { indexBlocks, zonePopulate } from "./blocks";
import { StrapiError, strapiFindOne } from "./client";
import { mediaAlt, mediaUrl } from "./media";
import { cta, joinParts, list, text } from "./normalise";

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

/* One populate rule per block type, keyed by `__component`. Dynamic zones
   ignore `populate: "*"` past the first level, so each block states what its
   nested pieces are. */
const BLOCK_POPULATE = {
  "sections.hero": { backgroundImage: true },
  "sections.region-intro": { image: true, places: { populate: "*" } },
};

const destinationQuery = (slug) => ({
  filters: { slug: { $eq: slug } },
  populate: { sections: zonePopulate(BLOCK_POPULATE) },
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
const FALLBACK_VIDEO = "/home-banner-asset/hero-bg.mp4";

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

/* The frame's photograph (2151435742.png) is stock and not in the repo, so the
   section stands on one that is until the CMS `image` field is filled. Chosen
   for subject rather than place — it is the closest thing here to the frame's
   wide, warm portrait — and it is the one line to delete once uploads land. */
const FALLBACK_INTRO_IMAGE = "/destinations/kerala/elephants-sri-lanka.jpg";

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
  const block = await fetchBlocks(region.key);

  return {
    hero: normaliseHero(block["sections.hero"], region),
    intro: normaliseIntro(block["sections.region-intro"], region),
  };
}

/* The zone indexed by `__component`, or an empty index when there is nothing
   to index — so every normaliser below reads the same way whether the entry
   exists, is empty, or the collection is not in Strapi yet. */
async function fetchBlocks(slug) {
  let entry;

  try {
    entry = await strapiFindOne("destination-pages", {
      query: destinationQuery(slug),
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
    if (error instanceof StrapiError && error.status === 404) return {};
    throw error;
  }

  return indexBlocks(entry?.sections);
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
