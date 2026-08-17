"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

/* Centred chapter heading over a horizontally-scrolled row of picture cards,
   each captioned with a title and a line of copy underneath.

   Extracted verbatim from the Kerala "Must Visit Places" section, which was the
   only copy of it — the honeymoon experience page draws the same section with
   different words, a white ground and four cards instead of five, and none of
   that is a reason to own a second implementation. Kerala now renders through
   here too (components/destinations/kerala/MustVisitSection.jsx), so the card
   geometry, the arrow offsets and the mobile dots have exactly one home.

   The card sizes and the arrows' `top` values are deliberately NOT props: the
   offsets are half of each card's picture height at each breakpoint, so they
   are part of this component's geometry rather than something a call site can
   retune in isolation. Everything a call site legitimately differs on — the
   ground, the copy, the track's own padding — is passed in.

   `items`: { key, title, description, image, alt? }. `alt` falls back to the
   title, which is what Kerala relied on before the extraction. */
export function CardCarouselSection({
  eyebrow,
  title,
  description,
  items,
  ariaLabel,
  className,
  eyebrowClassName,
  descriptionClassName,
  // Defaults are Kerala's: the row breaks out of Container so the cards can run
  // toward the viewport edge. The honeymoon page lines its track up with
  // Container's own padding instead, so this is the one layout knob.
  trackClassName = "px-5 md:px-8 scroll-pl-5 md:scroll-pl-8",
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    const el = scrollRef.current;
    // The children[0] read below throws on an empty track. Kerala always had
    // five cards so it never surfaced, but a CMS-fed call site can hand this an
    // empty list while it loads.
    if (!el || !el.children.length) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 40);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);

    const childWidth = el.children[0].offsetWidth;
    const gap = 15;
    setActiveIndex(Math.round(scrollLeft / (childWidth + gap)));
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 450;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Both arrows sit on the vertical centre of the card pictures, whose height
  // changes at md / lg / 2xl with the card width.
  const arrowPosition =
    "top-[140px] md:top-[251px] lg:top-[185px] 2xl:top-[251px]";

  return (
    <section
      aria-label={ariaLabel}
      className={cn("spacing relative", className)}
    >
      <Container>
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          description={description}
          eyebrowClassName={eyebrowClassName}
          descriptionClassName={descriptionClassName}
        />
      </Container>

      <div className="relative mt-12 md:mt-[77px]">
        <ul
          ref={scrollRef}
          onScroll={checkScroll}
          className={cn(
            "flex snap-x snap-mandatory gap-[15px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            trackClassName,
          )}
        >
          {items.map((item) => (
            <li
              key={item.key}
              className="flex w-[323px] shrink-0 snap-start flex-col gap-[18px] md:w-[437px] lg:w-[323px] 2xl:w-[437px]"
            >
              <div className="bg-navy/5 relative aspect-[323/371] w-full overflow-hidden md:aspect-[437/502] lg:aspect-[323/371] 2xl:aspect-[437/502]">
                <Image
                  src={item.image}
                  alt={item.alt ?? item.title}
                  fill
                  sizes="(min-width: 768px) 437px, 323px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex max-w-[323px] flex-col gap-[20px]">
                <h3 className="font-heading text-[24px] leading-[1] font-normal text-black">
                  {item.title}
                </h3>
                <p className="font-sans text-[16px] leading-[1.5] font-light text-black/80">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className={cn(
              "absolute left-4 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110 md:left-12 md:flex",
              arrowPosition,
            )}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-black/60" strokeWidth={2} />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className={cn(
              "absolute right-4 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110 md:right-12 md:flex",
              arrowPosition,
            )}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-black/60" strokeWidth={2} />
          </button>
        )}

        {/* Pagination dots (mobile only) */}
        <div className="mt-8 flex justify-center gap-[4px] md:hidden">
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
    </section>
  );
}
