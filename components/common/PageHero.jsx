"use client";

import { useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { CtaLink } from "@/components/common/CtaLink";
import { gsap, useGSAP } from "@/lib/gsap";
import { HERO_BODY, HERO_CTA, HERO_HEADING } from "@/lib/typography";
import { cn } from "@/lib/utils";

/* The full-bleed opening hero: a background that fills the frame, a centred
 * stack of eyebrow / title / body / CTA row over it, pinned while the page
 * scrolls up and over it.
 *
 * Lifted out of components/home/HeroSection.jsx verbatim — geometry, scrim and
 * entrance timeline unchanged — the moment a second page needed the same frame.
 * The destination pages (/africa and its siblings) draw this exact section and
 * only the background and the copy differ, so the alternative was a second copy
 * that would drift from the first. Callers own the content; this owns the frame.
 *
 * Carries no copy of its own on purpose. Each page's defaults belong with that
 * page — see components/home/HeroSection.jsx and lib/strapi/destination.js —
 * so nothing here has to know which section it is standing in for.
 *
 * The background is either a looping video (the home page) or a still (every
 * destination page). One of `video` / `image`, not both: they occupy the same
 * box, so a caller passing each would stack two backgrounds. `video` wins if
 * both arrive.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  /* A second, emphasised line under the description — the package detail
     frame's "From INR 44,900 per person" sitting under its inclusions line.
     Optional and unset everywhere else, so the home and destination heroes
     render exactly as before. */
  note,
  ctas = [],
  video,
  image,
  imageAlt = "",
  /* Only the home page's video is above the fold on first paint today. A still
     that is genuinely the LCP element should pass `priority` — see the
     destination pages, which do. */
  priority = false,
  /* The scrim over the background. Left unset, the hero draws the three-layer
     scrim below, which is what the home and destination frames specify. A page
     whose frame states a different one passes it as a single class — /about-us
     draws a flat #000000 at 20%, straight off its Figma panel — and that one
     layer replaces the trio rather than stacking on top of it. */
  overlayClassName,
  className,
}) {
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
      className={cn(
        "sticky top-0 z-0 flex min-h-screen items-center justify-center overflow-hidden",
        className,
      )}
    >
      {/* Without JS the entrance tweens never run, so reveal the copy up front. */}
      <noscript>
        <style>{`.hero-eyebrow,.hero-heading,.hero-description,.hero-cta{opacity:1 !important}`}</style>
      </noscript>

      <div className="hero-image absolute inset-0">
        {video ? (
          /* Hero background video — falls back to the poster image */
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            src={video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        ) : (
          image && (
            <Image
              className="object-cover object-center"
              src={image}
              alt={imageAlt}
              fill
              sizes="100vw"
              priority={priority}
            />
          )
        )}
        {overlayClassName ? (
          <div aria-hidden="true" className={cn("absolute inset-0", overlayClassName)} />
        ) : (
          <>
            {/* Scrim tuned so white/90 copy clears WCAG AA over the brightest
                areas of the photo, including the sky band on tall viewports. */}
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/20 to-transparent" />
          </>
        )}
      </div>

      <Container className="relative flex flex-col items-center max-md:gap-4 gap-6 pt-20 text-center">
        <span className="hero-eyebrow font-top max-md:text-[13px] text-h4 text-white/90 opacity-0">
          {eyebrow}
        </span>

        <h1
          // lg to 2xl: a narrower measure so the title holds two lines, and
          // the h2 token instead of HERO_HEADING's 52px step — the next size
          // down that already exists in the scale, so nothing new is invented
          // for this band. Below lg and from 2xl up are untouched.
          /* whitespace-pre-line honours a deliberate break in the title — the
             package frame sets its two lines explicitly — and still wraps on
             overflow, so the single-line home and region titles are unaffected. */
          className={`hero-heading ${HERO_HEADING} whitespace-pre-line max-md:max-w-[400px] max-w-4xl lg:max-2xl:max-w-[620px] text-white opacity-0`}
        >
          {title}
        </h1>

        <p
          className={`hero-description ${HERO_BODY} max-md:max-w-[400px] max-w-3xl max-md:text-white/80 text-white/90 opacity-0 max-md:px-4`}
        >
          {description}
        </p>

        {note && (
          /* Shares the description's entrance class so the two lines arrive
             together rather than as two separate beats. */
          <p
            className={`hero-description ${HERO_BODY} max-md:max-w-[313px] max-w-lg font-medium text-white opacity-0 max-md:px-4 -mt-4 max-md:-mt-2`}
          >
            {note}
          </p>
        )}

        {/* Wraps rather than nowrap. Held on one line, a narrow phone
            squeezed each control until its own label broke over two lines —
            "Book Your Seat" over 64px of button — which stops reading as a
            button at all. Wrapping only engages when the row genuinely does not
            fit, so the single-CTA and short-label heroes are unchanged. */}
        <div className="hero-cta mt-4 flex flex-wrap items-center justify-center max-md:gap-4 gap-x-6 gap-y-3 max-md:text-[13px] max-md:leading-6 text-body text-white/90 opacity-0">
          {ctas.map((link) => (
            <CtaLink
              key={link.label}
              href={link.href}
              fill
              className={`${HERO_CTA} border-white/40 whitespace-nowrap`}
            >
              {link.label}
            </CtaLink>
          ))}
        </div>
      </Container>
    </section>
  );
}
