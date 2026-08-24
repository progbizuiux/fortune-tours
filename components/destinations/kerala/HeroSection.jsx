"use client";

import { useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { CtaLink } from "@/components/common/CtaLink";
import { gsap, useGSAP } from "@/lib/gsap";
import { HERO_HEADING } from "@/lib/typography";

/* Defaults are the copy this section shipped with. They stand in whenever the
   matching CMS field is empty, so an unfilled entry renders the design rather
   than a hole. Content comes from lib/strapi/kerala.js via the page. */
const CTA_LINKS = [
  { label: "Explore Packages", href: "#packages" },
  { label: "Design your itinerary", href: "/itinerary" },
];

const DEFAULT_EYEBROW = "Fortune Tours & Travels — Est. 1998";
const DEFAULT_TITLE = "Everyone Sees Kerala. Few Actually Feel It.";
const DEFAULT_IMAGE = "/destinations/kerala/kerala.avif";
const DEFAULT_IMAGE_ALT = "Kerala backwaters with palm trees and a boat";

export function HeroSection({
  eyebrow = DEFAULT_EYEBROW,
  title = DEFAULT_TITLE,
  image = '',
  imageAlt = DEFAULT_IMAGE_ALT,
  ctas,
}) {
  const containerRef = useRef(null);
  const ctaLinks = ctas?.length ? ctas : CTA_LINKS;

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

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
          ".hero-cta",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4",
        );

      /* Scroll-linked exit. The image is pinned by `sticky top-0`, so without
         this the copy sits frozen mid-screen until the intro section covers it.
         The prototype instead drifts the copy up and fades it out while the
         image stays put, so the hero empties before the intro's white bleed
         arrives.

         Scoped to matchMedia so reduced-motion users get the static hero, and
         driven off the section's normal-flow box: `sticky` does not move an
         element's layout position, so top top -> bottom top is exactly the
         first viewport-height of scrolling.

         `y` is a function value, not yPercent: yPercent resolves against the
         copy block's own height, which changes with the heading's line count,
         so the travel would differ between breakpoints. ScrollTrigger
         re-evaluates function values on refresh, so this re-measures on
         resize. Transform + opacity only, and deliberately no clearProps —
         a scrubbed tween has to keep owning both across the whole range. */
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          })
          .to(
            ".hero-copy",
            { y: () => -window.innerHeight * 0.38, ease: "none", duration: 1 },
            0,
          )
          .to(".hero-copy", { opacity: 0, ease: "none", duration: 0.55 }, 0);
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="sticky top-0 z-0 flex min-h-screen items-center justify-center overflow-hidden"
    >
      <noscript>
        <style>{`.hero-eyebrow,.hero-heading,.hero-cta{opacity:1 !important}`}</style>
      </noscript>

      <div className="hero-image absolute inset-0">
        <Image
          className="absolute inset-0 h-full w-full object-cover max-md:object-[25%] md:object-center"
          src={image}
          alt={imageAlt}
          fill
          priority
        />

        {/* Figma → kerala landing, the overlay layer above the hero photo:
            fill #000000 at 40%, layer opacity 48%. Written as the two separate
            values rather than the collapsed 19.2% so it stays readable against
            the Figma panel. Replaces the old hand-rolled scrim stack (a flat
            black/35 plus top and bottom gradients), which was much heavier and
            not in the design. */}
        <div className="absolute inset-0 bg-black/40 opacity-[0.48]" />
      </div>

      <Container className="hero-copy relative flex flex-col items-center text-center md:items-end md:text-right md:pt-[30vh]">
        <span className="hero-eyebrow font-top max-md:text-[13px] text-h4 text-white/90 opacity-0 mb-8 md:mb-11 lg:mb-0">
          {eyebrow}
        </span>

        {/* Narrower measure from lg to 2xl: at 889px this title sets on one
            long line there, and the design holds it to two. */}
        <h1 className={`hero-heading ${HERO_HEADING} lg:mt-[70px] lg:max-2xl:mt-8 max-md:max-w-[400px] max-w-[889px] lg:max-2xl:max-w-[620px] text-white opacity-0`}>
          {title}
        </h1>

        <div className="hero-cta mt-11 md:mt-16 lg:max-2xl:mt-8 flex flex-wrap items-center justify-center md:justify-end max-md:gap-4 gap-x-6 gap-y-3 max-md:text-[13px] max-md:leading-6 text-body text-white/90 opacity-0">
          {ctaLinks.map((link) => (
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
