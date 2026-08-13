"use client";

import Image from "next/image";
import { Container } from "@/components/common/Container";
import { CtaLink } from "@/components/common/CtaLink";
import { AnimateIn } from "@/components/common/AnimateIn";

export function IntroSection() {
  return (
    // relative z-10 is required, not cosmetic: the hero is sticky (positioned),
    // so without a stacking position of its own this section would paint
    // underneath it instead of scrolling over it.
    <section className="bg-background relative z-10 pt-24 pb-24 md:pt-32">
      {/* White bleed that rides this section's top edge as it scrolls over the
          sticky hero, so the hero always dissolves into this background instead
          of meeting it at a hard line. It has to live here, not on the hero:
          anchored to the hero it would sit at a fixed spot in the viewport and
          get buried under this section's opaque background the moment the page
          scrolls. Spelled as a raw gradient because `from-white/0` compiles to a
          transparent *black* stop — harmless in browsers that premultiply, a
          grey haze in any that don't. `#fff0` is white at both ends either way. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-full h-[25vh] bg-[linear-gradient(to_bottom,#fff0,#fff)]"
      />

      <Container>
        <div className="flex flex-col">
          {/* Top: Eyebrow and Heading */}
          <AnimateIn className="flex flex-col">
            <span className="font-top text-h4 max-md:text-[12px] text-black mb-4 md:mb-8">
              Discover Kerala
            </span>
            <h2 className="font-heading text-h2 text-black leading-[1.1] max-w-[1759px]">
              Where Nature Meets Timeless<br className="hidden md:block" /> Traditions
            </h2>
          </AnimateIn>

          {/* Bottom Right: Description and CTA */}
          <AnimateIn stagger={0.1} delay={0.2} className="flex md:justify-end mt-8 md:mt-16">
            <div className="flex flex-col w-full max-w-[728px]">
              <h3 className="font-heading text-h4 text-black mb-5 md:mb-3">
                A Journey Filled With Stories
              </h3>
              <div className="font-sans text-body max-md:text-[13px] max-md:leading-[22px] md:leading-[27px] font-light text-black/80 flex flex-col gap-4 md:gap-6">
                <p>
                  Kerala isn&apos;t just one destination. Every region has its own
                  rhythm, traditions, flavors, and landscapes. Wake up to tea
                  plantations in the hills, cruise through quiet backwaters by
                  afternoon, and watch the sunset beside the Arabian Sea. It&apos;s a
                  destination where every day feels different.
                </p>
                <p>
                  Beyond its breathtaking scenery, Kerala welcomes you with warm
                  hospitality, rich traditions, and experiences that feel truly
                  authentic. From exploring spice plantations and vibrant local
                  markets to savoring regional cuisine and discovering hidden gems,
                  every journey is filled with moments worth remembering. Whether
                  you&apos;re traveling with family, your partner, or on your own,
                  Kerala leaves you with stories you&apos;ll want to tell long after
                  you&apos;ve returned home.
                </p>
              </div>

              <div className="mt-9 md:mt-32 flex items-center gap-4">
                <CtaLink
                  href="#packages"
                  withLeftDivider={true}
                  withRightDivider={false}
                  dividerClassName="h-5 w-px bg-black/30"
                  className="text-black text-body max-md:text-[13px] hover:text-sky transition-colors"
                >
                  Explore Packages
                </CtaLink>
              </div>
            </div>
          </AnimateIn>
        </div>

        {/* Large Image */}
        <AnimateIn y={40} delay={0.4} className="mt-16 md:mt-32 relative max-md:aspect-[440/334] md:aspect-[1755/635] max-md:w-[calc(100%+2rem)] max-md:-ml-4 max-md:rounded-none md:w-full overflow-hidden rounded-sm">
          <Image
            src="/destinations/kerala/house-boat.avif"
            alt="House boat cruising Kerala backwaters at sunrise"
            fill
            sizes="(min-width: 1024px) 100vw, 100vw"
            className="object-cover object-center"
          />
        </AnimateIn>
      </Container>
    </section>
  );
}
