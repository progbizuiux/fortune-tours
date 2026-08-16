"use client";

import { useRef } from "react";
import { Container } from "@/components/common/Container";
import { CtaLink } from "@/components/common/CtaLink";
import { gsap, useGSAP } from "@/lib/gsap";

const CTA_LINKS = [
  { label: "Discover experiences", href: "/experiences" },
  { label: "Design your itinerary", href: "/itinerary" },
];

export function HeroSection() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // The image is only scaled, never faded: useGSAP runs after hydration, so
      // fading it from 0 would blank the already-painted hero. Text elements
      // ship as opacity-0 in the markup so their start state matches the tween.
      tl.from(".hero-image", { scale: 1.08, duration: 1.2 })
        .fromTo(
          ".hero-eyebrow",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.9",
        )
        .fromTo(
          ".hero-heading",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4",
        )
        .fromTo(
          ".hero-description",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.5",
        )
        .fromTo(
          ".hero-cta",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4",
        );
    },
    { scope: containerRef },
  );

  // Pinned to the top while the rest of the page scrolls up over it. z-0 keeps
  // it at the bottom of the stacking order; every following block is z-10 so it
  // paints on top rather than sliding underneath.
  return (
    <section
      ref={containerRef}
      className="sticky top-0 z-0 flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Without JS the entrance tweens never run, so reveal the copy up front. */}
      <noscript>
        <style>{`.hero-eyebrow,.hero-heading,.hero-description,.hero-cta{opacity:1 !important}`}</style>
      </noscript>

      <div className="hero-image absolute inset-0">
        {/* Hero background video — falls back to the poster image */}
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          src="/home-banner-asset/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        {/* Scrim tuned so white/90 copy clears WCAG AA over the brightest
            areas of the photo, including the sky band on tall viewports. */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      <Container className="relative flex flex-col items-center max-md:gap-4 gap-6 pt-20 text-center">
        <span className="hero-eyebrow font-top max-md:text-[13px] text-h4 text-white/90 opacity-0">
          Fortune Tours &amp; Travels — Est. 1998
        </span>

        <h1 className="hero-heading font-heading max-md:text-[42px] max-md:leading-none text-h1 max-md:max-w-[400px] max-w-4xl text-white opacity-0">
          The journey begins before you leave home.
        </h1>

        <p className="hero-description max-md:text-[13px] max-md:leading-120 text-body max-md:max-w-[313px] max-w-lg max-md:text-white/80 text-white/90 opacity-0 max-md:px-4">
          Travel isn&apos;t measured by miles. It&apos;s measured by moments
          that stay with you forever.
        </p>

        <div className="hero-cta mt-4 flex flex-wrap items-center justify-center max-md:gap-4 gap-x-6 gap-y-3 max-md:text-[13px] max-md:leading-6 text-body text-white/90 opacity-0">
          {CTA_LINKS.map((link) => (
            <CtaLink
              key={link.href}
              href={link.href}
              fill
              className="border-x border-white/40 px-5"
            >
              {link.label}
            </CtaLink>
          ))}
        </div>
      </Container>
    </section>
  );
}
