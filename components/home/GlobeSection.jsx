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

export function GlobeSection() {
  return (
    <section
      aria-label="Atlas — the world in motion"
      className="relative isolate z-0 h-[450px] overflow-hidden sm:h-[550px] md:h-[650px] lg:h-[850px] mb-16 lg:mb-32"
      style={{ background: `linear-gradient(to bottom, ${BG_TOP} 0%, ${BG_BOTTOM} 100%)` }}
    >
      {/* Content overlay */}
      <Container className="relative z-40 pt-16 lg:pt-24 pointer-events-none">
        <AnimateIn className="flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-left gap-8 pointer-events-auto">
          {/* Left: Eyebrow and Title */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="font-top text-[12px] md:text-h4 text-navy/70">
              Chapter 08 — Wanderlust
            </span>
            <h2 className="font-heading text-[30px] md:text-h2 text-navy leading-none">
              Destinations without limits
            </h2>
          </div>

          {/* Right: Description and Buttons */}
          <div className="flex flex-col items-center md:items-end gap-6 max-w-[375px]">
            <p className="text-body font-light text-navy/70 text-center md:text-right text-[13px] md:text-base">
              Explore our selected destinations and create lasting memories.
            </p>
            <div className="flex items-center justify-center md:justify-end gap-4">
              <FrameButton variant="rail">
                Map of regions
              </FrameButton>
              <FrameButton variant="rail">
                A-Z of countries
              </FrameButton>
            </div>
          </div>
        </AnimateIn>
      </Container>

      {/* Colours are set on the globe's own materials, so no CSS correction
          layer sits between the canvas and the page. */}
      <div className="absolute inset-x-0 bottom-0 top-[200px] sm:top-[250px] lg:top-[300px]">
        <GlobeCanvas />
      </div>
      {/* Globe dissolves into the background towards the base (Figma) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[40%]"
        style={{
          background: `linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 40%, rgba(255, 255, 255, 0.4) 75%, rgba(255, 255, 255, 0.9) 95%, ${BG_BOTTOM} 100%)`,
        }}
      />
    </section>
  );
}
