"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { CtaLink } from "@/components/common/CtaLink";
import { SectionHeading } from "@/components/common/SectionHeading";
import { FrameButton } from "@/components/common/FrameButton";

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

  // Which slide is travelling out and which way, so the outgoing and incoming
  // backdrops can move as one pair. dir 1 = "next": the new panel enters from
  // the right and the old one leaves to the left. `from` is null before the
  // first navigation so the initial backdrop does not slide in on load.
  const [nav, setNav] = useState({ from: null, dir: 1 });

  const go = (delta) => {
    setNav({ from: active.key, dir: delta });
    setIndex((i) => (i + delta + count) % count);
  };

  const selectCategory = (key) => {
    setCategory(key);
    setIndex(0);
    // A category switch is not a step through the rail, so it should not slide.
    setNav({ from: null, dir: 1 });
  };

  return (
    <section className="relative z-10">
      <div className="bg-background">
        <Container className="pt-16 pb-10 lg:pb-16 lg:pt-24">
          <SectionHeading
            eyebrow="Chapter 05 — Signature"
            title="Where will your next journey?"
            description="Explore curated destinations that match your travel dreams and create lasting memories."
          />
        </Container>
      </div>

      <div className="bg-navy relative overflow-hidden">
      {/* Active slide echoed as the dimmed full-bleed backdrop.
          Every slide in the category stays mounted and the swap is a pure
          opacity crossfade. Keying a single layer on the active slide instead
          made React tear the old image out and mount a fresh one at opacity 0,
          so the navy behind flashed through and the change stalled on the new
          file decoding.
          `isolate` keeps the z-indexes below contained: this wrapper stays at
          z-auto so the Container after it still paints on top. */}
      <div className="absolute inset-0 isolate" aria-hidden="true">
        {slides.map((slide) => {
          const isActive = slide.key === active.key;
          const isLeaving = !isActive && slide.key === nav.from;
          // Only the pair either side of the change animates. Everything else
          // stays mounted but transparent, purely so its image is already
          // decoded when its turn comes and the slide never waits on a fetch.
          const motion = isActive
            ? nav.from &&
              (nav.dir > 0 ? "bg-slide-in-right" : "bg-slide-in-left")
            : isLeaving && (nav.dir > 0 ? "bg-slide-out-left" : "bg-slide-out-right");

          return (
            <div
              key={slide.key}
              className={cn(
                // will-change here rather than only on the .bg-slide-* classes
                // is what makes the movement smooth. Promoted at animation time
                // instead, the compositor has to rasterise a fresh
                // viewport-sized texture from a 1261x1840 source just as the
                // slide begins — measured as a single 100ms stall ~140ms in,
                // with no long task on the main thread to explain it. Holding
                // the layers promoted pays that cost while the page is idle.
                "absolute inset-0 will-change-transform",
                isActive ? "z-10" : isLeaving ? "z-0" : "z-0 opacity-0",
                motion,
              )}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          );
        })}
        {/* Above every layer, so the dim never fades along with the swap. */}
        <div className="absolute inset-0 z-20 bg-black/55" />
      </div>

      <Container className="relative flex max-lg:min-h-0 lg:min-h-screen flex-col pt-10 pb-10 lg:pt-14 lg:pb-11">
        {/* Category tabs — individually outlined boxes with small gaps;
            the active tab flips to solid white, as in the design. */}
        <div className="flex max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden flex-wrap gap-3 lg:justify-end">
          {CATEGORIES.map((tab) => (
            <FrameButton
              key={tab.key}
              variant="tab"
              active={tab.key === category}
              onClick={() => selectCategory(tab.key)}
            >
              {tab.label}
            </FrameButton>
          ))}
        </div>

        {/* mt-auto drops the content block to the section's bottom edge;
            items-end aligns the copy's CTA with the card bottoms. */}
        <div className="max-lg:mt-10 lg:mt-auto flex flex-col max-lg:gap-8 lg:gap-14 max-lg:pt-0 lg:pt-14 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          {/* Active destination copy */}
          {/* pb offsets the controls bar under the rail (28px gap + 60px
              buttons) so the CTA baseline aligns with the card bottoms,
              matching the design. */}
          <div
            key={`copy-${active.key}`}
            className={cn(
              "max-w-[452px] shrink-0 lg:pb-[88px] max-lg:flex max-lg:flex-col max-lg:items-center max-lg:text-center max-lg:mx-auto",
              // Travels with the rail rather than cutting, so the whole section
              // reads as one move. No stagger offset: the copy is the thing you
              // are actually reading, so it leads and the cards follow it in.
              nav.from
                ? nav.dir > 0
                  ? "copy-slide-in-right"
                  : "copy-slide-in-left"
                : "animate-fade-in",
            )}
          >
            <p className="font-top max-sm:text-[12px] max-sm:leading-none text-h4 text-white/95">{active.location}</p>

            <h2 className="font-heading max-sm:text-[25px] max-sm:tracking-[-0.01em] max-sm:mt-4 text-h3 lg:text-[2.5rem] mt-8 leading-none text-white">
              {active.title}
            </h2>

            <p className="text-body max-sm:font-light max-sm:text-[12px] max-sm:leading-[120%] mt-5 text-white/80">{active.description}</p>

            <div className="text-body mt-16 flex items-center gap-4 text-white/95 max-lg:hidden">
              <CtaLink
                href="/destinations"
                className="hover:text-sky px-1"
                withLeftDivider
                withRightDivider
              >
                Explore the destination
              </CtaLink>
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
            <div className="flex items-end gap-[13px] overflow-x-auto max-lg:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visible.map((slide, i) => (
                <figure
                  key={`${slide.key}-${i}`}
                  // Cards travel the same way as the backdrop, offset per
                  // position so the rail reads as one group shifting rather
                  // than three tiles moving in lockstep. Falls back to the plain
                  // fade on first paint, where there is no direction yet.
                  //
                  // Stagger runs from the trailing edge inward, so it has to
                  // reverse with direction. A card that starts late is still
                  // further along the incoming direction than its neighbour, so
                  // ordering it the wrong way walks it into the card ahead —
                  // going back with a front-to-back stagger overlapped them by
                  // 46px.
                  //
                  // The 40ms base just sets the cards off after the backdrop so
                  // the two read as layered.
                  style={
                    nav.from
                      ? {
                          animationDelay: `${
                            40 +
                            (nav.dir > 0 ? i : visible.length - 1 - i) * 90
                          }ms`,
                        }
                      : undefined
                  }
                  className={cn(
                    "relative shrink-0 overflow-hidden",
                    nav.from
                      ? nav.dir > 0
                        ? "card-slide-in-right"
                        : "card-slide-in-left"
                      : "animate-fade-in",
                    // lg:max-w-none is required, not cosmetic: max-w-[300px] is
                    // the mobile cap, and without lifting it the lead card
                    // stays clamped to 300px on desktop — narrower than the
                    // 318px followers, so it sinks below them instead of
                    // rising above as the design intends.
                    i === 0
                      ? "aspect-424/545 max-sm:aspect-[300/384] w-full max-w-[300px] sm:w-[340px] lg:w-[384px] lg:max-w-none"
                      : "aspect-352/454 w-[230px] sm:w-[280px] lg:w-[318px] max-lg:hidden",
                  )}
                >
                  <Image
                    src={slide.image}
                    alt={slide.location}
                    fill
                    sizes="(min-width: 1024px) 424px, 340px"
                    className="object-cover"
                  />
                  {/* Hide the inner text block on mobile since the location is already shown in the copy block */}
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-6 max-lg:hidden">
                    <span className="font-top text-h4 text-white">
                      {slide.location}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* Desktop Controls */}
            <div className="mt-7 flex items-center justify-between gap-6 lg:pr-20 max-lg:hidden">
              <div className="flex gap-4">
                <FrameButton
                  variant="icon"
                  className="size-15"
                  onClick={() => go(-1)}
                  aria-label="Previous destination"
                >
                  <ChevronLeft className="size-6" strokeWidth={1.5} aria-hidden="true" />
                </FrameButton>
                <FrameButton
                  variant="icon"
                  className="size-15"
                  onClick={() => go(1)}
                  aria-label="Next destination"
                >
                  <ChevronRight className="size-6" strokeWidth={1.5} aria-hidden="true" />
                </FrameButton>
              </div>

              <div className="text-body flex items-center gap-4 text-white/95">
                <CtaLink
                  href="/destinations"
                  className="hover:text-sky"
                  withLeftDivider
                  withRightDivider
                >
                  View all destinations
                </CtaLink>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="mt-7 flex items-center justify-between gap-4 lg:hidden w-full max-w-[300px] mx-auto">
              <FrameButton
                variant="icon"
                className="size-10"
                onClick={() => go(-1)}
                aria-label="Previous destination"
              >
                <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden="true" />
              </FrameButton>

              <FrameButton variant="rail" className="max-sm:text-[12px] text-white/95 max-sm:font-light px-4">
                Explore the destination
              </FrameButton>

              <FrameButton
                variant="icon"
                className="size-10"
                onClick={() => go(1)}
                aria-label="Next destination"
              >
                <ChevronRight className="size-5" strokeWidth={1.5} aria-hidden="true" />
              </FrameButton>
            </div>
          </div>
        </div>
      </Container>
      </div>
    </section>
  );
}
