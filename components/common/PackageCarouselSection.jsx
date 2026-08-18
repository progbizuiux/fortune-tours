"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CtaLink } from "@/components/common/CtaLink";
import { PackageCard } from "@/components/common/PackageCard";
import { useCardCascade } from "@/lib/gsap/useCardCascade";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

/* Copy column on the left, a horizontally-scrolled row of PackageCards running
 * off the right edge, and the prev/next pair sitting above the cards.
 *
 * Figma → "Experience - Honeymoon", 1920 frame:
 *   copy column   80 in from the left, ~40% of the frame, so the track starts
 *                 at 768 — which puts 257 between the copy and the first card,
 *                 as measured
 *   sub-block     430 measure: "Journeys Made for Two" in Neiko 400 20/28.9
 *                 #000, the body under it, then the bordered CTA 44 below
 *   cards         460 wide (the picture's own width) with a 15 gutter
 *   arrows        62x70, 0.7px #000 at 50%, 10 padding, 10 apart, 15 blur,
 *                 50.5 above the cards
 *
 * The card itself is PackageCard, shared with Kerala — every type value in it is
 * already this design's.
 *
 * Both arrows render at every scroll position rather than appearing and
 * disappearing: the design shows the pair with the unavailable one dimmed, and a
 * control that vanishes mid-interaction moves the other one under the cursor.
 *
 * `items`: { key, title, meta, experiences, image, alt }.
 */
export function PackageCarouselSection({
  eyebrow,
  title,
  subheading,
  description,
  ctaLabel,
  ctaHref = "#",
  items,
  ariaLabel,
  className,
  // Opt in to the scroll-in cascade (lib/gsap/useCardCascade.js). Off by default so
  // the section can be dropped anywhere without bringing motion with it.
  cascade = false,
}) {
  const trackRef = useRef(null);
  // The section is the trigger, not the track — the reference fires the whole
  // row off its own section reaching 88% of the screen, so the cards cascade
  // as the section arrives rather than each one waiting its turn.
  const sectionRef = useCardCascade({ enabled: cascade });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    const el = trackRef.current;
    if (!el || !el.children.length) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);

    const step = el.children[0].offsetWidth + 15;
    setActiveIndex(Math.round(scrollLeft / step));
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  // One card per press, so the row lands on a card edge rather than drifting to
  // an arbitrary offset the way a fixed pixel amount would.
  const scroll = (direction) => {
    const el = trackRef.current;
    if (!el || !el.children.length) return;

    const step = el.children[0].offsetWidth + 15;
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const arrowClass =
    "flex h-[70px] w-[62px] shrink-0 items-center justify-center border-[0.7px] border-black/50 p-[10px] backdrop-blur-[15px] transition-opacity disabled:opacity-30";

  /* max-xl:pb-0! drops the section's own bottom padding while stacked, so the
     cream sub-block band below the slide runs straight into the next section
     instead of being followed by a strip of white page. `!` because .spacing is
     a plain rule in design-system.css and outranks the utility otherwise — the
     same reason Kerala's packages section writes pt-0!. */
  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      className={cn("spacing pt-0 max-xl:pb-0!", className)}
    >
      {/* Header band: the eyebrow and heading with the arrow pair opposite.
          The arrows belong on this row rather than above the track, which is
          where they started out — the track and the copy were siblings, so both
          columns began at the same top and the cards' top edge landed level with
          the heading's second line instead of below it.

          items-end with the arrows lifted 30.5 puts them alongside the lower
          part of the heading, and the 20 under this band lands the cards just
          past the heading — which together reproduce the redline's 50.5 between
          the arrows and the cards, at any heading line count. */}
      <div className="flex items-end justify-between px-4 md:px-8 xl:px-20">
        {/* SectionHeading rather than a hand-rolled eyebrow and h2, so this
            heading is the project's shared h2 at every width.

            It was on the `text-h2` utility, which is generated from an
            `@theme inline` token and therefore compiles to the literal clamp —
            a flat 65px from 1280 up. In a 40% column that is 426px wide at 1280,
            65px broke the title over three lines. SectionHeading's h2 is a bare
            tag, so it reads var(--text-h2) and picks up the 1024-1535 downscale:
            46px through xl and the full 65px from 2xl, which is two lines in
            both bands, as drawn.

            Only the leading is overridden — the 94.5/85 ratio the rest of this
            design's Neiko headings use, against the token's flat 1. */}
        <SectionHeading
          className="xl:max-w-[40%]"
          eyebrow={eyebrow}
          title={title}
          titleClassName="leading-[1.112]"
        />

        {/* Hidden while stacked: the track is swipeable there, and the dots
            below already say where you are. */}
        <div className="mb-[30.5px] hidden shrink-0 gap-[10px] xl:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous packages"
            className={arrowClass}
          >
            <ChevronLeft className="size-4 stroke-1 text-black" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next packages"
            className={arrowClass}
          >
            <ChevronRight className="size-4 stroke-1 text-black" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col xl:flex-row">
        {/* order-2 puts this after the slide while stacked, where the design has
            it read as a closing note under the cards rather than an intro above
            them. The track's order stays 0, so it leads.

            xl:pb — 121 under the CTA, per the redline. The sub-block is
            bottom-anchored with mt-auto, so without this padding it sat flush
            with the foot of the card row. */}
        {/* mt-12 while stacked: order-2 drops this band below the slide, where
            it otherwise started immediately under the pagination dots. It
            matches the band's own py-12, so the cream reads as its own block
            rather than a continuation of the carousel. */}
        <div className="flex flex-col px-4 md:px-8 max-xl:order-2 max-xl:mt-12 max-xl:items-center max-xl:bg-cream max-xl:py-12 max-xl:text-center xl:w-[40%] xl:shrink-0 xl:pr-0 xl:pb-[121px] xl:pl-20">
          {/* mt-auto drops the sub-block to the foot of the column, which is
              where it sits against the cards in the design. */}
          <div className="flex flex-col max-xl:items-center xl:mt-auto xl:max-w-[430px]">
            {/* Stacked, this block is its own centred unit and takes the mobile
                redlines: 20/100% in navy over 13/150% at #666666 on a 314
                measure, each 16 apart. From xl it is the left column of the
                desktop frame again — 20/28.9 in black over the 18px body. */}
            <h3 className="font-heading text-[20px] leading-[1] font-normal text-navy xl:leading-[28.9px] xl:text-black">
              {subheading}
            </h3>

            {/* Widened off the redline's 314. 440 lets the copy use the full
                gutter-to-gutter width on a phone (343 at 375, since the column's
                px-4 is the real limit there) while still holding a readable
                centred measure on a tablet, where an uncapped line would run the
                whole 700-odd pixels. */}
            <p className="mt-4 max-w-[440px] text-[13px] leading-[1.5] font-light text-[#666666] xl:mt-[26px] xl:max-w-none xl:text-body xl:leading-[1.6] xl:text-black/80">
              {description}
            </p>

            {ctaLabel && (
              <div className="mt-4 flex items-center justify-center xl:mt-11 xl:justify-start">
                <CtaLink
                  href={ctaHref}
                  fill
                  className="text-body text-navy border-navy/20 max-xl:min-h-11 border-x px-5"
                >
                  {ctaLabel}
                </CtaLink>
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* No right padding: the row is meant to run off the frame edge, which
              is what signals there is more to scroll to.

              scroll-pl has to match the padding, the way CardCarouselSection's
              track does. A snap-mandatory row snaps its first item to the snap
              position, which ignores padding — so without it the track silently
              scrolled 16px on load and the first card sat flush against the
              screen edge instead of on the gutter. */}
          <ul
            ref={trackRef}
            onScroll={checkScroll}
            className="mt-10 flex snap-x snap-mandatory gap-[15px] overflow-x-auto px-4 scroll-pl-4 [scrollbar-width:none] md:px-8 md:scroll-pl-8 xl:mt-0 xl:pr-0 xl:pl-0 [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => (
              <li
                key={item.key}
                data-cascade-card={cascade ? "" : undefined}
                /* 462, not 460: the spec's 460x423 is the picture, and the
                   card's 1px border sits outside it on each side. */
                className="w-[85vw] max-w-[348px] shrink-0 snap-start md:max-w-[462px] xl:w-[462px] xl:max-w-none"
              >
                <PackageCard
                  title={item.title}
                  meta={item.meta}
                  experiences={item.experiences}
                  image={item.image}
                  alt={item.alt}
                  className="h-full"
                  cascade={cascade}
                />
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-center gap-[4px] xl:hidden">
            {items.map((item, i) => (
              <span
                key={item.key}
                className={cn(
                  "h-[7px] w-[7px] transition-colors",
                  i === activeIndex ? "bg-black" : "bg-black/20",
                )}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
