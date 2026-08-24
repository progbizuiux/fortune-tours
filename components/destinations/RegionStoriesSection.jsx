"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

const FALLBACK_STORIES = [
  {
    quote: "“Every detail felt effortless, creating an experience that transcended a simple holiday and left lasting memories in our hearts.”",
    author: "SARAH & JAMES",
    meta: "kenya · safari journey",
    image: "/destinations/kerala/wildlife.avif",
    authorImage: "/credentials/image 191.png",
    rating: 5
  },
  {
    quote: "“The itinerary was impeccably planned. From the majestic wildlife to the luxurious lodges, it was an adventure of a lifetime.”",
    author: "MICHAEL T.",
    meta: "tanzania · serengeti",
    image: "/destination/india.avif",
    authorImage: "/credentials/image 192.png",
    rating: 5
  }
];

export function RegionStoriesSection({
  eyebrow = "Traveller stories",
  title = "Captivating Stories And Adventures From The Road",
  description = "Travel is more than visiting places; it's about people, unique flavors, and unforgettable memories. Discover stories revealing hidden gems and diverse cultures, showing a vibrant side of the world.",
  stories = FALLBACK_STORIES,
  className,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const currentStory = stories[activeIndex];

  return (
    <section className={cn("relative z-10 bg-background py-20 lg:py-32", className)}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="left"
          descriptionClassName="max-w-xl"
        />

        <div className="mt-12 md:mt-16 lg:mt-20 flex flex-col">
          {/* Main Image */}
          <div className="relative w-full aspect-[4/3] md:aspect-[1762/670] overflow-hidden bg-navy/5">
            {stories.map((story, idx) => (
              <Image
                key={idx}
                src={story.image}
                alt="Traveller story"
                fill
                className={cn(
                  "object-cover transition-opacity duration-1000",
                  idx === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                )}
              />
            ))}
          </div>

          {/* Quote and Author Block */}
          <div className="mt-8 md:mt-12 ml-auto w-full max-w-[1374px] flex flex-col">
            <h3 className="text-right ml-auto max-w-[1050px] font-heading font-normal text-[24px] lg:text-[35px] leading-[110%] tracking-[-0.01em] text-black/80">
              {currentStory.quote}
            </h3>

            <div className="mt-[30px] border-t border-black/15 pt-[40px] flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
              
              {/* Author Info */}
              <div className="flex items-center gap-[14px]">
                <div className="relative w-[50px] h-[50px] shrink-0 rounded-[2px] overflow-hidden bg-navy/10">
                  <Image 
                    src={currentStory.authorImage} 
                    alt={currentStory.author}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex flex-col">
                  <span className="font-sans font-light text-[18px] leading-[24px] tracking-[0.3em] uppercase text-black">
                    {currentStory.author}
                  </span>
                  <span className="font-sans font-light text-[18px] leading-[24px] lowercase text-black/60">
                    {currentStory.meta}
                  </span>
                </div>

                <div className="w-px h-8 bg-black/15 mx-2 hidden sm:block" />

                <div className="hidden sm:flex flex-col items-center gap-1">
                  <FaGoogle className="size-4 text-black" />
                  <div className="flex gap-[1px]">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "size-2.5", 
                          i < currentStory.rating ? "fill-[#FBBC04] text-[#FBBC04]" : "fill-gray-300 text-gray-300"
                        )} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-2 max-sm:w-full max-sm:justify-end">
                <button 
                  onClick={handlePrev}
                  className="flex items-center justify-center w-11 h-11 border border-black/20 text-black/60 hover:text-black transition-colors"
                  aria-label="Previous story"
                >
                  <ChevronLeft className="size-4 stroke-1" />
                </button>
                <button 
                  onClick={handleNext}
                  className="flex items-center justify-center w-11 h-11 border border-black/20 text-black transition-colors"
                  aria-label="Next story"
                >
                  <ChevronRight className="size-4 stroke-1" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
