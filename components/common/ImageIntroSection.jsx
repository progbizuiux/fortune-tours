"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

/* Reusable Image Intro / Story Slider Section.
 *
 * Renders either a single rich visual story or a multi-slide carousel with
 * next/prev arrows placed vertically in the middle on left and right sides.
 * Supports smooth image transitions, animated story descriptions, and stats tags.
 */
export function ImageIntroSection({
  eyebrow,
  title,
  description,
  places = [],
  stats = [],
  image,
  imageAlt = "",
  slides = [],
  ariaLabel,
  imageClassName,
  className,
}) {
  const allSlides =
    slides && slides.length > 0
      ? slides
      : [
          {
            image,
            imageAlt,
            description,
            stats,
            places,
          },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const activeSlide = allSlides[currentIndex] || allSlides[0];
  const isSlider = allSlides.length > 1;

  const prevSlide = useCallback(() => {
    setDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + allSlides.length) % allSlides.length);
  }, [allSlides.length]);

  const nextSlide = useCallback(() => {
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % allSlides.length);
  }, [allSlides.length]);

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isSlider) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSlider, prevSlide, nextSlide]);

  /* Auto-advance slides every 5.5 seconds, paused while hovered or touched */
  useEffect(() => {
    if (!isSlider || isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [isSlider, isPaused, nextSlide]);

  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
  };

  return (
    <section
      aria-label={ariaLabel ?? title}
      className={cn("bg-background relative z-10 spacing !pb-0", className)}
    >
      <Container>
        {title && (
          <SectionHeading
            align="center"
            eyebrow={eyebrow}
            title={title}
            titleClassName="max-w-[900px] mx-auto"
          />
        )}

        <AnimateIn className={cn(title ? "mt-10 md:mt-14 lg:mt-[60px]" : "mt-0")}>
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={(e) => {
              setIsPaused(true);
              onTouchStart(e);
            }}
            onTouchMove={onTouchMove}
            onTouchEnd={() => {
              setIsPaused(false);
              onTouchEnd();
            }}
            className={cn(
              "bg-navy relative flex flex-col justify-end min-h-[580px] sm:min-h-[560px] md:min-h-[580px] lg:min-h-[620px] xl:min-h-[640px] max-md:w-[calc(100%+2rem)] max-md:-ml-4 max-md:rounded-none md:w-full overflow-hidden md:rounded-sm select-none",
              imageClassName,
            )}
          >
            {/* Background Images with smooth zoom/crossfade */}
            {allSlides.map((slide, idx) => {
              const slideImg = slide.image || image;
              if (!slideImg) return null;
              const isActive = idx === currentIndex;

              return (
                <div
                  key={idx}
                  className={cn(
                    "absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isActive
                      ? "opacity-100 scale-100 z-0"
                      : "opacity-0 scale-105 pointer-events-none -z-10",
                  )}
                >
                  <Image
                    src={slideImg}
                    alt={slide.imageAlt ?? imageAlt}
                    fill
                    sizes="(min-width: 1024px) calc(100vw - 160px), (min-width: 768px) calc(100vw - 64px), calc(100vw - 32px)"
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              );
            })}

            {/* Gradient Scrim */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-transparent via-black/45 via-50% to-black/95 z-[1] pointer-events-none"
            />

            {/* Vertically centered Navigation Arrows: Left and Right */}
            {isSlider && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="group absolute top-1/2 left-2 sm:left-4 md:left-8 z-20 -translate-y-1/2 flex items-center justify-center size-9 sm:size-11 md:w-[62px] md:h-[70px] border-[0.7px] border-white/60 hover:border-white bg-black/25 hover:bg-black/50 active:scale-95 active:bg-black/70 backdrop-blur-[12px] text-white transition-all duration-200 cursor-pointer focus-visible:outline-sky focus-visible:outline-2"
                >
                  <ChevronLeft className="size-4 sm:size-5 md:size-[18px] stroke-[1.5] transition-transform duration-200 group-hover:-translate-x-0.5 group-active:-translate-x-1" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="group absolute top-1/2 right-2 sm:right-4 md:right-8 z-20 -translate-y-1/2 flex items-center justify-center size-9 sm:size-11 md:w-[62px] md:h-[70px] border-[0.7px] border-white/60 hover:border-white bg-black/25 hover:bg-black/50 active:scale-95 active:bg-black/70 backdrop-blur-[12px] text-white transition-all duration-200 cursor-pointer focus-visible:outline-sky focus-visible:outline-2"
                >
                  <ChevronRight className="size-4 sm:size-5 md:size-[18px] stroke-[1.5] transition-transform duration-200 group-hover:translate-x-0.5 group-active:translate-x-1" aria-hidden="true" />
                </button>
              </>
            )}

            {/* Slide Content (Title centered in image, Description & Stats / Places at bottom) */}
            <div
              key={currentIndex}
              className={cn(
                "relative z-[2] flex flex-col justify-between h-full min-h-[580px] sm:min-h-[560px] md:min-h-[580px] lg:min-h-[620px] xl:min-h-[640px] px-5 sm:px-8 md:px-16 lg:px-20 pt-8 sm:pt-12 md:pt-14 pb-8 sm:pb-10 md:pb-12 lg:pb-14",

              )}
            >
              {/* Title centered in upper/middle of image */}
              <div className={cn(
                "flex-1 flex flex-col items-center justify-center text-center py-4",
                direction === "next" ? "motion-safe:animate-story-slide-in" : "motion-safe:animate-story-slide-back"
              )}>
                {activeSlide.title && (
                  <h3 className="whitespace-pre-line mx-auto max-w-[900px] text-center text-white font-heading max-lg:text-[30px] max-lg:leading-[1.1] max-lg:tracking-[-0.01em] lg:max-xl:text-[34px] lg:max-xl:leading-[1.15] xl:max-2xl:text-[42px] xl:max-2xl:leading-[1.15] 2xl:text-[46px] 2xl:leading-[1.15]">
                    {activeSlide.title}
                  </h3>
                )}
              </div>

              {/* Bottom section: Description & Stats */}
              <div className="w-full flex flex-col items-center text-center">
                {activeSlide.description && (
                <p className={cn(
                    "whitespace-pre-line mx-auto max-w-[1236px] text-center text-white xl:text-body max-xl:text-[14px] max-md:text-[13.5px] max-xl:leading-[1.5] lg:max-xl:text-[13.5px] lg:max-xl:leading-[1.4] xl:max-2xl:text-[16px] xl:max-2xl:leading-[1.4] 2xl:text-[18px] 2xl:leading-[24px] font-light",
                    direction === "next" ? "motion-safe:animate-story-desc-in" : "motion-safe:animate-story-desc-back"
                  )}>
                  {activeSlide.description}
                </p>
              )}

              {(activeSlide.stats?.length > 0 || stats.length > 0) && (
                <div
                  className={cn(
                    "w-full pt-2 pb-2 px-1",
                    activeSlide.description && "mt-6 sm:mt-7 lg:mt-8 xl:mt-9",
                  )}
                >
                  <ul className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 gap-y-3 sm:gap-y-4 text-center text-white">
                    {(activeSlide.stats?.length > 0 ? activeSlide.stats : stats).map((stat, idx) => (
                      <li
                        key={stat.label}
                        className="flex items-center gap-x-3 sm:gap-x-6 md:gap-x-8 lg:gap-x-10"
                      >
                        {idx > 0 && (
                          <span
                            className="h-6 sm:h-7 md:h-8 w-px bg-white/25 shrink-0 hidden sm:inline-block"
                            aria-hidden="true"
                          />
                        )}
                        <div className="flex flex-col items-center text-center px-1 sm:px-2">
                          <p className="font-top text-[10px] lg:text-[11px] 2xl:text-[12px] uppercase tracking-[0.08em] text-white/70 leading-none">
                            {stat.label}
                          </p>
                          <p className="mt-1.5 sm:mt-2 lg:mt-2.5 font-sans font-light whitespace-nowrap text-[13.5px] sm:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px] leading-normal text-white">
                            {stat.value}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(!activeSlide.stats || activeSlide.stats.length === 0) &&
                stats.length === 0 &&
                (activeSlide.places?.length > 0 || places.length > 0) && (
                  <ul
                    className={cn(
                      "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-white",
                      activeSlide.description && "mt-6 sm:mt-7 lg:mt-[27px]",
                      "lg:min-h-[60px]",
                    )}
                  >
                    {(activeSlide.places?.length > 0 ? activeSlide.places : places).map((place, i) => (
                      <li key={place} className="flex items-center gap-x-3">
                        {i > 0 && <PlaceMark />}
                        <span className="xl:text-body max-xl:text-[14px] max-md:text-[13px] max-xl:leading-[1.5] lg:max-xl:text-[13.5px] lg:max-xl:leading-[1.4] xl:max-2xl:text-[16px] xl:max-2xl:leading-[1.4] 2xl:text-[18px] 2xl:leading-[24px] font-light">
                          {place}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}

function PlaceMark() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="h-[14px] w-[14px] shrink-0 fill-current"
    >
      {[0, 45, 90, 135].map((angle) => (
        <ellipse
          key={angle}
          cx="8"
          cy="8"
          rx="2.2"
          ry="6.4"
          transform={`rotate(${angle} 8 8)`}
        />
      ))}
    </svg>
  );
}

