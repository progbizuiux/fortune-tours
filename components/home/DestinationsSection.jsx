"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { FullContainer } from "@/components/common/FullContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CloudTransition } from "@/components/home/CloudTransition";
import { useRowRise } from "@/lib/useRowRise";

// Drop matching files into public/destinations/ and the placeholder below is
// replaced automatically — no other change needed.
const DESTINATIONS = [
  {
    name: "Japan.",
    caption: "Temples, cities, blossoms.",
    href: "/destinations/japan",
    image: "/destination/japan.avif",
  },
  {
    name: "Switzerland.",
    caption: "Wake up in the Alps.",
    href: "/destinations/switzerland",
    image: "/destination/switzerland.avif",
  },
  {
    name: "India.",
    caption: "Where time slows.",
    href: "/destinations/india",
    image: "/destination/india.avif",
  },
  {
    name: "Norway.",
    caption: "Chase northern lights.",
    href: "/destinations/norway",
    image: "/destination/norway.avif",
  },
];

const HAS_IMAGES = true;

// Must track the grid below: 4 columns at lg, 2 at sm, 1 on phones.
const CARD_SIZES =
  "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 1rem)";

export function DestinationsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // The scroll-scrubbed entrance the cards rise in on — shared, and described
  // in full, in lib/useRowRise.js. The row already needs a ref for the mobile
  // scroll handler below, so the hook is handed that one rather than its own.
  const scrollRef = useRef(null);
  useRowRise({ ref: scrollRef });

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const childWidth = scrollRef.current.children[0].offsetWidth;
    const gap = window.innerWidth >= 640 ? 16 : 8;
    const index = Math.round(scrollLeft / (childWidth + gap));
    setActiveIndex(index);
  };

  return (
    // relative z-10 is required, not cosmetic: the hero is sticky (positioned),
    // so without a stacking position of its own this section would paint
    // underneath it instead of scrolling over it.
    <>
    <CloudTransition />
    <section className="bg-background relative z-10 overflow-x-clip">
      {/* Vertical rhythm measured off the design: 40px above the eyebrow,
          24px to the heading, 12px to the sub-line, 56px down to the strip. */}
      <Container className="pt-10 lg:pt-14">
        <SectionHeading
          align="center"
          eyebrow="Chapter 02 - Atlas"
          title="Where will your story start?"
          description="Not destinations, but openings. Each place teaches us something."
          descriptionClassName="lg:max-w-3xl"
        />
      </Container>

      <FullContainer>
        <div className="relative">
          <ul
            ref={scrollRef}
            onScroll={handleScroll}
            className="mt-14 max-lg:flex max-lg:overflow-x-auto max-lg:snap-x max-lg:snap-mandatory grid grid-cols-1 max-lg:gap-2 gap-1.5 max-lg:pb-6 pb-16 sm:grid-cols-2 lg:grid-cols-4 lg:pb-24 max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden"
          >
            {DESTINATIONS.map((destination) => (
              <li key={destination.href} className="max-lg:snap-center max-lg:shrink-0 max-sm:w-[215px] sm:max-md:w-[45vw] md:max-lg:w-[35vw]">
                <Link href={destination.href} className="group block">
                {/* max-lg:aspect-[215/314] for mobile card size, aspect-[3/4] for desktop */}
                <div className="bg-navy/5 relative max-lg:aspect-[215/314] aspect-[3/4] w-full overflow-hidden">
                  {HAS_IMAGES ? (
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      sizes={CARD_SIZES}
                      className="object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.07] group-hover:brightness-105"
                    />
                  ) : (
                    <div className="from-navy/15 to-navy/5 absolute inset-0 flex items-center justify-center bg-gradient-to-br">
                      <span className="text-small text-navy/40">
                        {destination.name}
                      </span>
                    </div>
                  )}

                  {/* Mobile Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent lg:hidden" aria-hidden="true" />

                  {/* Mobile Text (Inside image) */}
                  <div className="absolute inset-x-0 bottom-0 p-4 lg:hidden">
                    <h3 className="font-heading text-[18px] font-normal leading-none text-white">
                      {destination.name}
                    </h3>
                    <p className="text-[12px] text-white/80 mt-[10px]">
                      {destination.caption}
                    </p>
                  </div>
                </div>

                {/* Desktop Text (Outside image) */}
                <div className="mt-3 max-lg:hidden">
                  <h3 className="font-heading text-[24px] leading-none text-navy transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:text-sky group-hover:translate-x-2">
                    {destination.name}
                  </h3>
                  <p className="font-light text-[16px] leading-6 text-black/80 mt-1 transition-all duration-700 delay-75 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-75 group-hover:translate-x-4">
                    {destination.caption}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {/* Pagination Dots (Mobile Only) */}
        <div className="flex justify-center gap-[4px] pb-10 lg:hidden">
          {DESTINATIONS.map((_, i) => (
            <span
              key={i}
              className={`h-[7px] w-[7px] transition-colors ${
                i === activeIndex ? "bg-black" : "bg-black/20"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </FullContainer>
    </section>
    </>
  );
}
