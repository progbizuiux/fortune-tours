"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { FrameButton } from "@/components/common/FrameButton";

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
    experiences:
      "Tea Estate · Wildlife Safari · Nature Walk · Bamboo Rafting",
  },
  {
    id: "unhurried",
    title: "Kerala Unhurried",
    image: "/destinations/kerala/houseboat-alappuzha.jpg",
    meta: "5 DAYS · KUMARAKOM · ALLEPPEY · MARARI",
    experiences:
      "Luxury Houseboat · Ayurveda · Village Life · Beach Retreat",
  },
];

export function FixedPackagesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const childWidth = scrollRef.current.children[0].offsetWidth;
    const gap = 16; // gap-4 is 16px
    const index = Math.round(scrollLeft / (childWidth + gap));
    setActiveIndex(index);
  };

  return (
    <section className="bg-white spacing pt-0!">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Fixed Packages"
          title="Find the Perfect Escape"
          description="Small-group journeys with a host. Fixed dates, limited seats."
        />

        <div className="mt-16 max-w-7xl mx-auto">
          {/* Grid layout on desktop, horizontal scroll snap up to xl */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex max-xl:overflow-x-auto max-xl:snap-x max-xl:snap-mandatory max-xl:[scrollbar-width:none] max-xl:[&::-webkit-scrollbar]:hidden xl:grid xl:grid-cols-3 gap-4 md:gap-6 lg:gap-[15px] xl:gap-[42px]"
          >
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="max-xl:w-[85vw] max-md:max-w-[348px] md:max-xl:max-w-[447px] max-xl:shrink-0 max-xl:snap-center flex flex-col border border-black/10 bg-white overflow-hidden group"
              >
                {/* Image Container: Aspect ratio matching 447x423 roughly (1.05:1) */}
                <div className="relative w-full aspect-[348/329] md:aspect-[447/423] overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Content Container */}
                <div className="px-[12px] pb-[16px] pt-[15px] md:px-[33px] md:pb-[35px] flex flex-col flex-1">
                  <h3 className="font-heading text-[18px] lg:text-[32px] leading-[30px] font-normal text-black mb-[20px] lg:mb-[60px]">
                    {pkg.title}
                  </h3>

                  <div className="mt-auto">
                    <p className="font-sans font-light text-[13px] md:text-[12px] leading-tight text-black uppercase tracking-wider mb-[10px] lg:mb-[12px]">
                      {pkg.meta}
                    </p>
                    
                    <p className="font-sans font-light text-[13px] lg:text-[16px] leading-[1] uppercase text-black/80 mb-1">
                      EXPERIENCES:
                    </p>
                    <p className="font-sans font-light text-[13px] lg:text-[16px] leading-[1.4] lg:leading-[20px] text-black/80">
                      {pkg.experiences}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="mt-6 flex justify-center gap-1 xl:hidden">
            {PACKAGES.map((_, i) => (
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
              View all Kerala packages
            </FrameButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
