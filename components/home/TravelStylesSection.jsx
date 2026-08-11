"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { AnimateIn } from "@/components/common/AnimateIn";
import { FrameButton } from "@/components/common/FrameButton";
import { useReveal } from "@/lib/useReveal";

const STYLES = [
  {
    key: "relax",
    label: "Relax.",
    image: "/home/image-4.png",
    alt: "Traveller in a white dress unwinding on the deck of a river cruiser",
  },
  {
    key: "explore",
    label: "Explore.",
    image: "/home/journal/city-guide.png",
    alt: "Sunlit city streets waiting to be wandered",
  },
  {
    key: "celebrate",
    label: "Celebrate.",
    image: "/home/image-2.jpg",
    alt: "Family celebrating together at a theme-park entrance",
  },
  {
    key: "adventure",
    label: "Adventure.",
    image: "/home/swiss-alpine.png",
    alt: "Snow-capped alpine peaks above a mountain trail",
  },
  {
    key: "spiritual",
    label: "Spiritual.",
    image: "/home/journal/climatic.png",
    alt: "Temple walk beneath cherry blossoms in Kyoto",
  },
  {
    key: "luxury",
    label: "Luxury.",
    image: "/home/journal/coastal-escape.png",
    alt: "Cliffside coastal town above a glittering sea",
  },
  {
    key: "wildlife",
    label: "Wildlife.",
    image: "/home/grand-usa.png",
    alt: "Vast canyon landscape carved by wind and water",
  },
  {
    key: "cruise",
    label: "Cruise.",
    image: "/home/image-1.png",
    alt: "Sunset over the deck of a sailing river cruise ship",
  },
];

export function TravelStylesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useReveal({ stagger: 0.08, y: 40 });

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const childWidth = scrollRef.current.children[0].offsetWidth;
    const gap = 6; // gap-1.5 is 6px
    const index = Math.round(scrollLeft / (childWidth + gap));
    setActiveIndex(index);
  };

  return (
    <section
      aria-label="Compass — discover your travel style"
      className="spacing"
    >
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Chapter 04 — Compass"
          title="Discover your travel style."
          description="Share how you want to feel. Our concierge will create a unique itinerary."
        />
      </Container>

      {/* Full-bleed style cards: 6px outer margin + 6px gap (Figma) */}
      <ul
        ref={scrollRef}
        onScroll={handleScroll}
        className="mt-16 max-lg:flex max-lg:overflow-x-auto max-lg:snap-x max-lg:snap-mandatory grid grid-cols-2 gap-1.5 px-1.5 sm:grid-cols-4 lg:grid-cols-8 max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden"
      >
        {STYLES.map((style) => (
          <li
            key={style.key}
            className="max-lg:snap-center max-lg:shrink-0 max-sm:w-[142px] sm:max-lg:w-[35vw] relative max-sm:aspect-[142/233] aspect-[234/397] overflow-hidden w-full"
          >
            <Image
              src={style.image}
              alt={style.alt}
              fill
              sizes="(min-width: 1024px) 12vw, (min-width: 640px) 25vw, 50vw"
              className="object-cover"
            />
            {/* Figma image overlay: black fading out towards the base */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent"
              aria-hidden="true"
            />

            <span className="text-body max-sm:font-light max-sm:text-[12px] max-sm:leading-6 pointer-events-none absolute inset-x-0 top-6 text-center text-white">
              I want.
            </span>

            {/* 125×43 label chip, 20px off the bottom (Figma) */}
            <span className="absolute inset-x-0 bottom-5 flex justify-center">
              <FrameButton
              >
                {style.label}
              </FrameButton>
            </span>
          </li>
        ))}
      </ul>

      {/* Pagination Dots (Mobile Only) */}
      <div className="mt-6 flex justify-center gap-[4px] lg:hidden">
        {STYLES.map((_, i) => (
          <span
            key={i}
            className={`h-[7px] w-[7px] transition-colors ${
              i === activeIndex ? "bg-black" : "bg-black/20"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      <AnimateIn y={16} className="mt-24 flex justify-center">
        <FrameButton variant="rail">Reveal my journeys.</FrameButton>
      </AnimateIn>
    </section>
  );
}
