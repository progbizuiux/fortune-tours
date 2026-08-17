"use client";

import { useRef } from "react";
import Image from "next/image";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { CtaLink } from "@/components/common/CtaLink";
import { HERO_BODY, HERO_CTA, HERO_HEADING_NARROW } from "@/lib/typography";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/* Opening section of every /experiences/<slug> page — Figma "Experience -
 * Honeymoon", desktop frame 1920x800.
 *
 * Fully prop-driven so the next experience (family, adventure, wellness) is a
 * page file and nothing else. Only the copy, the CTA and the photograph change
 * between them; the geometry below is the same frame every time.
 *
 * Figma values, all measured from the section's own top-left (the 106px in the
 * frame is the design's navbar, which is this section's pt-20 here):
 *   section      1920 x 800, fill #FAF7F2                  -> bg-cream
 *   breadcrumb   top 51,  Spartan 400 18/23.43, #262626
 *   heading      box 590 x 189, Neiko 400 85/94.5, #0C2233  -> text-navy
 *   description  box 486 x 54,  Poppins 300 18/27, #000 80% -> text-black/80
 *   gaps         heading -> description 18, description -> CTA 47
 *   image        1233 x 746 at top 51 / left 687 (so: flush to the right edge,
 *                and 800 - (51 + 746) = 3px shy of the bottom)
 *
 * Two things are expressed as percentages rather than the raw px, because the
 * design only balances at exactly 1920 and fixed values break in between:
 *
 *   - The image is 1233/1920 = 64.219% wide and pinned top-51 / bottom-3, so it
 *     reproduces 1233x746 exactly at 1920 and keeps the same edges at every
 *     other width instead of leaving a growing gap under itself.
 *   - The copy's max-widths are 590px and 486px as a share of Container's
 *     content box (1760px at 1920) = 33.523% and 27.614%. With the px values
 *     the description ran underneath the absolutely-positioned image anywhere
 *     between 1280 and ~1600; as a share of the box it keeps the design's 17px
 *     gutter at every width.
 *
 * The split starts at xl (1280) rather than lg: below that the copy column is
 * narrower than the heading's own first word, so it stacks instead.
 */
export function ExperienceHero({
  crumbs,
  title,
  description,
  ctaLabel,
  ctaHref = "#",
  image,
  imageAlt,
  className,
}) {
  const containerRef = useRef(null);

  /* A plain timeline, not AnimateIn/useReveal — the same choice the Kerala and
     home heroes make. Those are ScrollTrigger reveals, which is the wrong
     instrument for the top of a page: there is no scroll to react to, so the
     entrance wants to be an on-load sequence with its own ordering (trail,
     then heading, then body). Nothing is wrong with useReveal here — it does
     fire for elements already in view — it just has no scroll to key off. */
  useGSAP(
    () => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".hero-crumbs",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
        )
        .fromTo(
          ".hero-heading",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.35",
        )
        .fromTo(
          ".hero-body",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          "-=0.45",
        );
    },
    { scope: containerRef },
  );

  return (
    <>
      {/* The navbar is transparent with a white logo until an element marked
          like this crosses under it. On a cream hero that would leave the mark
          invisible at the top of the scroll, so a zero-height marker at the
          document top starts it solid and keeps it there — same as /search. */}
      <div data-navbar-solid-from aria-hidden="true" />

      <section
        ref={containerRef}
        className={cn("bg-cream relative pt-20", className)}
      >
        <noscript>
          <style>{`.hero-crumbs,.hero-heading,.hero-body{opacity:1 !important}`}</style>
        </noscript>

        {/* Positioning context for the image. The Container is its only in-flow
            child, so on xl this box is exactly the 800px frame and the image's
            top/bottom insets resolve against it. */}
        <div className="relative">
          {/* Stacked paddings are InspirationBanner's (/search), which px comes
              from Container, pt-10/pb-14 here. Everything from xl up is the
              honeymoon frame's own geometry.

              The frame height has to track the picture, not sit at a flat 800px.
              The copy is bottom-anchored (mt-auto against this padding), so once
              the picture shrank onto its ratio between lg and 2xl a fixed 800
              left the copy stranded below the picture's bottom edge with a block
              of empty cream beside it.

              38.855vw is the picture's own height (64.219% of the viewport over
              its 1233:746 ratio), so this is 51 above it + the picture + the
              spec's 3px underneath, capped at the spec's 800 from 1920 up where
              the picture itself caps. That keeps the design's actual
              relationship at every width: the frame is always 86 up from the
              bottom to the copy and 3 to the picture, so the copy lands exactly
              83px above the picture's bottom edge — which is where 1920 puts
              it. min-, not max-, so longer copy can still grow the frame. */}
          {/* pb-6 while stacked: with the CTA moved below the picture, the copy
              ends on the description, and 24 is the gap the phone frame puts
              between it and the picture's top edge. */}
          <Container className="relative flex flex-col pt-10 pb-6 xl:min-h-[min(38.855vw_+_54px,800px)] xl:pt-[51px] xl:pb-[86px]">
            <Breadcrumb
              items={crumbs}
              className="hero-crumbs font-top text-body leading-[130%] font-normal text-[#262626] opacity-0"
            />

            {/* mt-auto drops the block onto the frame's bottom padding, which is
                where the 800px height puts it in the design (heading top lands
                at 366). Below xl there is no min-height for it to bite on, so
                the stacked margin carries the spacing — 12, the trail → heading
                gap the phone frame measures. */}
            <div className="mt-3 flex flex-col xl:mt-auto">
              {/* The heading ramp is InspirationBanner's, class for class, so
                  the two frames that draw this same picture-beside-copy band
                  size their titles identically at every width: the bare h1 tag
                  scale while stacked (the phone's ~42), text-h2 through lg, and
                  the clamp that lands on the spec's 85 at the 1920 frame from
                  xl. Leading is its 1.1118 — the spec's 94.5/85, and the 110%
                  the phone frame asks for — since the tag default is a flat 1
                  and closes the two lines up.

                  Note `text-h1` is deliberately absent: that utility is built
                  from an `@theme inline` token, so it compiles to the literal
                  clamp and never sees the 1024-1535 downscale — it would stand
                  at 85px from 1280, where this copy column is 377px wide and
                  "Honeymoon" is a 402px word with nowhere to wrap. */}
              <h1
                className={`hero-heading ${HERO_HEADING_NARROW} text-navy opacity-0 xl:max-w-[33.523%]`}
              >
                {title}
              </h1>

              {/* Stacked margins and the 470px measure are InspirationBanner's;
                  the 18px gap and the proportional measure are this frame's. */}
              {/* The 470 measure belongs to the stacked phone layout. From md to
                  xl the copy has the full width to itself above the picture, so
                  the cap only left a short column under a full-bleed image —
                  released through that band and restored with the two-column
                  frame at xl. */}
              <p
                className={`hero-body ${HERO_BODY} mt-6 max-w-[470px] font-light text-black/80 opacity-0 md:max-w-none lg:mt-8 xl:mt-[18px] xl:max-w-[27.614%]`}
              >
                {description}
              </p>

              {/* Only from xl. Stacked, the CTA is rendered after the picture
                  instead — see below. The two are one control at any given
                  width: this one is display:none while stacked, so it is out of
                  the accessibility tree rather than duplicated for a reader. */}
              {ctaLabel && (
                <div className="hero-body mt-5 hidden items-center opacity-0 lg:mt-7 xl:mt-[47px] xl:flex">
                  <CtaLink
                    href={ctaHref}
                    fill
                    className={`${HERO_CTA} border-navy/20 text-navy`}
                  >
                    {ctaLabel}
                  </CtaLink>
                </div>
              )}
            </div>
          </Container>

          {/* Stacked under the copy below xl, pinned to the frame's right edge
              from xl up. object-cover absorbs the difference between the 1233:746
              crop and the box once the width scales off 1920.

              The two stacked heights are InspirationBanner's, and its reasoning
              carries over unchanged: a fixed ratio that reads well on a tablet
              is a letterbox strip on a 375px phone, and an interpolated height
              gives ~16:9 at 375 and ~5:2 at 768 with no step in between.

              From xl the height comes off the spec's own 1233:746 aspect rather
              than a bottom inset, which is what shrinks it between lg and 2xl.
              The width always tracked the viewport but the height was pinned to
              the 800px frame, so the picture kept its full 746px all the way
              down: the crop went from the spec's 1.65 aspect to 1.10 at 1280, a
              near-square slab that swallowed the section. On the ratio it scales
              instead — 812x491 at 1280, and 1233x746 at a 1920 frame, which puts
              its bottom edge on 797 and reproduces the spec's 3px gap exactly.
              So this is both the reduction and a truer crop, and because it is
              one continuous ratio there is no step at any breakpoint.

              The lg-to-xl clamp is pulled back about 13% from the stacked
              heights it shared with InspirationBanner — 400 rather than 460 at
              1024, 486 rather than 561 at 1279. It meets the xl ratio almost
              exactly (491 at 1280), so the picture still hands over to the
              two-column frame without a step.

              max-w caps it at the spec's 1233px, which the ratio makes
              load-bearing rather than tidy: on a percentage width the height now
              grows with the viewport too, so past 1920 an uncapped picture would
              outgrow the 800px frame and spill into the section below. Capped,
              it settles at exactly 1233x746 and every wider screen just gains
              cream on the left, the way the type scale settles at its 1920
              values. */}
          <div className="relative h-[clamp(180px,24.4vw_+_119.4px,400px)] w-full lg:h-[clamp(400px,38vw,640px)] xl:absolute xl:top-[51px] xl:right-0 xl:aspect-[1233/746] xl:h-auto xl:w-[64.219%] xl:max-w-[1233px]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 1280px) 65vw, 100vw"
              className="object-cover"
              priority
            />
          </div>

          {/* The stacked CTA. It sits after the picture rather than under the
              copy, so the section closes on the action instead of burying it
              mid-scroll, and it is centred because there is no copy column to
              align to once the frame is a single stack. Hidden from xl, where
              the copy block above carries it instead.

              pt-6 is the 24 the frame measures from the picture's bottom edge to
              the button. */}
          {ctaLabel && (
            <div className="hero-body flex justify-center px-4 pt-6 pb-14 opacity-0 md:px-8 xl:hidden">
              <CtaLink
                href={ctaHref}
                fill
                className={`${HERO_CTA} border-navy/20 text-navy`}
              >
                {ctaLabel}
              </CtaLink>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
