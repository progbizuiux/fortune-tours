import { PageHero } from "@/components/common/PageHero";

/* The home page's opening section. The frame itself is shared — see
   components/common/PageHero.jsx, which this section was lifted from when the
   destination pages needed the same one. What stays here is what is only true
   of the home page: the background footage and the copy the design shipped
   with.

   Defaults are the copy this section shipped with; the CMS supplies them via
   lib/strapi/home.js and these stand in for any field left blank. The
   background video is not CMS-driven — see the note in normaliseHero. */
const CTA_LINKS = [
  { label: "Discover experiences", href: "/plan-my-trip" },
  { label: "Design your itinerary", href: "/destinations/a-z" },
];

const DEFAULT_EYEBROW = "Fortune Tours & Travels — Est. 1998";
const DEFAULT_TITLE = "The journey begins before you leave home.";
const DEFAULT_DESCRIPTION =
  "Travel isn't measured by miles. It's measured by moments that stay with you forever.";
const HERO_VIDEO = "/home-banner-asset/hero-bg.mov"

export function HeroSection({
  eyebrow = DEFAULT_EYEBROW,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  ctas,
}) {
  return (
    <PageHero
      video={HERO_VIDEO}
      eyebrow={eyebrow}
      title={title}
      description={description}
      ctas={ctas?.length ? ctas : CTA_LINKS}
      overlayClassName="bg-black/20"
    />
  );
}
