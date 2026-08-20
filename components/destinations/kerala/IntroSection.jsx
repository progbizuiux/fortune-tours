"use client";

import Image from "next/image";
import { Container } from "@/components/common/Container";
import { FrameButton } from "@/components/common/FrameButton";
import { AnimateIn } from "@/components/common/AnimateIn";

/* Defaults are the copy this section shipped with — see HeroSection for why.
   The title default stays a fragment so it keeps its desktop line break; a
   string arriving from the CMS renders as plain text, which is what a single
   text field can express. */
const DEFAULT_EYEBROW = "Discover Kerala";
const DEFAULT_TITLE = (
  <>
    Where Nature Meets Timeless
    <br className="hidden md:block" /> Traditions
  </>
);
const DEFAULT_LEAD = "A Journey Filled With Stories";
const DEFAULT_PARAGRAPHS = [
  "Kerala isn't just one destination. Every region has its own rhythm, traditions, flavors, and landscapes. Wake up to tea plantations in the hills, cruise through quiet backwaters by afternoon, and watch the sunset beside the Arabian Sea. It's a destination where every day feels different.",
  "Beyond its breathtaking scenery, Kerala welcomes you with warm hospitality, rich traditions, and experiences that feel truly authentic. From exploring spice plantations and vibrant local markets to savoring regional cuisine and discovering hidden gems, every journey is filled with moments worth remembering. Whether you're traveling with family, your partner, or on your own, Kerala leaves you with stories you'll want to tell long after you've returned home.",
];
const DEFAULT_CTA_LABEL = "Explore Packages";
const DEFAULT_IMAGE = "/destinations/kerala/house-boat.avif";
const DEFAULT_IMAGE_ALT = "House boat cruising Kerala backwaters at sunrise";

export function IntroSection({
  eyebrow = DEFAULT_EYEBROW,
  title = DEFAULT_TITLE,
  lead = DEFAULT_LEAD,
  paragraphs = DEFAULT_PARAGRAPHS,
  ctaLabel = DEFAULT_CTA_LABEL,
  image = DEFAULT_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
}) {
  return (
    // relative z-10 is required, not cosmetic: the hero is sticky (positioned),
    // so without a stacking position of its own this section would paint
    // underneath it instead of scrolling over it.
    // A ramp, not a flat fill. The reference keeps the hero photograph clearly
    // readable behind the heading, then washes it out progressively until the
    // background is FULLY white by the Explore Packages button — everything
    // below that (the houseboat image) sits on plain white. bg-background was
    // opaque from the first pixel, which killed the photograph instantly; a
    // flat translucent fill kept it visible the whole way down. Both are wrong.
    //
    // 45% is where the CTA lands in this section's height at desktop, so the
    // white is complete exactly as it comes into view. The hero stays pinned
    // behind for this section's height (see the pin-scope wrapper in
    // app/destinations/kerala/page.js), which is what there is to wash out.
    <section className="bg-[linear-gradient(to_bottom,#ffffff73_0%,#ffffff_45%)] relative z-10 pt-24 pb-0 md:pt-[120px]">
      {/* White bleed that rides this section's top edge as it scrolls over the
          sticky hero, so the hero always dissolves into this background instead
          of meeting it at a hard line. It has to live here, not on the hero:
          anchored to the hero it would sit at a fixed spot in the viewport and
          get buried under this section's opaque background the moment the page
          scrolls. Spelled as a raw gradient because `from-white/0` compiles to a
          transparent *black* stop — harmless in browsers that premultiply, a
          grey haze in any that don't. `#fff0` is white at both ends either way.

          Deliberately SHORT (30vh) and only reaching 45% white. This element is
          anchored to this section's top edge, which sits at exactly 100vh — so
          its height is how far up the hero it reaches at scroll 0. At h-screen
          it covered the entire hero from the very first frame, which is why the
          reference's opening shot was washed out when it should be fully
          saturated. 30vh keeps the wash off-screen at rest and lets it arrive
          only once the hero starts leaving. Its end colour matches this
          section's gradient start, so the two meet without a seam. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-full h-[30vh] bg-[linear-gradient(to_bottom,#fff0,#ffffff73)]"
      />

      <Container>
        <div className="flex flex-col">
          {/* Top: Eyebrow and Heading */}
          <AnimateIn className="flex flex-col">
            <span className="font-top text-h4 max-md:text-[12px] max-md:leading-none max-md:font-normal max-md:tracking-normal text-black max-md:mb-[19px] md:mb-8">
              {eyebrow}
            </span>
            <h2 className="font-heading text-h2 max-md:text-[30px] max-md:font-normal max-md:tracking-[-0.01em] max-md:text-[#0C2233] text-black max-md:leading-[45px] leading-[1.1] 2xl:leading-[97.5px] max-w-[1759px]">
              {title}
            </h2>
          </AnimateIn>

          {/* Bottom Right: Description and CTA */}
          <AnimateIn stagger={0.1} delay={0.2} className="flex md:justify-end max-md:mt-[30px] md:mt-16">
            <div className="flex flex-col w-full max-w-[728px]">
              <h3 className="font-heading text-h4 max-md:text-[18px] max-md:leading-[28.9px] max-md:tracking-normal max-md:font-normal text-black max-md:mb-5 md:mb-3">
                {lead}
              </h3>
              <div className="font-sans text-body font-light text-black/80 flex flex-col gap-4 md:gap-6 [&_p]:font-light [&_p]:max-md:text-[13px] [&_p]:max-md:leading-[22px] [&_p]:max-md:tracking-normal [&_p]:md:leading-[27px]">
                {paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-9 md:mt-32 flex items-center">
                <FrameButton variant="rail" className="max-md:text-[13px]">
                  {ctaLabel}
                </FrameButton>
              </div>
            </div>
          </AnimateIn>
        </div>

        {/* Large Image */}
        <AnimateIn y={40} delay={0.4} className="mt-16 md:mt-32 lg:mt-[56px] relative max-md:aspect-[440/334] md:aspect-[1755/635] max-md:w-[calc(100%+2rem)] max-md:-ml-4 max-md:rounded-none md:w-full overflow-hidden rounded-sm">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 100vw, 100vw"
            className="object-cover object-center"
          />
        </AnimateIn>
      </Container>
    </section>
  );
}
