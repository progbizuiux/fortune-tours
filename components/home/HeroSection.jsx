"use client";

import { useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
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

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
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

      <Container className="relative flex flex-col items-center gap-6 pt-20 text-center">
        <span className="hero-eyebrow font-top text-small tracking-[0.2em] text-white/90 uppercase opacity-0">
          Fortune Tours &amp; Travels — Est. 1998
        </span>

        <h1 className="hero-heading font-heading text-h1 max-w-4xl text-white opacity-0">
          The journey begins before you leave home.
        </h1>

        <p className="hero-description text-body max-w-xl text-white/90 opacity-0">
          Travel isn&apos;t measured by miles. It&apos;s measured by moments
          that stay with you forever.
        </p>

        <div className="hero-cta mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-small text-white/90 opacity-0">
          {/* Dividers are hidden below sm, where the row wraps and would
              otherwise strand a bar at the start of a new line. */}
          <span
            className="hidden h-4 w-px bg-white/30 sm:block"
            aria-hidden="true"
          />
          {CTA_LINKS.map((link) => (
            <span key={link.href} className="flex items-center gap-6">
              <Link
                href={link.href}
                className="hover:text-sky transition-colors"
              >
                {link.label}
              </Link>
              <span
                className="hidden h-4 w-px bg-white/30 sm:block"
                aria-hidden="true"
              />
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
