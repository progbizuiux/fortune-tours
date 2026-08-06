"use client";

import { useRef } from "react";
import { ArrowRight, PlayCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { gsap, useGSAP } from "@/lib/gsap";

const STATS = [
  { label: "Happy Travelers", value: "24K+" },
  { label: "Destinations", value: "120+" },
  { label: "Tour Packages", value: "350+" },
  { label: "Years of Experience", value: "12+" },
];

export function HeroSection() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.6 })
        .from(".hero-heading", { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")
        .from(
          ".hero-description",
          { y: 20, opacity: 0, duration: 0.6 },
          "-=0.5",
        )
        .from(
          ".hero-cta",
          { y: 20, opacity: 0, duration: 0.6, stagger: 0.15 },
          "-=0.4",
        )
        .from(".hero-image", { scale: 1.05, opacity: 0, duration: 1 }, "-=0.8")
        .from(
          ".hero-stat",
          { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 },
          "-=0.5",
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="bg-background relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <Container className="relative grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:py-0">
        <div className="flex flex-col gap-6">
          <span className="hero-eyebrow font-top text-eyebrow bg-sky/10 text-sky w-fit rounded-full px-4 py-1.5 font-semibold">
            Explore The World With Us
          </span>

          <h1 className="hero-heading font-heading text-h1 text-navy dark:text-cream">
            Discover Your Next Unforgettable{" "}
            <span className="text-sky">Adventure</span>
          </h1>

          <p className="hero-description text-lead text-navy/70 dark:text-cream/70 max-w-xl">
            Handpicked destinations, curated itineraries, and seamless travel
            experiences — all designed to turn your dream trip into reality.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              rightIcon={<ArrowRight className="size-5" />}
              className="hero-cta"
            >
              Plan Your Trip
            </Button>
            <Button
              size="lg"
              variant="outline"
              leftIcon={<PlayCircle className="size-5" />}
              className="hero-cta"
            >
              Watch Video
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="hero-stat border-navy/10 bg-navy/5 dark:border-cream/10 dark:bg-cream/5 rounded-2xl border p-4"
              >
                <p className="font-heading text-navy dark:text-cream text-2xl">
                  {stat.value}
                </p>
                <p className="text-navy/60 dark:text-cream/60 text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-image border-navy/10 from-navy/5 to-navy/10 dark:border-cream/10 dark:from-cream/5 dark:to-cream/10 relative aspect-[4/5] w-full overflow-hidden rounded-3xl border bg-gradient-to-br lg:aspect-[3/4]">
          <div className="text-navy/40 dark:text-cream/40 absolute inset-0 flex items-center justify-center">
            <span className="text-sm">Hero Image Placeholder</span>
          </div>
        </div>
      </Container>

      <div className="text-navy/50 dark:text-cream/50 absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="size-5 animate-bounce" aria-hidden="true" />
      </div>
    </section>
  );
}
