import { indexBlocks, zonePopulate } from "./blocks";
import { strapiFindOne } from "./client";
import { mediaAlt, mediaUrl } from "./media";
import { cta, list, slugify, text } from "./normalise";

/* Home page — query, cache tags, and the CMS→props normaliser.
 *
 * Unlike kerala-pages, this content type stores its sections in a DYNAMIC ZONE:
 * one ordered list where each entry carries a `__component` tag naming its
 * type. The zone is indexed by that tag here and the page keeps its own JSX
 * order — see the note in app/page.js for what it would take to hand ordering
 * to editors.
 *
 * Text is taken from the CMS wherever it exists. Repeatable lists are only
 * taken when the CMS actually holds entries: several are still empty, and an
 * empty list would render a blank section where the design has content.
 */

export const HOME_TAGS = ["homepage"];

/* One populate rule per block type, keyed by `__component`. Dynamic zones
   ignore `populate: "*"` past the first level, so each block states what its
   nested pieces are. Keeping them in this map is what makes adding a block a
   single edit rather than a hunt through a long query string. */
const BLOCK_POPULATE = {
  "sections.hero": { backgroundImage: true },
  "sections.destinations": { destinations: { populate: "*" } },
  "sections.brand": { brands: { populate: "*" } },
  "sections.reviews": { reviews: { populate: "*" } },
  "sections.region-picker": { regions: { populate: "*" } },
  "sections.featured-destinations": {
    tabs: { populate: { slides: { populate: "*" } } },
  },
  "sections.timetable": {
    months: { populate: { departures: { populate: "*" } } },
  },
  "sections.journal": { cards: { populate: "*" } },
  "sections.social-gallery": { photos: { populate: "*" } },
  "sections.map-cta": { mapImage: true },
};

const HOME_QUERY = { populate: { sections: zonePopulate(BLOCK_POPULATE) } };

/* Local imagery, used while the CMS media fields are empty — which is all of
   them today. Destination photos are matched on name first so a destination
   keeps the right picture regardless of its position in the list; anything
   without a match falls back by position. */
const DESTINATION_IMAGES = {
  japan: "/destination/japan.avif",
  switzerland: "/destination/switzerland.avif",
  india: "/destination/india.avif",
  norway: "/destination/norway.avif",
};

const DESTINATION_IMAGE_ORDER = [
  "/destination/japan.avif",
  "/destination/switzerland.avif",
  "/destination/india.avif",
  "/destination/norway.avif",
];

const JOURNAL_FALLBACK = [
  { meta: "Field Notes — 6 min read", image: "/home/journal/field-notes.png", href: "/journal/sunrise-in-iceland" },
  { meta: "City Guide — 9 min read", image: "/home/journal/coastal-escape.png", href: "/journal/secret-cafes-paris" },
  { meta: "Coastal Escape — 7 min read", image: "/home/journal/city-guide.png", href: "/journal/amalfi-coast-towns" },
  { meta: "Card 04 — Kyoto, Japan", image: "/home/journal/climatic.png", href: "/journal/kyoto-cherry-blossom" },
];

/* The reviewers' portraits. The CMS review-card has an `image` field but no
   uploads behind it, and CredentialsSection hands `src` straight to
   next/image — a null there is a render error, not a blank square. */
const REVIEW_FALLBACK = [
  "/credentials/image 191.png",
  "/credentials/image 192.png",
  "/credentials/image 193.png",
  "/credentials/image 194.png",
];

/* The polaroid strip's own photography, kept per position so an empty CMS
   photo still renders the design's picture rather than a blank frame. Every
   image field in the block is empty today; the alt text is the design's. */
const POLAROID_FALLBACK = [
  { image: "/home/image-2.jpg", alt: "Family posing at the Hong Kong Disneyland Resort entrance" },
  { image: "/home/image-5.png", alt: "Bell tower rising over sunlit rooftops in Florence" },
  { image: "/home/image-4.png", alt: "Traveller in a white dress on the wooden deck of a river cruiser" },
  { image: "/home/image-3.png", alt: "Waterside breakfast table set with ceramics and fresh flowers" },
  { image: "/home/image-1.png", alt: "Sunset over the deck of a sailing river cruise ship" },
];

/* The caption under each polaroid. Only one of the five photos carries it in
   the CMS, so the rest fall back to the handle the design already shows. */
const POLAROID_HANDLE = "fortunetours";

/**
 * Fetch and normalise the home page.
 * @returns the props tree, or null when Strapi holds no published entry.
 */
export async function getHomePage() {
  const entry = await strapiFindOne("homepages", {
    query: HOME_QUERY,
    tags: HOME_TAGS,
  });

  return entry ? normaliseHomePage(entry) : null;
}

export function normaliseHomePage(entry) {
  const block = indexBlocks(entry.sections);

  return {
    hero: normaliseHero(block["sections.hero"]),
    destinations: normaliseDestinations(block["sections.destinations"]),
    /* The design renders the brand strip and the review grid as one section,
       so CredentialsSection draws on two blocks: `brand` carries the heading,
       `reviews` the cards. */
    credentials: normaliseCredentials(
      block["sections.brand"],
      block["sections.reviews"],
    ),
    travelStyles: normaliseHeading(block["sections.region-picker"]),
    featured: normaliseHeading(block["sections.featured-destinations"]),
    departures: normaliseHeading(block["sections.timetable"]),
    journal: normaliseJournal(block["sections.journal"]),
    gallery: normaliseGallery(block["sections.social-gallery"]),
  };
}

/* ── blocks ────────────────────────────────────────────────────────────── */

/* Most blocks share one heading shape: chapterLabel over mainTitle over a
   description. Named for what it is so the per-block functions below only
   exist where a block has more than that. */
function normaliseHeading(block) {
  if (!block) return {};

  return {
    eyebrow: text(block.chapterLabel),
    title: text(block.mainTitle),
    description: text(block.description),
  };
}

function normaliseHero(block) {
  if (!block) return {};

  return {
    eyebrow: text(block.eyebrow),
    title: text(block.title),
    description: text(block.description),
    ctas: [
      cta(block.primaryCtaLabel, block.primaryCtaLink, "/experiences"),
      cta(block.secondaryCtaLabel, block.secondaryCtaLink, "/itinerary"),
    ].filter(Boolean),
    /* Not wired to the component: the hero plays a background video, and
       swapping it for a still because someone uploaded one would be a design
       change rather than a content one. Exposed so it is visible when the
       field does get filled. */
    backgroundImage: mediaUrl(block.backgroundImage, null),
  };
}

function normaliseDestinations(block) {
  if (!block) return {};

  const destinations = list(block.destinations);

  return {
    ...normaliseHeading(block),
    items: destinations.length
      ? destinations.map((destination, i) => {
          const name = text(destination.name, "");
          const slug = slugify(name);

          return {
            name,
            caption: text(destination.tagline, ""),
            href: text(destination.navigationLink) || `/destinations/${slug}`,
            image: mediaUrl(
              destination.image,
              DESTINATION_IMAGES[slug] ??
                DESTINATION_IMAGE_ORDER[i % DESTINATION_IMAGE_ORDER.length],
            ),
            alt: mediaAlt(destination.image, name),
          };
        })
      : undefined,
  };
}

function normaliseCredentials(brandBlock, reviewsBlock) {
  const reviews = list(reviewsBlock?.reviews);

  return {
    ...normaliseHeading(brandBlock),
    /* Left undefined while the CMS list is empty so the component keeps its
       own four reviews rather than rendering an empty grid. */
    reviews: reviews.length
      ? reviews.map((review, i) => ({
          /* Field names are the review-card component's, not the card prop
             names — `numeral`/`quote` here would silently read undefined and
             blank the testimonial out. */
          numeral: text(review.indexLabel, ROMAN[i] ?? `${i + 1}.`),
          quote: text(review.reviewText, ""),
          name: text(review.name, ""),
          /* `rating` is a decimal in the CMS and the card prints it as text,
             so text() would drop it for the fallback on every entry. */
          rating: review.rating == null ? "" : String(review.rating),
          src: mediaUrl(
            review.image,
            REVIEW_FALLBACK[i % REVIEW_FALLBACK.length],
          ),
        }))
      : undefined,
  };
}

function normaliseJournal(block) {
  if (!block) return {};

  const cards = list(block.cards);

  return {
    ...normaliseHeading(block),
    readLabel: text(block.cards?.[0]?.readText),
    items: cards.length
      ? cards.map((card, i) => {
          const fallback = JOURNAL_FALLBACK[i % JOURNAL_FALLBACK.length];

          return {
            /* metaLabel is the kicker above the headline. It is blank across
               the board today, so the design's own kickers stand in. */
            meta: text(card.metaLabel, fallback.meta),
            title: text(card.title, ""),
            href: text(card.readLink, fallback.href),
            image: mediaUrl(card.image, fallback.image),
            alt: mediaAlt(card.image, text(card.title, "")),
          };
        })
      : undefined,
  };
}

/* The polaroid strip. The CMS owns each photo's picture, caption, link and
   icon; the scatter — rotation, vertical offset, stacking — is design and
   stays in the component, applied by position. */
function normaliseGallery(block) {
  if (!block) return {};

  const photos = list(block.photos);

  return {
    items: photos.length
      ? photos.map((photo, i) => {
          const fallback = POLAROID_FALLBACK[i % POLAROID_FALLBACK.length];

          return {
            src: mediaUrl(photo.image, fallback.image),
            alt: mediaAlt(photo.image, fallback.alt),
            handle: text(photo.text, POLAROID_HANDLE),
            /* No fallback: without a link the caption stays plain text, which
               is what the design does today. */
            href: text(photo.link),
            /* Null leaves the component on its own Instagram glyph. */
            icon: mediaUrl(photo.icon, null),
            iconAlt: mediaAlt(photo.icon, ""),
          };
        })
      : undefined,
  };
}

const ROMAN = ["I.", "II.", "III.", "IV.", "V.", "VI."];
