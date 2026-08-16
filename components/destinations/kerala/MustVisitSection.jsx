"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PLACES = [
  {
    key: "munnar",
    title: "Munnar",
    description: "Rolling tea estates, misty hills, and scenic waterfalls.",
    image: "/destinations/kerala/hill-stations.avif",
  },
  {
    key: "alleppey",
    title: "Alleppey.",
    description: "Peaceful backwaters, houseboat cruises, and village charm.",
    image: "/destinations/kerala/house-boat.avif",
  },
  {
    key: "wayanad",
    title: "Wayanad.",
    description: "Lush forests, waterfalls, caves, and nature trails.",
    image: "/destinations/kerala/adventure-nature.avif",
  },
  {
    key: "thekkady",
    title: "Thekkady.",
    description: "Wildlife safaris, spice plantations, and bamboo rafting.",
    image: "/destinations/kerala/wildlife.avif",
  },
  {
    key: "varkala",
    title: "Varkala.",
    description: "Clifftop beaches, cafés, and sunsets.",
    image: "/destinations/kerala/beaches.avif",
  },
];

export function MustVisitSection() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 40);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);

      const childWidth = scrollRef.current.children[0].offsetWidth;
      const gap = 15;
      const index = Math.round(scrollLeft / (childWidth + gap));
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 450;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-cream spacing relative">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Must Visit Places"
          title="Explore Kerala's Most Loved Destinations"
          description="A few places we plan around most. Each one asks for a different pace."
          eyebrowClassName="lg:text-[20px]"
          descriptionClassName="max-lg:max-w-[560px] max-w-[828px] lg:leading-[29px]"
        />
      </Container>

      <div className="relative mt-12 md:mt-[77px]">
        <ul
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-[15px] overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-5 md:px-8 scroll-pl-5 md:scroll-pl-8"
        >
          {PLACES.map((place) => (
            <li
              key={place.key}
              className="snap-start shrink-0 w-[323px] md:w-[437px] lg:w-[323px] 2xl:w-[437px] flex flex-col gap-[18px]"
            >
              <div className="relative w-full aspect-[323/371] md:aspect-[437/502] lg:aspect-[323/371] 2xl:aspect-[437/502] overflow-hidden bg-navy/5">
                <Image
                  src={place.image}
                  alt={place.title}
                  fill
                  sizes="(min-width: 768px) 437px, 323px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-[20px] max-w-[323px]">
                <h3 className="font-heading text-[24px] font-normal leading-[1] text-black">
                  {place.title}
                </h3>
                <p className="font-sans text-[16px] font-light leading-[1.5] text-black/80">
                  {place.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
        
        {canScrollLeft && (
          <button 
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-4 md:left-12 top-[140px] md:top-[251px] lg:top-[185px] 2xl:top-[251px] -translate-y-1/2 w-10 h-10 bg-white rounded-full items-center justify-center shadow-md transition-transform hover:scale-110 z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-black/60" strokeWidth={2} />
          </button>
        )}
        
        {canScrollRight && (
          <button 
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-4 md:right-12 top-[140px] md:top-[251px] lg:top-[185px] 2xl:top-[251px] -translate-y-1/2 w-10 h-10 bg-white rounded-full items-center justify-center shadow-md transition-transform hover:scale-110 z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-black/60" strokeWidth={2} />
          </button>
        )}

        {/* Pagination Dots (Mobile Only) */}
        <div className="mt-8 flex justify-center gap-[4px] md:hidden">
          {PLACES.map((_, i) => (
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

