"use client";

import { useState, useRef } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { FrameButton } from "@/components/common/FrameButton";
import { PackageCard } from "@/components/common/PackageCard";

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
export function RegionFixedPackagesSection({
  eyebrow = "Fixed Packages",
  title = "Find the Perfect Escape",
  description = "Small-group journeys with a host. Fixed dates, limited seats.",
  items = PACKAGES,
  ctaLabel = "View all Kerala packages",
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth, children } = scrollRef.current;

    if (scrollLeft + clientWidth >= scrollWidth - 2) {
      setActiveIndex(items.length - 1);
      return;
    }

    const childWidth = children[0].offsetWidth;
    const gap = 16; // gap-4 is 16px
    const index = Math.round(scrollLeft / (childWidth + gap));
    setActiveIndex(index);
  };

  return (
    <section className="relative z-10 bg-background spacing !pt-0 lg:max-xl:pb-[20px] xl:max-2xl:pb-[30px]">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="mt-16 max-w-7xl mx-auto lg:max-xl:mt-10">
          {/* Grid layout on desktop, horizontal scroll snap up to xl */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex max-xl:overflow-x-auto max-xl:snap-x max-xl:snap-mandatory max-xl:[scrollbar-width:none] max-xl:[&::-webkit-scrollbar]:hidden xl:grid xl:grid-cols-3 gap-4 xl:gap-[42px]"
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
                image={pkg.image}
                alt={pkg.alt}
                className="max-xl:w-[85vw] max-md:max-w-[348px] md:max-xl:max-w-[447px] lg:max-xl:max-w-[372px] max-xl:shrink-0 max-xl:snap-center"
                imageAspectClassName="aspect-[348/329] md:aspect-[447/423]"
                metaClassName="text-[13px] md:text-[12px] leading-tight text-black tracking-wider mb-[10px] lg:mb-[12px]"
                contentClassName="px-[12px] pt-[15px] pb-[16px] md:px-[33px] md:pb-[35px]"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw"
              />
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="mt-6 flex justify-center gap-1 xl:hidden">
            {items.map((_, i) => (
              <span
                key={i}
                className={`block h-[6px] w-[6px] transition-colors ${
                  i === activeIndex ? "bg-black" : "bg-black/30"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="mt-12 md:mt-16 flex items-center justify-center">
            <FrameButton variant="rail" className="max-md:text-[13px]">
              {ctaLabel}
            </FrameButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
