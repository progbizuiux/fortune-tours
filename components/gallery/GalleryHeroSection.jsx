"use client";

import Image from "next/image";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

export function GalleryHeroSection({
  title = "Moments Along the Way",
  description = "A collection of places, people, and moments that bring every Fortune journey to life.",
  backgroundImage = "/gallery/hero-bg.jpg",
  className,
}) {
  return (
    <section
      aria-label="Gallery Hero"
      className={cn(
        "relative min-h-[100svh] w-full flex items-center justify-center text-white overflow-hidden select-none",
        className
      )}
    >
      {/* Background Image & Ambient Scrim */}
      <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-[1.02] transition-transform duration-1000 ease-out"
        />
        {/* Figma 35% black overlay for contrast */}
        <div className="absolute inset-0 bg-black/35" />
        {/* Soft top gradient for navbar contrast */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
        {/* Soft bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Hero Content - Perfectly Centered */}
      <Container className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="font-heading text-[38px] sm:text-[54px] md:text-[68px] lg:text-[80px] xl:text-[92px] 2xl:text-[100px] leading-[1.06] text-white font-normal tracking-[-0.01em] drop-shadow-sm">
            {title}
          </h1>

          <p className="mt-4 sm:mt-6 font-sans font-light text-[14px] sm:text-[16px] md:text-[18px] 2xl:text-[20px] leading-relaxed 2xl:leading-[30px] text-white/90 max-w-xl md:max-w-2xl mx-auto drop-shadow-sm">
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
}
