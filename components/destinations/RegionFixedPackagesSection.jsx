"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CtaLink } from "@/components/common/CtaLink";
import { FrameButton } from "@/components/common/FrameButton";
import { PackageCard } from "@/components/common/PackageCard";
import { cn } from "@/lib/utils";

const PACKAGES = [
  {
    id: "flavors",
    title: "Flavors of Malabar",
    image: "/destinations/kerala/food-culinary.jpg",
    meta: "5 DAYS · KOZHIKODE · KANNUR · WAYANAD",
    experiences:
      "Malabar Biryani · Local Food Walk · Spice Markets · Traditional Cooking",
  },
  {
    id: "wild",
    title: "Wild Heart of Kerala",
    image: "/destinations/kerala/wildlife.avif",
    meta: "5 DAYS · MUNNAR · THEKKADY · WAYANAD",
    experiences: "Tea Estate · Wildlife Safari · Nature Walk · Bamboo Rafting",
  },
  {
    id: "unhurried",
    title: "Kerala Unhurried",
    image: "/destinations/kerala/houseboat-alappuzha.jpg",
    meta: "5 DAYS · KUMARAKOM · ALLEPPEY · MARARI",
    experiences: "Luxury Houseboat · Ayurveda · Village Life · Beach Retreat",
  },
];

/* Content comes from lib/strapi/kerala.js via the page; PACKAGES above is the
   fallback. The CMS stores duration and the place list as separate fields —
   the normaliser is what joins them into the card's single meta line. */

/* Every card carries its own button. The label is fixed — it names the
   action, not the page — and the link is the package's own `link` field,
   then the section's ctaLink, then the trip planner, so no card ever draws a
   dead button. (/itinerary, which editors type for both fields, redirects to
   the planner in next.config.mjs.) */
const CARD_CTA_LABEL = "View Itinerary";
const PLANNER_HREF = "/plan-my-trip";
const cardCtaHref = (pkg, sectionHref) =>
  pkg.href || sectionHref || PLANNER_HREF;
/* The section's call to action, drawn in one place because it now has two
   homes: inside the solo card, and under a row of them.

   A link when the entry names one, the inert framed button when it does not —
   Kerala's entry fills the label only, and turning that into an <a href="#">
   would put a dead link on the page. */
function PackageCta({ label, href }) {
  if (!label) return null;

  return href ? (
    <CtaLink
      href={href}
      fill
      className="text-body border-navy/20 text-black max-md:text-[13px] max-md:min-h-11 border-x px-5"
    >
      {label}
    </CtaLink>
  ) : (
    <FrameButton variant="rail" className="max-md:text-[13px]">
      {label}
    </FrameButton>
  );
}

/* The single-departure card: picture left, copy right, an even split from md,
   centred at the width of two grid cards.
 *
 * Not a PackageCard variant. That card is a vertical box shared with the
 * honeymoon section, and its whole layout — the picture on top, the mt-auto
 * that bottom-aligns a row of cards against each other — is what makes a row
 * of three line up. None of it applies to one card on its own, so an
 * `orientation` prop there would mean two layouts in a component that exists
 * to draw one. The type treatments below are copied from it deliberately, so
 * the two read as the same card at two sizes.
 *
 * The copy runs from the top rather than bottom-pinned: there is no sibling
 * card for its baselines to agree with. Only the CTA is bottom-pinned, and to
 * this card's own picture rather than to a neighbour. */
function SoloPackageCard({
  title,
  meta,
  experiences,
  experiencesLabel = "EXPERIENCES:",
  image,
  alt,
  ctaLabel,
  ctaHref,
}) {
  return (
    <article className="mx-auto flex max-w-[560px] flex-col border border-black/10 bg-white md:max-w-[720px] md:flex-row lg:max-xl:max-w-[680px] xl:max-w-[760px] 2xl:max-w-[880px]">
      {/* Stacked below md — a half-width column on a phone leaves the copy in a
          20-character measure. From md the card splits evenly, picture and copy
          on half each, and the picture self-stretches to the card's full
          height, however tall the copy beside it runs. */}
      <div className="relative aspect-[348/260] w-full shrink-0 sm:aspect-[348/300] md:aspect-auto md:w-1/2 md:min-h-[280px] md:self-stretch xl:min-h-[310px]">
        <Image
          src={image}
          alt={alt ?? title}
          fill
          sizes="(min-width: 1536px) 440px, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* w-1/2 rather than flex-1: the copy is the other half exactly, and a
          long unbroken word cannot push the split off 50/50. min-w-0 keeps it
          shrinkable inside the flex row. */}
      <div className="flex w-full min-w-0 flex-col px-[16px] py-[20px] md:w-1/2 md:px-[24px] md:py-[26px] xl:px-[30px] xl:py-[34px]">
        <h3 className="font-heading text-[20px] leading-[1.25] font-normal text-black md:text-[24px] lg:max-xl:text-[27px] xl:max-2xl:text-[32px] 2xl:text-[32px]">
          {title}
        </h3>

        <p className="font-sans mt-[12px] text-[12px] leading-[1.4] font-light tracking-wider text-black md:mt-[16px] md:text-[13px] 2xl:text-[14px]">
          {meta}
        </p>

        <p className="font-sans mt-[16px] mb-1 text-[12px] leading-[1] font-light uppercase text-black/80 md:mt-[20px] md:text-[13px] lg:text-[16px]">
          {experiencesLabel}
        </p>
        <p className="font-sans text-[13px] leading-[1.5] font-light text-black/80 lg:text-[16px] lg:leading-[22px] line-clamp-3">
          {experiences}
        </p>

        {/* The CTA belongs to this card rather than to the section: with one
            departure there is nothing else for it to act on, and a button
            floating under a lone card reads as unattached. mt-auto pins it to
            the bottom of the copy column so it lines up with the foot of the
            picture however short the copy runs, with a floor under it for the
            case where the copy is long enough to close the gap itself. */}
        {ctaLabel && (
          <div className="mt-auto flex items-center pt-[20px] md:pt-[26px]">
            <PackageCta label={ctaLabel} href={ctaHref} />
          </div>
        )}
      </div>
    </article>
  );
}

const ARROW_CLASS =
  "flex h-[70px] w-[62px] shrink-0 items-center justify-center border-[0.7px] border-black/50 p-[10px] backdrop-blur-[15px] transition-opacity disabled:opacity-30 lg:max-xl:h-[54px] lg:max-xl:w-[48px]";

/* The three CMS-only props — the section is drawn by three pages now (Kerala's
   region, the continent pages and the country pages), so each is handled as
   "what the entry says, or nothing":

   `ctaLabel` has no default. The design's own line names Kerala, and a country
   entry that fills packagesSection but leaves the CTA empty was rendering
   "View all Kerala packages" under a South African departure. An absent label
   draws no button at all, matching CalloutSection, TextBlock and
   PackageCarouselSection.

   `ctaHref` makes that button a real link. `experiencesLabel` replaces the
   card's own "EXPERIENCES:" line. Both were already coming out of the
   normaliser (packagesSection.ctaLink / .experiencesLabel) and being dropped
   here, so an editor filling either field saw no change on the page. */
export function RegionFixedPackagesSection({
  eyebrow = "Fixed Packages",
  title = "Find the Perfect Escape",
  description = "Small-group journeys with a host. Fixed dates, limited seats.",
  items = PACKAGES,
  /* Accepted for the CMS shape but no longer drawn — see the note under the
     grid. */
  // eslint-disable-next-line no-unused-vars
  ctaLabel,
  ctaHref,
  experiencesLabel,
  /* Top padding is off by default: on the region pages this section follows
     RegionStoriesSection, which already closes with a full `.spacing` gap, and
     doubling it left a band of empty page between the two. The country pages
     run it straight after the dark plan-my-trip panel, which ends at its own
     edge — there it needs the site's standard rhythm above it, so they opt in.
     `.spacing` is what supplies the padding either way, so the gap is the same
     size as every other section break on the page. */
  withTopSpacing = false,
  className,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef(null);

  /* One departure is drawn wide instead of squeezed into the first cell of a
     three-column grid — a lone portrait card beside two empty columns reads as
     a page that failed to load. Several countries sell exactly one fixed
     departure, so this is the common case there, not an edge case. */
  const isSolo = items.length === 1;
  const isSlider = items.length > 3;

  /* Two departures take two columns, not the first two cells of three — a grid
     drawn for three leaves a card-shaped hole on the right, which reads as a
     picture that failed to load. Three keep the design's three-up. More than
     three slide horizontally with navigation arrows. */
  const gridColumns =
    items.length === 2
      ? "xl:grid-cols-2 xl:mx-auto xl:max-w-[940px]"
      : "xl:grid-cols-3";

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth, children } =
      scrollRef.current;

    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);

    if (scrollLeft + clientWidth >= scrollWidth - 2) {
      setActiveIndex(items.length - 1);
      return;
    }

    if (children && children.length) {
      const childWidth = children[0].offsetWidth;
      const gap = children[1]
        ? children[1].offsetLeft - children[0].offsetLeft - children[0].offsetWidth
        : 16;
      const index = Math.round(scrollLeft / (childWidth + gap));
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [items.length]);

  const scrollPrev = () => {
    if (!scrollRef.current) return;
    const { children } = scrollRef.current;
    if (!children || !children.length) return;
    const childWidth = children[0].offsetWidth;
    const gap = children[1]
      ? children[1].offsetLeft - children[0].offsetLeft - children[0].offsetWidth
      : 16;
    scrollRef.current.scrollBy({
      left: -(childWidth + gap),
      behavior: "smooth",
    });
  };

  const scrollNext = () => {
    if (!scrollRef.current) return;
    const { children } = scrollRef.current;
    if (!children || !children.length) return;
    const childWidth = children[0].offsetWidth;
    const gap = children[1]
      ? children[1].offsetLeft - children[0].offsetLeft - children[0].offsetWidth
      : 16;
    scrollRef.current.scrollBy({
      left: childWidth + gap,
      behavior: "smooth",
    });
  };

  return (
    // cn() runs twMerge, so a `!pt-*` passed through className replaces the
    // `!pt-0` below rather than fighting it — the important flag is needed on
    // both because `.spacing` is unlayered and outranks a plain utility.
    <section
      className={cn(
        "relative z-10 bg-background spacing lg:max-xl:pb-[20px] xl:max-2xl:pb-[30px]",
        !withTopSpacing && "!pt-0",
        className,
      )}
    >
      <Container>
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        {/* 64px under the heading is the design's desktop figure; on a phone it
            is a quarter of the viewport, so it steps up with the screen. */}
        <div className="mt-8 max-w-7xl mx-auto sm:mt-10 md:mt-12 lg:max-xl:mt-10 xl:mt-16">
          {isSolo ? (
            <SoloPackageCard
              {...items[0]}
              experiencesLabel={experiencesLabel || undefined}
              ctaLabel={CARD_CTA_LABEL}
              ctaHref={cardCtaHref(items[0], ctaHref)}
            />
          ) : (
            /* Grid layout for 2-3 items on desktop, sliding carousel when > 3 items */
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className={cn(
                "flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-4 xl:gap-[42px]",
                !isSlider && cn("max-xl:overflow-x-auto xl:grid", gridColumns),
              )}
            >
              {/* The card is components/common/PackageCard, shared with the
                  honeymoon package section. The two className hooks carry this
                  section's own values — a 447x423 picture and the smaller,
                  letter-spaced, full-black meta line — so nothing here changed
                  when the markup moved. */}
              {items.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  title={pkg.title}
                  meta={pkg.meta}
                  experiences={pkg.experiences}
                  // Undefined when the entry leaves the field empty, so the
                  // card falls back to its own label rather than printing
                  // nothing.
                  experiencesLabel={experiencesLabel || undefined}
                  image={pkg.image}
                  alt={pkg.alt}
                  ctaLabel={CARD_CTA_LABEL}
                  ctaHref={cardCtaHref(pkg, ctaHref)}
                  className={cn(
                    "max-xl:w-[85vw] max-md:max-w-[348px] md:max-xl:max-w-[447px] lg:max-xl:max-w-[372px] max-xl:shrink-0 max-xl:snap-center",
                    isSlider && "xl:w-[calc((100%-84px)/3)] xl:max-w-none xl:shrink-0 xl:snap-start",
                  )}
                  imageAspectClassName="aspect-[348/329] md:aspect-[447/423]"
                  metaClassName="text-[13px] md:text-[12px] leading-tight text-black tracking-wider mb-[10px] lg:mb-[12px]"
                  experiencesClassName="line-clamp-3"
                  contentClassName="px-[12px] pt-[15px] pb-[16px] md:px-[33px] md:pb-[35px]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw"
                />
              ))}
            </div>
          )}

          {/* Navigation Arrows (Desktop) & Pagination Dots (Mobile) */}
          {!isSolo && (
            <div className={cn("mt-6 flex items-center justify-center", isSlider && "md:mt-8")}>
              {/* Mobile / Tablet Pagination Dots */}
              <div className={cn("flex gap-[4px]", isSlider ? "md:hidden" : "xl:hidden")}>
                {items.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-[7px] w-[7px] transition-colors",
                      i === activeIndex ? "bg-black" : "bg-black/20",
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Desktop / Tablet Arrows when > 3 cards */}
              {isSlider && (canScrollLeft || canScrollRight) && (
                <div className="hidden md:flex items-center gap-[10px] ml-auto">
                  <button
                    type="button"
                    onClick={scrollPrev}
                    disabled={!canScrollLeft}
                    className={ARROW_CLASS}
                    aria-label="Previous packages"
                  >
                    <ChevronLeft className="size-4 stroke-1 text-black" />
                  </button>
                  <button
                    type="button"
                    onClick={scrollNext}
                    disabled={!canScrollRight}
                    className={ARROW_CLASS}
                    aria-label="Next packages"
                  >
                    <ChevronRight className="size-4 stroke-1 text-black" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
