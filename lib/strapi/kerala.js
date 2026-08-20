import { strapiFindOne } from "./client";
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

/* Kerala landing page — query, cache tags, and the CMS→props normaliser.
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
};

/**
 * Fetch and normalise the Kerala page.
 * @returns the props tree, or null when Strapi holds no published entry.
 */
export async function getKeralaPage() {
  const entry = await strapiFindOne("kerala-pages", {
    query: KERALA_QUERY,
    tags: KERALA_TAGS,
  });

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
      cta(entry.secondaryCtaLabel, entry.secondaryCtaLink, "/itinerary"),
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