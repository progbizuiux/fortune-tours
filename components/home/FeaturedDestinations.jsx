"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";

// Tab casing follows the design frame verbatim.
const CATEGORIES = [
  { key: "featured", label: "Featured" },
  { key: "international", label: "international" },
  { key: "india", label: "India" },
  { key: "kerala", label: "Kerala" },
  { key: "pilgrimage", label: "Pilgrimage" },
  { key: "cruises", label: "Cruises" },
];

// Images are placeholders from elsewhere in the site — drop the real shots
// into public/ and update `image` per slide; everything else stays put.
const SLIDES = [
  {
    key: "cappadocia",
    location: "Cappadocia, Türkiye.",
    title: "Hot air balloon at sunrise.",
    description:
      "Drift peacefully above breathtaking landscapes as the first rays of sunlight paint the sky in vibrant shades of gold and orange. A sunrise hot air balloon ride offers unforgettable panoramic views and a truly magical start to your day.",
    image: "/home/image-1.png",
    categories: ["featured", "international"],
  },
  {
    key: "thailand",
    location: "Thailand, Vibrant Cities.",
    title: "Streets that never sleep.",
    description:
      "Weave through night markets, temple courtyards and neon-lit lanes where every corner serves something new. Thailand's cities reward the curious with flavour, colour and life at all hours.",
    image: "/home/image-2.jpg",
    categories: ["featured", "international"],
  },
  {
    key: "osaka",
    location: "Japan, Osaka",
    title: "Spring under the blossoms.",
    description:
      "Time your journey with the sakura and watch the city soften into pink. From castle gardens to riverside promenades, Osaka in bloom is a season worth crossing the world for.",
    image: "/destination/japan.png",
    categories: ["featured", "international"],
  },
  {
    key: "kerala",
    location: "Kerala, India.",
    title: "Backwaters at their own pace.",
    description:
      "Board a houseboat and let the palm-lined canals set the rhythm. Kerala's backwaters trade itineraries for stillness — village life, birdsong and water that mirrors the sky.",
    image: "/destination/india.png",
    categories: ["featured", "india", "kerala", "pilgrimage"],
  },
  {
    key: "swiss",
    location: "Switzerland, Alps.",
    title: "Wake up above the clouds.",
    description:
      "Ride cliff-hugging trains to villages where the air is thin and the views are not. The Alps deliver postcard mornings — snow peaks, still lakes and slow breakfasts.",
    image: "/destination/switzerland.png",
    categories: ["featured", "international"],
  },
  {
    key: "norway",
    location: "Norway, Fjords.",
    title: "Chase the northern lights.",
    description:
      "Sail deep into the fjords where waterfalls drop from the mist and winter skies put on their green show. Norway is nature at full scale, best seen from the water.",
    image: "/destination/norway.png",
    categories: ["international", "cruises"],
  },
];

export function FeaturedDestinations() {
  const [category, setCategory] = useState("featured");
  const [index, setIndex] = useState(0);

  const slides = SLIDES.filter((slide) => slide.categories.includes(category));
  const count = slides.length;
  const active = slides[index % count];

  // Active slide leads as the large card, followed by the next two (wrapping).
  const visible = Array.from(
    { length: Math.min(3, count) },
    (_, i) => slides[(index + i) % count],
  );

  const selectCategory = (key) => {
    setCategory(key);
    setIndex(0);
  };

  return (
    <section className="bg-navy relative z-10 overflow-hidden">
      {/* Active slide echoed as the dimmed full-bleed backdrop */}
      <div key={`bg-${active.key}`} className="animate-fade-in absolute inset-0">
        <Image
          src={active.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <Container className="relative flex min-h-screen flex-col pt-10 pb-10 lg:pt-14 lg:pb-11">
        {/* Category tabs — individually outlined boxes with small gaps;
            the active tab flips to solid white, as in the design. */}
        <div className="flex flex-wrap gap-3 lg:justify-end">
          {CATEGORIES.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => selectCategory(tab.key)}
              className={cn(
                "text-nav border px-5 py-3.5 transition-colors",
                tab.key === category
                  ? "border-white bg-white text-navy"
                  : "border-white/25 text-white/90 hover:bg-white/10",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* mt-auto drops the content block to the section's bottom edge;
            items-end aligns the copy's CTA with the card bottoms. */}
        <div className="mt-auto flex flex-col gap-14 pt-14 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          {/* Active destination copy */}
          {/* pb offsets the controls bar under the rail (28px gap + 60px
              buttons) so the CTA baseline aligns with the card bottoms,
              matching the design. */}
          <div
            key={`copy-${active.key}`}
            className="animate-fade-in max-w-[452px] shrink-0 lg:pb-[88px]"
          >
            <p className="font-top text-h4 text-white/95">{active.location}</p>

            <h2 className="font-heading text-h3 lg:text-[2.5rem] mt-8 leading-none text-white">
              {active.title}
            </h2>

            <p className="text-body mt-5 text-white/85">{active.description}</p>

            <div className="text-body mt-16 flex items-center gap-4 text-white/95">
              <span className="h-6 w-px bg-white/40" aria-hidden="true" />
              <Link
                href="/destinations"
                className="hover:text-sky px-1 transition-colors"
              >
                Explore the destination
              </Link>
              <span className="h-6 w-px bg-white/40" aria-hidden="true" />
            </div>
          </div>

          {/* Card rail + controls. The negative margin cancels the container's
              right padding so the last card bleeds to the viewport edge like
              the design; the bottom bar adds it back so "View all" stays on
              the container grid. */}
          <div className="flex min-w-0 flex-col lg:-mr-20">
            {/* items-end keeps card bottoms aligned so the lead card rises
                above the other two. The rail always clips at the viewport
                edge (scrollable, scrollbar hidden) — on narrower desktops the
                fixed-size cards would otherwise spill into a page-wide
                horizontal scroll. */}
            <div className="flex items-end gap-[13px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visible.map((slide, i) => (
                <figure
                  key={`${slide.key}-${i}`}
                  className={cn(
                    "animate-fade-in relative shrink-0 overflow-hidden",
                    i === 0
                      ? "aspect-424/545 w-[280px] sm:w-[340px] lg:w-[384px]"
                      : "aspect-352/454 w-[230px] sm:w-[280px] lg:w-[318px]",
                  )}
                >
                  <Image
                    src={slide.image}
                    alt={slide.location}
                    fill
                    sizes="(min-width: 1024px) 424px, 340px"
                    className="object-cover"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-6">
                    <span className="font-top text-h4 text-white">
                      {slide.location}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between gap-6 lg:pr-20">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i - 1 + count) % count)}
                  aria-label="Previous destination"
                  className="flex size-15 items-center justify-center border border-white/30 text-white transition-colors hover:bg-white/10"
                >
                  <ChevronLeft className="size-6" strokeWidth={1.5} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i + 1) % count)}
                  aria-label="Next destination"
                  className="flex size-15 items-center justify-center border border-white/30 text-white transition-colors hover:bg-white/10"
                >
                  <ChevronRight className="size-6" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>

              <div className="text-body flex items-center gap-4 text-white/95">
                <Link
                  href="/destinations"
                  className="hover:text-sky transition-colors"
                >
                  View all destinations
                </Link>
                <span className="h-6 w-px bg-white/40" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
