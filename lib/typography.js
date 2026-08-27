/* Shared type stacks for the hero / banner band.
 *
 * Every page that opens with a big title over a line of body copy — the home
 * hero, the /search inspiration banner, the /experiences/[slug] hero — was
 * carrying its own copy of these sizes. They drifted, and each new page meant
 * restating them. They live here now: change a value once and all three follow.
 *
 * Colour, measure and layout are deliberately NOT included. Those genuinely
 * differ per section (white on the home video, navy on cream elsewhere), so the
 * call site still passes them. This is the type scale only.
 */

// Small-screen values, shared by both heading variants below so a phone renders
// the same title size on every one of these pages.
const HEADING_SMALL = "max-md:text-[42px] max-md:leading-none";

// Common slightly reduced font size for laptops and smaller desktops (lg to 2xl).
// This ensures all hero titles share the same readable size in this screen range.
const HEADING_LG_TO_2XL = "lg:max-xl:text-[44px] lg:max-xl:leading-[1.1] xl:max-2xl:text-[48px] xl:max-2xl:leading-[1.1]";

/* Full-width heading — the home hero, where the title has the whole frame and
   can take the h1 token's full ramp to 85px. */
export const HERO_HEADING = `font-heading ${HEADING_SMALL} ${HEADING_LG_TO_2XL} text-h1`;

/* Same heading in a narrow column — the /search banner and the experience hero,
   where the title sits beside a picture rather than across the frame.
   `text-h1` cannot be used above md here: it is generated from an `@theme
   inline` token, so it compiles to the literal clamp and never sees the
   1024-1535 downscale in globals.css. It stands at 85px from 1280, where these
   copy columns are ~377px wide and a word like "Honeymoon" is 402px with
   nowhere to wrap — it overflows under the picture. text-h2 through lg and a
   column-tracking clamp from xl land on the same 85px at the 1920 frame without
   ever overflowing on the way. */
export const HERO_HEADING_NARROW = `font-heading ${HEADING_SMALL} leading-[1.1118] ${HEADING_LG_TO_2XL} lg:text-h2 xl:text-[clamp(2.5rem,4.8vw_-_7.16px,5.3125rem)]`;

/* Body copy under either heading. 13/120% on a phone, then the body token with
   its leading expressed as the spec's 150% ratio — the token hardcodes 1.5rem,
   which is 150% at the 16px floor but stays 24px once the size ramps to 18. */
export const HERO_BODY =
  "max-md:text-[13px] max-md:leading-120 text-body leading-[1.5]";

/* The hero call to action — the bordered label with the sky panel that sweeps in
   on hover. Pairs with CtaLink's `fill`, which brings the sweep and the vertical
   rhythm; this adds the frame the sweep emerges from.
 *
 * Note this is CtaLink, not FrameButton. Both exist and look nearly alike, but
 * they are not interchangeable: CtaLink renders an <a> and takes an href, while
 * FrameButton renders a <button> with no destination and its own
 * border-black/20 frame. Every hero uses this one, so a hero CTA actually
 * navigates. Border colour stays at the call site — these sit on grounds as
 * different as the home video and cream.
 *
 * The size is part of this on purpose. It used to live on the home hero's CTA
 * row rather than on the control, so every other hero that reused "the same
 * button" silently inherited the 16px body default instead of the 13px the
 * phone frame draws. Carried here, the control brings its own size wherever it
 * goes — and 13px on leading-6 inside CtaLink's py-2 is exactly the 40px-tall
 * button the frame measures, so nothing has to prop the height up. */
export const HERO_CTA =
  "max-md:text-[13px] max-md:leading-6 text-body border-x px-5";
