"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { AnimateIn } from "@/components/common/AnimateIn";
import { FrameButton } from "@/components/common/FrameButton";
import { useReveal } from "@/lib/useReveal";

export function ImageCarouselSection({
  eyebrow,
  title,
  description,
  items,
  buttonText,
  ariaLabel,
  gridClassName = "grid-cols-2 sm:grid-cols-4 lg:grid-cols-8",
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useReveal({ stagger: 0.08, y: 40 });

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const childWidth = scrollRef.current.children[0].offsetWidth;
    const gap = 6; // gap-1.5 is 6px
    const index = Math.round(scrollLeft / (childWidth + gap));
    setActiveIndex(index);
  };

  return (
    <section aria-label={ariaLabel} className="spacing">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      </Container>

      {/* Full-bleed style cards: 6px outer margin + 6px gap */}
      <ul
        ref={scrollRef}
        onScroll={handleScroll}
        className={`mt-16 max-lg:flex max-lg:overflow-x-auto max-lg:snap-x max-lg:snap-mandatory grid gap-1.5 px-1.5 max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden ${gridClassName}`}
      >
        {items.map((item) => (
          <li
            key={item.key}
            className="group max-lg:snap-center max-lg:shrink-0 max-sm:w-[142px] sm:max-lg:w-[35vw] relative max-sm:aspect-[142/233] aspect-[234/397] overflow-hidden w-full cursor-pointer"
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 12vw, (min-width: 640px) 25vw, 50vw"
              className="object-cover"
            />
            {/* Figma image overlay: black fading out towards the base */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent"
              aria-hidden="true"
            />

            {item.tag && (
              <span className="text-body max-sm:font-light max-sm:text-[12px] max-sm:leading-6 pointer-events-none absolute inset-x-0 top-6 text-center text-white">
                {item.tag}
              </span>
            )}

            {/* 125x43 label chip, 20px off the bottom (Figma) */}
            <span className="absolute inset-x-0 bottom-5 flex justify-center">
              {/* Mirrors FILL_SWEEP's own hover, driven by the card instead of
                  the button — hovering anywhere on the card sweeps the panel in.
                  Scoped here rather than added to FILL_SWEEP so other `group`
                  wrappers in the app don't start filling their buttons too. */}
              <FrameButton className="group-hover:text-white group-hover:before:scale-x-100">
                {item.label}
              </FrameButton>
            </span>
          </li>
        ))}
      </ul>

      {/* Pagination Dots (Mobile Only) */}
      <div className="mt-6 flex justify-center gap-[4px] lg:hidden">
        {items.map((_, i) => (
          <span
            key={i}
            className={`h-[7px] w-[7px] transition-colors ${
              i === activeIndex ? "bg-black" : "bg-black/20"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      {buttonText && (
        <AnimateIn y={16} className="mt-24 flex justify-center">
          <FrameButton variant="rail">{buttonText}</FrameButton>
        </AnimateIn>
      )}
    </section>
  );
}
