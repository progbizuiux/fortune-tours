"use client";

import { ImageCarouselSection } from "@/components/common/ImageCarouselSection";

const STYLES = [
  {
    key: "relax",
    label: "Relax.",
    image: "/home/image-4.png",
    alt: "Traveller in a white dress unwinding on the deck of a river cruiser",
    tag: "I want.",
  },
  {
    key: "explore",
    label: "Explore.",
    image: "/home/journal/city-guide.png",
    alt: "Sunlit city streets waiting to be wandered",
    tag: "I want.",
  },
  {
    key: "celebrate",
    label: "Celebrate.",
    image: "/home/image-2.jpg",
    alt: "Family celebrating together at a theme-park entrance",
    tag: "I want.",
  },
  {
    key: "adventure",
    label: "Adventure.",
    image: "/home/swiss-alpine.png",
    alt: "Snow-capped alpine peaks above a mountain trail",
    tag: "I want.",
  },
  {
    key: "spiritual",
    label: "Spiritual.",
    image: "/home/journal/climatic.png",
    alt: "Temple walk beneath cherry blossoms in Kyoto",
    tag: "I want.",
  },
  {
    key: "luxury",
    label: "Luxury.",
    image: "/home/journal/coastal-escape.png",
    alt: "Cliffside coastal town above a glittering sea",
    tag: "I want.",
  },
  {
    key: "wildlife",
    label: "Wildlife.",
    image: "/home/grand-usa.png",
    alt: "Vast canyon landscape carved by wind and water",
    tag: "I want.",
  },
  {
    key: "cruise",
    label: "Cruise.",
    image: "/home/image-1.png",
    alt: "Sunset over the deck of a sailing river cruise ship",
    tag: "I want.",
  },
];

export function TravelStylesSection() {
  return (
    <ImageCarouselSection
      ariaLabel="Compass — discover your travel style"
      eyebrow="Chapter 04 — Compass"
      title="Discover your travel style."
      description="Share how you want to feel. Our concierge will create a unique itinerary."
      items={STYLES}
      buttonText="Reveal my journeys."
      gridClassName="grid-cols-2 sm:grid-cols-4 lg:grid-cols-8"
    />
  );
}
