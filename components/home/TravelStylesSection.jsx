import { ImageCarouselSection } from "@/components/common/ImageCarouselSection";

// Each carries the same href the live getTravelStyles() data does —
// /search?style=<key> — so the card navigates (to the search page filtered to
// that style) whether the CMS supplies the list or this fallback stands in.
// Without it the fallback cards render as dead buttons. /search ignores a style
// it does not recognise rather than erroring, so every key here is safe.
const STYLES = [
  {
    key: "relax",
    label: "Relax.",
    href: "/search?style=relax",
    image: "/home/image-4.png",
    alt: "Traveller in a white dress unwinding on the deck of a river cruiser",
    tag: "I want.",
  },
  {
    key: "explore",
    label: "Explore.",
    href: "/search?style=explore",
    image: "/home/journal/city-guide.png",
    alt: "Sunlit city streets waiting to be wandered",
    tag: "I want.",
  },
  {
    key: "celebrate",
    label: "Celebrate.",
    href: "/search?style=celebrate",
    image: "/home/image-2.jpg",
    alt: "Family celebrating together at a theme-park entrance",
    tag: "I want.",
  },
  {
    key: "adventure",
    label: "Adventure.",
    href: "/search?style=adventure",
    image: "/home/swiss-alpine.png",
    alt: "Snow-capped alpine peaks above a mountain trail",
    tag: "I want.",
  },
  {
    key: "spiritual",
    label: "Spiritual.",
    href: "/search?style=spiritual",
    image: "/home/journal/climatic.png",
    alt: "Temple walk beneath cherry blossoms in Kyoto",
    tag: "I want.",
  },
  {
    key: "luxury",
    label: "Luxury.",
    href: "/search?style=luxury",
    image: "/home/journal/coastal-escape.png",
    alt: "Cliffside coastal town above a glittering sea",
    tag: "I want.",
  },
  {
    key: "wildlife",
    label: "Wildlife.",
    href: "/search?style=wildlife",
    image: "/home/grand-usa.png",
    alt: "Vast canyon landscape carved by wind and water",
    tag: "I want.",
  },
  {
    key: "cruise",
    label: "Cruise.",
    href: "/search?style=cruise",
    image: "/home/image-1.png",
    alt: "Sunset over the deck of a sailing river cruise ship",
    tag: "I want.",
  },
];

/* Heading comes from the `sections.region-picker` block via lib/strapi/home.js.
   Its `regions` list is still empty in Strapi, so STYLES above stands in. */
export function TravelStylesSection({
  eyebrow = "Chapter 04 — Compass",
  title = "Discover your travel style.",
  description = "Share how you want to feel. Our concierge will create a unique itinerary.",
  items = STYLES,
}) {
  return (
    <ImageCarouselSection
      ariaLabel="Compass — discover your travel style"
      eyebrow={eyebrow}
      title={title}
      description={description}
      items={items}
      // buttonText="Reveal my journeys."
      gridClassName="grid-cols-2 sm:grid-cols-4 lg:grid-cols-8"
    />
  );
}
