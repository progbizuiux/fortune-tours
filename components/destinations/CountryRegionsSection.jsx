"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

const FALLBACK_REGIONS = [
  {
    title: "Okavango Delta",
    subtitle: "Where water meets the wild.",
    description:
      "A river that never reaches the sea, the Okavango Delta turns the Kalahari into a maze of waterways, reeds, and islands. Glide by mokoro past lily-covered channels as elephants roam the banks.",
    image: "/destinations/kerala/adventure-nature.avif", // Fallback image
  },
  {
    title: "Chobe National Park",
    subtitle: "Where elephants rule the landscape.",
    description:
      "Botswana's oldest park and a haven for elephants. In the dry season, huge herds gather along the Chobe River, best seen up close from a boat.",
    image: "/destinations/kerala/wildlife.avif", // Fallback image
  },
  {
    title: "Moremi Game Reserve",
    subtitle: "Wildlife at its most intimate.",
    description:
      "A diverse ecosystem where water, woodland, and open plains meet, supporting rich wildlife and vibrant plant life.",
    image: "/destinations/kerala/elephants-sri-lanka.jpg", // Fallback image
  },
  {
    title: "Makgadikgadi Salt Pans",
    subtitle: "A different side of Botswana.",
    description:
      "A vast white salt pan, once the floor of an ancient lake, stretching beyond the horizon. Quad bikes cross its flats, while flamingos arrive in their thousands during wet months.",
    image: "/destinations/africa.png", // Fallback image
  },
];

/* The heading has no defaults on purpose. This component was drawn for
   Botswana and its design copy names that country outright, so falling back to
   it on an unfilled field printed "Discover Botswana's unique landscapes…"
   under Congo's own heading. A country-specific line can never be right for
   another country, so an empty field renders nothing instead — SectionHeading
   already guards each of the three. The card list keeps its fallback: those
   are art placeholders, and an empty grid would collapse the section. */
export function CountryRegionsSection({
  eyebrow,
  title,
  description,
  regions = FALLBACK_REGIONS,
  className,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth, children } = scrollRef.current;
    
    if (scrollLeft + clientWidth >= scrollWidth - 2) {
      setActiveIndex(regions.length - 1);
      return;
    }

    const childWidth = children[0].offsetWidth;
    const gap = 8; // gap-x-[8px]
    const index = Math.round(scrollLeft / (childWidth + gap));
    setActiveIndex(index);
  };

  return (
    <section className={cn("bg-background py-16 md:py-24 lg:max-xl:py-20 xl:max-2xl:py-22 2xl:py-24 relative z-10", className)}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="left"
        />

        <div className="mt-12 md:mt-16 w-full">
          <ul
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory md:grid md:grid-cols-2 gap-x-[8px] gap-y-[7px] max-md:pb-4 max-md:-mx-4 max-md:px-4 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden"
          >
            {regions.map((region) => (
              <li
                key={region.title}
                className="relative aspect-[4/3] lg:aspect-[877/610] overflow-hidden group max-md:snap-center max-md:shrink-0 max-md:w-[85vw] md:w-auto"
              >
                <Image
                  src={region.image}
                  alt={region.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 85vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Gradient Overlay: #000000 at 0% (transparent) to #000000 at 100% (black) */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-black"
                  aria-hidden="true"
                />

                {/* Text Content */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-[30px] flex flex-col justify-end text-white">
                  <h3 className="font-heading text-[18px] md:text-[20px] lg:max-xl:text-[18px] xl:max-2xl:text-[22px] 2xl:text-[28px] leading-none text-white">
                    {region.title}
                  </h3>
                  <p className="font-sans font-light text-[12px] md:text-[13px] lg:max-xl:text-[12px] xl:max-2xl:text-[14.5px] 2xl:text-[16px] text-white/90 mt-0.5 md:mt-1 2xl:mt-[5px] mb-2 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-[21px]">
                    {region.subtitle}
                  </p>
                  
                  <div className="w-full border-t border-white/50" aria-hidden="true" />
                  
                  <p className="font-sans font-light text-[12px] md:text-[13px] lg:max-xl:text-[12px] xl:max-2xl:text-[14.5px] 2xl:text-[16px] 2xl:leading-[24px] text-white/70 mt-2 md:mt-3 lg:mt-4 xl:mt-5 2xl:mt-[21px]">
                    {region.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Dots (Mobile Only) */}
          <div className="flex justify-center gap-[4px] pt-4 md:hidden">
            {regions.map((_, i) => (
              <span
                key={i}
                className={`h-[6px] w-[6px] transition-colors ${
                  i === activeIndex ? "bg-black" : "bg-black/20"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
