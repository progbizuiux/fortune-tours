"use client";

import { useState } from "react";
import Image from "next/image";
import { CarouselArrow } from "@/components/common/CarouselArrow";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

const FALLBACK_STORIES = [
  {
    quote: "“Every detail felt effortless, creating an experience that transcended a simple holiday and left lasting memories in our hearts.”",
    author: "SARAH & JAMES",
    meta: "kenya · safari journey",
    image: "/countries/africa/africa.png",
    authorImage: "/countries/africa/sarah.png",
    rating: 4
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

/* CarouselArrow on a light panel: its own rule is white and it blurs what is
   behind it, both of which assume the pair sits over a photo. The chevron
   colour is the caller's — black when there is a story that way, dimmed when
   the end of the run is reached. */
const ARROW_CLASS = "size-11 border-black/20 backdrop-blur-none";

export function RegionStoriesSection({
  eyebrow = "Traveller stories",
  title = "Captivating Stories And Adventures From The Road",
  description = "Travel is more than visiting places; it's about people, unique flavors, and unforgettable memories. Discover stories revealing hidden gems and diverse cultures, showing a vibrant side of the world.",
  stories = FALLBACK_STORIES,
  className,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStory = stories[activeIndex];

  // Bounded rather than wrapping, so each arrow's colour can report whether
  // there is actually a story that way: black when there is, dimmed when not.
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < stories.length - 1;
  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () =>
    setActiveIndex((i) => Math.min(stories.length - 1, i + 1));

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

          {/* Quote, then the attribution row beneath its own rule. */}
          {/* Figma: Neiko 400, 35px/110%, -1% tracking, right, black at 80%. */}
          <blockquote className="mt-8 ml-auto max-w-[1374px] text-right font-heading text-[24px] leading-[110%] font-normal tracking-[-0.01em] text-black/80 md:mt-12 lg:text-[35px]">
            {activeStory.quote}
          </blockquote>

          {/* Figma: 0.5px rule at black/60 above the attribution row. */}
          {/* From 2xl the rule and the attribution line up with the quote's own
              left edge — same ml-auto/max-w pair — instead of running the full
              width of the container beneath it. */}
          <div className="mt-[30px] flex w-full flex-col items-start gap-6 border-t-[0.5px] border-black/60 pt-[40px] sm:flex-row sm:items-center 2xl:ml-auto 2xl:max-w-[1374px]">
            {/* Figma rhythm across the row: 14px avatar → name, then 20px to
                the rule and 20px again to the review badge. */}
            <div className="flex items-center gap-5">
              {/* 81px square, per the Figma measure. */}
              <div className="flex items-center gap-[14px]">
                <Image
                  src={activeStory.authorImage}
                  alt={activeStory.author}
                  width={81}
                  height={81}
                  className="size-[81px] shrink-0 object-cover"
                />

                {/* text-body carries the Poppins 18px/24px light spec and
                    steps down on small screens with the rest of the site. */}
                <div className="flex flex-col">
                  <span className="text-body font-light tracking-[0.3em] text-black uppercase">
                    {activeStory.author}
                  </span>
                  <span className="text-body font-light text-black/60 lowercase">
                    {activeStory.meta}
                  </span>
                </div>
              </div>

              {/* Figma: 46px rule, 1px, black at 40%. */}
              <div className="hidden h-[46px] w-px bg-black/40 sm:block" />

              {/* Google mark over the star row — both are supplied artwork
                  rather than icon-font glyphs, so they match the review badge
                  exactly. */}
              <div className="hidden flex-col items-center gap-1 sm:flex">
                <Image
                  src="/countries/africa/google.png"
                  alt="Google"
                  width={24}
                  height={24}
                  className="size-6 object-contain"
                />
                <div className="flex gap-[1px]">
                  {Array.from({ length: activeStory.rating }).map((_, i) => (
                    <Image
                      key={i}
                      src="/countries/africa/star.png"
                      alt=""
                      width={17}
                      height={18}
                      className="h-[18px] w-[17px] object-contain"
                    />
                  ))}
                </div>
                <span className="sr-only">
                  {activeStory.rating} out of 5 stars on Google
                </span>
              </div>
            </div>

            {/* Same CarouselArrow the other carousels use, re-coloured for a
                light panel — the component's default rule is white because it
                normally sits over a photo. */}
            <div className="flex items-center gap-[10px] max-sm:w-full max-sm:justify-end sm:ml-auto">
              <CarouselArrow
                direction="prev"
                onClick={goPrev}
                disabled={!hasPrev}
                className={cn(ARROW_CLASS, hasPrev ? "text-black" : "text-black/30")}
                aria-label="Previous story"
              />
              <CarouselArrow
                direction="next"
                onClick={goNext}
                disabled={!hasNext}
                className={cn(ARROW_CLASS, hasNext ? "text-black" : "text-black/30")}
                aria-label="Next story"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
