"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";

const FALLBACK_DESTINATIONS = [
  { name: "Botswana", image: "/destinations/kerala/wildlife.avif" },
  { name: "Egypt", image: "/destination/india.avif" },
  { name: "Kenya", image: "/destinations/kerala/elephants-sri-lanka.jpg" },
  { name: "Congo", image: "/experiance/bali.png" },
  { name: "Ethiopia", image: "/experiance/paris.png" },
  { name: "Madagascar", image: "/destination/japan.avif" },
  { name: "Malawi", image: "/destination/switzerland.avif" },
  { name: "Mauritius", image: "/experiance/mauritius.png" },
];

export function RegionDestinationsSection({
  viewMoreLabel = "View More Destinations",
  eyebrow = "Where will you go next?",
  title = "Choose your next story.",
  description = "Explore extraordinary places, from ancient cities to wild landscapes. Find the destination that feels right for your next journey.",
  destinations = FALLBACK_DESTINATIONS,
  className,
}) {
  const [showAll, setShowAll] = useState(false);
  const visibleDestinations = showAll ? destinations : destinations.slice(0, 8);
  const hasMore = destinations.length > 8 && !showAll;

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth, children } = scrollRef.current;
    
    if (scrollLeft + clientWidth >= scrollWidth - 2) {
      setActiveIndex(destinations.length - 1);
      return;
    }

    const childWidth = children[0].offsetWidth;
    const gap = 4; // gap-[4px]
    const index = Math.round(scrollLeft / (childWidth + gap));
    setActiveIndex(index);
  };
  return (
    <section className={cn("bg-background relative z-10 pt-16 md:pt-24 pb-16 md:pb-24", className)}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="left"
        />
      </Container>

      {/* The grid stretches almost full width. The design has 5px left margin. 
          We'll use a wrapper with px-[5px] to match exactly, or just a small padding. */}
      <div className="w-full px-[5px] mt-10 md:mt-16">
        <ul
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory md:grid md:grid-cols-4 gap-x-[4px] max-md:gap-x-2 gap-y-[40px] max-md:pb-6 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden"
        >
          {visibleDestinations.map((dest, i) => (
            <li key={dest.name} className="max-md:snap-center max-md:shrink-0 max-md:w-[85vw]">
              <Link
                href={dest.href ?? `/destinations/${dest.name.toLowerCase()}`}
                className="group block"
              >
                {/* 474x342 aspect ratio from Figma */}
                <div className="relative w-full aspect-[474/342] overflow-hidden bg-navy/5">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(min-width: 768px) 25vw, 85vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                {/* 16px gap from image to text as per screenshot */}
                <h3 className="mt-[16px] text-black max-lg:text-[20px]">
                  {dest.name}
                </h3>
              </Link>
            </li>
          ))}
        </ul>

        {/* Pagination Dots (Mobile Only) */}
        <div className="flex justify-center gap-[4px] pt-4 md:hidden">
          {visibleDestinations.map((_, i) => (
            <span
              key={i}
              className={`h-[7px] w-[7px] transition-colors ${
                i === activeIndex ? "bg-black" : "bg-black/20"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* View More Button */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <Button variant="outline" onClick={() => setShowAll(true)}>
              {viewMoreLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
