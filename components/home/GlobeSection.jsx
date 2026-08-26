"use client";

import dynamic from "next/dynamic";
import { Container } from "@/components/common/Container";
import { FrameButton } from "@/components/common/FrameButton";
import { AnimateIn } from "@/components/common/AnimateIn";

/* R3F/three must never run on the server — loaded client-only. */
const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), { ssr: false });

/* Section background sampled from the Figma globe frame. */
const BG_TOP = "#FAF7F2";
const BG_BOTTOM = "#ffffff";

/* The rail variant is drawn for a full-width toolbar; in this pair it runs
   large below xl. Steps down onto the shared text-small token with tighter
   padding, and hands back to the variant own values from xl. */
const GLOBE_BUTTON =
  "text-small px-4 py-1.5 max-md:px-3 max-md:py-1 xl:text-body xl:px-5 xl:py-2";

export function GlobeSection() {
  return (
    /* Height tracks the WIDTH, because the sphere does: GlobeCanvas draws it at
       0.74x the canvas width. The design shows the cap down to the equator and
       no further, which puts the sphere's centre 1.065 radii below the content
       band — 0.394 x width — with the cloud bank covering everything under it.
       Together that is the 49vw. The leading constant is the band the copy
       occupies, taller on a narrow screen where the heading, blurb and buttons
       stack into a column.

       Fixed per-breakpoint heights do not work here: a height that crops
       correctly at 1440 leaves an entire floating ball at 1024. */
    <section
      aria-label="Atlas — the world in motion"
      /* Below lg the sphere is cropped ON the equator rather than past it.
         GlobeCanvas puts the centre 1.065 radii below the canvas top and draws
         the sphere at 0.74x the canvas width, so the equator lands at
         0.74/2 x 1.065 = 0.394 of the width — 39.4vw of canvas, where the 49vw
         used at lg carries it 9.6vw further and leaves the underside curving
         back in. lg and up keeps 49vw: the cloud bank covers that lower band
         there, and it is what the frame draws.

         The leading constant is the band the copy occupies, and it is 40px
         taller below lg than at lg to open a gap between the button row and
         the cap. It has to match the canvas's own top inset below, which is
         what holds the sphere's geometry to the arithmetic above. */
      className="relative isolate z-0 h-[calc(340px+39.4vw)] overflow-hidden sm:h-[calc(290px+39.4vw)] lg:h-[calc(300px+49vw)] mb-6 lg:mb-12"
      style={{ background: `linear-gradient(to bottom, ${BG_TOP} 0%, ${BG_BOTTOM} 100%)` }}
    >
      {/* Content overlay */}
      <Container className="relative z-40 pt-16 lg:pt-24 pointer-events-none">
        <AnimateIn className="flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-left gap-8 pointer-events-auto">
          {/* Left: Eyebrow and Title */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="font-top max-lg:text-[12px] max-lg:leading-none text-h4 text-navy/70">
              Chapter 08 — Wanderlust
            </span>
            <h2 className="max-lg:text-[30px] max-lg:leading-none max-lg:tracking-[-0.01em] text-navy lg:max-xl:text-[38px]">
              Destinations without limits
            </h2>
          </div>

          {/* Right: Description and Buttons */}
          <div className="flex flex-col items-center md:items-end gap-6 max-w-[375px]">
            {/* Eyebrow, title and this line all carry SectionHeading's own
                classes rather than sizes of their own, so this section's type
                tracks every other section heading on the site. The component
                itself cannot be used here: its layout has no slot for the two
                buttons that sit under the description. */}
            <p className="max-lg:text-[13px] max-lg:font-light max-lg:leading-[21px] text-navy/70 text-center md:text-right">
              Explore our selected destinations and create lasting memories.
            </p>
            <div className="flex items-center justify-center md:justify-end gap-4">
              {/* Solid black, per the design — the `rail` variant's own
                  `active` state is exactly that treatment, so this is the
                  shared button rather than a one-off colour override. */}
              <FrameButton variant="rail" active className={GLOBE_BUTTON}>
                Map of regions
              </FrameButton>
              <FrameButton variant="rail" className={GLOBE_BUTTON}>
                A-Z of countries
              </FrameButton>
            </div>
          </div>
        </AnimateIn>
      </Container>

      {/* Colours are set on the globe's own materials, so no CSS correction
          layer sits between the canvas and the page. The top inset starts the
          globe below the copy — furthest down on narrow screens, where the copy
          stacks into a tall column. */}
      <div className="absolute inset-x-0 bottom-0 top-[340px] sm:top-[290px] lg:top-[300px]">
        <GlobeCanvas />
      </div>
      {/* Globe dissolves into the background towards the base (Figma). It has
          to reach FULLY opaque white by the last stop: the section clips with
          overflow-hidden, so any sphere still tinted at that line gets sliced
          off along a hard horizontal edge. Reaching white first means there is
          nothing left to slice. The band stays shallow so the fade only bites
          below the sphere's equator, leaving the cloud bank a still-tan stretch
          to sit against — white cloud art on white ground is invisible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[16%]"
        style={{
          background: `linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.12) 30%, rgba(255, 255, 255, 0.45) 60%, rgba(255, 255, 255, 0.9) 88%, ${BG_BOTTOM} 100%)`,
        }}
      />
    </section>
  );
}
