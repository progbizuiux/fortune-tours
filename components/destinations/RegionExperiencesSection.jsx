"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { useRowRise } from "@/lib/gsap/useRowRise";
import { cn } from "@/lib/utils";

const FALLBACK_EXPERIENCES = [
  {
    id: "safari",
    title: "Safari & Wildlife",
    subtitle: "Masai Mara, Serengeti and beyond.",
    description: "Experience the wild heart of Africa with guided safaris, unforgettable Big Five encounters, carefully selected stays and expert-led game drives across the Masai Mara, Serengeti and beyond.",
    image: "/destinations/kerala/wildlife.avif", // placeholder
  },
  {
    id: "culture",
    title: "Culture & Heritage",
    subtitle: "Ancient wonders and vibrant traditions.",
    description: "Immerse yourself in history, from the Great Pyramids to hidden temples, discovering the rich tapestry of local cultures.",
    image: "/destination/india.avif", // placeholder
  },
  {
    id: "landscapes",
    title: "Landscapes & Adventure",
    subtitle: "Mountains, deserts and canyons.",
    description: "Trek through stunning mountain ranges, explore vast deserts, and experience the thrill of nature at its most dramatic.",
    image: "/destination/japan.avif", // placeholder
  },
  {
    id: "beach",
    title: "Beach & Island Escapes",
    subtitle: "White sands and crystal waters.",
    description: "Unwind on pristine beaches, snorkel in vibrant coral reefs, and enjoy the serene beauty of exclusive island resorts.",
    image: "/experiance/mauritius.png", // placeholder
  },
  {
    id: "luxury",
    title: "Luxury & Wellness",
    subtitle: "Relax and rejuvenate.",
    description: "Indulge in premium wellness retreats, luxury spas, and world-class hospitality designed for ultimate relaxation.",
    image: "/experiance/bali.png", // placeholder
  },
];

export function RegionExperiencesSection({
  eyebrow = "Travel your way",
  title = "Discover destinations made for your kind of escape.",
  description = "Whether you crave adventure, culture, relaxation or something in between, explore places and experiences that match the way you love to travel.",
  experiences = FALLBACK_EXPERIENCES,
  className,
}) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Re-use the existing gsap hook for animating items up on scroll
  useRowRise({ ref: scrollRef });

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth, children } = scrollRef.current;
    
    // Check if reached the end
    if (scrollLeft + clientWidth >= scrollWidth - 2) {
      setActiveIndex(experiences.length - 1);
      return;
    }

    const childWidth = children[0].offsetWidth;
    const gap = 16; // md:gap-4 is 16px
    const index = Math.round(scrollLeft / (childWidth + gap));
    setActiveIndex(index);
  };

  const scrollPrev = () => {
    if (!scrollRef.current) return;
    const { children } = scrollRef.current;
    const childWidth = children[0].offsetWidth;
    const gap = 16;
    scrollRef.current.scrollBy({ left: -(childWidth + gap), behavior: "smooth" });
  };

  const scrollNext = () => {
    if (!scrollRef.current) return;
    const { children } = scrollRef.current;
    const childWidth = children[0].offsetWidth;
    const gap = 16;
    scrollRef.current.scrollBy({ left: childWidth + gap, behavior: "smooth" });
  };

  return (
    <section className={cn("relative z-10 bg-background py-20 lg:py-32", className)}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="left"
        />
        
        {/* Carousel Container */}
        <div className="mt-12 md:mt-16 relative">
          <ul
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {experiences.map((exp, i) => (
              <li 
                key={exp.id} 
                className="group relative snap-center shrink-0 w-[85vw] sm:w-[45vw] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] aspect-[473/586] overflow-hidden bg-navy/5"
              >
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 85vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" 
                  aria-hidden="true"
                />

                {/* Content Block */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end text-white">
                  <div className="transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-4">
                    
                    <h3 className="font-heading text-[24px] leading-tight text-white drop-shadow-sm">
                      {exp.title}
                    </h3>
                    
                    {/* Expandable Description Area */}
                    <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:grid-rows-[1fr] group-hover:opacity-100 mt-1 md:mt-2">
                      <div className="overflow-hidden">
                        <p className="font-sans font-light text-[18px] text-white/90">
                          {exp.subtitle}
                        </p>
                        
                        <div className="h-[0.6px] bg-white/50 w-full my-4" />
                        
                        <p className="font-sans font-light text-[14px] leading-relaxed text-white/80">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                    
                  </div>
                </div>
                
                {/* Full card clickable link if needed, or just hover effect wrapper */}
                <Link href={`/experiences/${exp.id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">Explore {exp.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Navigation Arrows (Desktop) & Pagination Dots (Mobile) */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-[4px] md:hidden">
            {experiences.map((_, i) => (
              <span
                key={i}
                className={`h-[7px] w-[7px] transition-colors ${
                  i === activeIndex ? "bg-black" : "bg-black/20"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          
          {/* Desktop Arrows */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <button 
              onClick={scrollPrev}
              className="w-12 h-12 flex items-center justify-center border border-black/20 rounded-sm hover:border-black transition-colors"
              aria-label="Previous"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              onClick={scrollNext}
              className="w-12 h-12 flex items-center justify-center border border-black/20 rounded-sm hover:border-black transition-colors"
              aria-label="Next"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
      </Container>
    </section>
  );
}
