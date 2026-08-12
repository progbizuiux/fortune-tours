"use client";

import { useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { CtaLink } from "@/components/common/CtaLink";
import { gsap, useGSAP } from "@/lib/gsap";

const CTA_LINKS = [
  { label: "Explore Packages", href: "#packages" },
  { label: "Design your itinerary", href: "/itinerary" },
];

export function HeroSection() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-image", { scale: 1.08, duration: 1.2 })
        .fromTo(
          ".hero-eyebrow",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.9",
        )
        .fromTo(
          ".hero-heading",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4",
        )
        .fromTo(
          ".hero-cta",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4",
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="sticky top-0 z-0 flex min-h-screen items-center justify-center overflow-hidden"
    >
      <noscript>
        <style>{`.hero-eyebrow,.hero-heading,.hero-cta{opacity:1 !important}`}</style>
      </noscript>

      <div className="hero-image absolute inset-0">
        <Image
          className="absolute inset-0 h-full w-full object-cover max-md:object-[25%] md:object-center"
          src="/destinations/kerala/kerala.avif"
          alt="Kerala backwaters with palm trees and a boat"
          fill
          priority
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/20 to-transparent" />
        {/* White fade at the bottom to blend into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-[25vh] bg-gradient-to-t from-white to-transparent" />
      </div>

      <Container className="relative flex flex-col items-center text-center md:items-end md:text-right md:pt-[30vh]">
        <span className="hero-eyebrow font-top max-md:text-[13px] text-h4 text-white/90 opacity-0 mb-8 md:mb-11">
          Fortune Tours &amp; Travels — Est. 1998
        </span>

        <h1 className="hero-heading font-heading max-md:text-[42px] max-md:leading-none text-h1 max-md:max-w-[400px] max-w-[889px] text-white opacity-0">
          Explore Kerala Beyond the Guidebooks
        </h1>

        <div className="hero-cta mt-11 md:mt-16 flex flex-wrap items-center justify-center md:justify-end max-md:gap-4 gap-x-3 gap-y-3 max-md:text-[13px] max-md:leading-6 text-body text-white/90 opacity-0">
          <span
            className="hidden h-4 w-px bg-white/30 sm:block"
            aria-hidden="true"
          />
          {CTA_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center max-md:gap-4 gap-3">
              <CtaLink
                href={link.href}
                dividerClassName={
                  i === CTA_LINKS.length - 1
                    ? "hidden h-4 w-px bg-white/30 sm:block"
                    : "max-sm:block max-sm:h-3 hidden h-4 w-px bg-white/30 sm:block"
                }
              >
                {link.label}
              </CtaLink>
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
