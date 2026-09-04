"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

const FALLBACK_PLACES = [
  {
    title: "Kenya Safari",
    description: "Masai Mara + Lake Nakuru + Nairobi. Big cats, flamingos and the drama of the open savanna.",
    image: "/destination/india.avif", 
  },
  {
    title: "Victoria Falls",
    description: "The thunder of the falls + a sunset cruise on the Zambezi. One of Africa's most dramatic experiences.",
    image: "/destination/switzerland.avif",
  },
  {
    title: "Cape Town",
    description: "Table Mountain + Penguins + Winelands. A city wrapped in nature.",
    image: "/destination/japan.avif",
  },
  {
    title: "Serengeti",
    description: "Witness the great migration and the endless plains.",
    image: "/destination/norway.avif",
  },
];

/* The "Travel your way" arrows, verbatim
   (components/destinations/RegionExperiencesSection.jsx) — same box, rule,
   blur and disabled fade, so the two carousels on the page read as one
   control. They sit in a row beneath the track there too: a black rule over a
   photograph is invisible, which is what an overlay would give here. */
const ARROW_CLASS =
  "flex h-[70px] w-[62px] shrink-0 items-center justify-center border-[0.7px] border-white p-[10px] backdrop-blur-[15px] transition-opacity disabled:opacity-30 lg:max-2xl:h-[54px] lg:max-2xl:w-[48px]";

export function RegionCuratedSection({
  eyebrow = "Curated for you",
  title = "Places worth going out of your way for.",
  description = "",
  places = FALLBACK_PLACES,
  className,
}) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth, children } = scrollRef.current;
    
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
    
    if (scrollLeft + clientWidth >= scrollWidth - 2) {
      setActiveIndex(places.length - 1);
      return;
    }

    const childWidth = children[0].offsetWidth;
    const gap = 7;
    const index = Math.round(scrollLeft / (childWidth + gap));
    setActiveIndex(index);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  const scrollPrev = () => {
    if (!scrollRef.current) return;
    const { children } = scrollRef.current;
    const childWidth = children[0].offsetWidth;
    const gap = 7;
    scrollRef.current.scrollBy({ left: -(childWidth + gap), behavior: "smooth" });
  };

  const scrollNext = () => {
    if (!scrollRef.current) return;
    const { children } = scrollRef.current;
    const childWidth = children[0].offsetWidth;
    const gap = 7;
    scrollRef.current.scrollBy({ left: childWidth + gap, behavior: "smooth" });
  };

  return (
    <section className={cn("relative z-10 bg-[#FAF7F2] border-t-[60px] md:border-t-[90px] lg:border-t-[100px] border-background spacing", className)}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
          titleClassName="max-w-[730px] mx-auto"
        />
      </Container>
      
      <div className="mt-12 md:mt-20 relative">

        <ul
          ref={scrollRef}
          onScroll={handleScroll}
          // scroll-pl matches the track's own left padding, so a slide snapped
          // to the start sits flush with the edge instead of 10px under it.
          className="flex snap-x snap-mandatory gap-[7px] overflow-x-auto px-[10px] md:scroll-pl-[10px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {places.map((place, i) => (
            <li 
              key={place.title + i} 
              // snap-start from md up: two slides share the viewport there, so
              // centring one of them parks the track between cards and shows
              // half of each neighbour. Below md a single 85vw slide is meant
              // to sit centred with a peek either side, so that keeps center.
              className="group relative aspect-[951/696] w-[85vw] shrink-0 cursor-pointer snap-center overflow-hidden bg-navy/5 max-sm:aspect-[432/273] md:w-[calc(50%-3.5px)] md:snap-start"
            >
              <Image
                src={place.image}
                alt={place.title}
                fill
                sizes="(min-width: 768px) 50vw, 85vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-colors duration-700 group-hover:from-black/90 group-hover:via-black/30"
                aria-hidden="true"
              />

              {/* The bottom inset runs tighter than the top and sides, which
                  sits the title and its description lower in the frame than a
                  uniform pad would. */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 pb-3 sm:p-8 sm:pb-4 md:pt-11 md:pb-8">
                <div className="transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-3">
                  <h3 className="text-white max-sm:text-[24px] md:text-[28px] lg:max-xl:text-[27px] xl:max-2xl:text-[32px] 2xl:text-[32px] leading-none tracking-[-0.01em]">
                    {place.title}
                  </h3>
                  <p className="mt-3 max-sm:mt-1 max-sm:text-[14px] text-[16px] lg:max-xl:text-[14px] xl:max-2xl:text-[16px] 2xl:text-[16px] leading-6 font-normal text-white/80 transition-colors duration-500 group-hover:text-white max-w-[80%] xl:max-2xl:hidden 2xl:block">
                    {place.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Navigation Arrows (Desktop) — overlaid on the track at the same
            insets the previous pair used. */}
        {(canScrollLeft || canScrollRight) && (
        <div className="hidden md:block">
          <button
            onClick={scrollPrev}
            disabled={!canScrollLeft}
            className={cn(ARROW_CLASS, "absolute top-1/2 left-[20px] z-20 -translate-y-1/2")}
            aria-label="Previous"
          >
            <ChevronLeft className="size-4 stroke-1 text-white" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollRight}
            className={cn(ARROW_CLASS, "absolute top-1/2 right-[20px] z-20 -translate-y-1/2")}
            aria-label="Next"
          >
            <ChevronRight className="size-4 stroke-1 text-white" />
          </button>
        </div>
        )}

        {/* Pagination Dots (Mobile) */}
        <div className="flex justify-center gap-[4px] mt-6 md:hidden">
          {places.map((_, i) => (
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
    </section>
  );
}
