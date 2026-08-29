"use client";

import Image from "next/image";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

const GALLERY_IMAGES = [
  {
    id: 1,
    src: "/gallery/gallery-1.jpg",
    alt: "Travelers in front of Charminar, Hyderabad",
    title: "Hyderabad Heritage Tour",
  },
  {
    id: 2,
    src: "/gallery/gallery-2.jpg",
    alt: "Pagoda and Japanese gardens",
    title: "Kyoto Gardens & Pagoda",
  },
  {
    id: 3,
    src: "/gallery/gallery-3.jpg",
    alt: "Group photo at the Taj Mahal, Agra",
    title: "Taj Mahal Monument Journey",
  },
  {
    id: 4,
    src: "/gallery/hero-bg.jpg",
    alt: "Hikers walking through sandstone canyon",
    title: "Grand Canyon Exploration",
  },
  {
    id: 5,
    src: "/destination/india.avif",
    alt: "Incredible India journeys",
    title: "Kerala Backwaters & Hills",
  },
  {
    id: 6,
    src: "/destination/japan.avif",
    alt: "Scenic Mount Fuji and cherry blossoms",
    title: "Mount Fuji Discovery",
  },
  {
    id: 7,
    src: "/destination/norway.avif",
    alt: "Norway Fjords & Northern Lights",
    title: "Fjord Cruise & Northern Lights",
  },
  {
    id: 8,
    src: "/destination/switzerland.avif",
    alt: "Swiss Alps Mountain Panorama",
    title: "Swiss Alpine Escapes",
  },
  {
    id: 9,
    src: "/gallery/gallery-1.jpg",
    alt: "Historic monument cultural visit",
    title: "Cultural Wonders",
  },
  {
    id: 10,
    src: "/gallery/gallery-2.jpg",
    alt: "Serene mountain landscape",
    title: "Peaceful Retreats",
  },
  {
    id: 11,
    src: "/gallery/gallery-3.jpg",
    alt: "Joyful group expedition",
    title: "Memorable Group Journeys",
  },
  {
    id: 12,
    src: "/gallery/hero-bg.jpg",
    alt: "Golden hour canyon trail",
    title: "Canyon Adventure Trails",
  },
];

export function GalleryGridSection({
  images = GALLERY_IMAGES,
  className,
}) {
  return (
    <section
      aria-label="Photo Gallery Grid"
      className={cn(
        "bg-white pt-12 pb-20 sm:pt-16 sm:pb-24 md:pt-20 md:pb-28 lg:pt-24 lg:pb-32 2xl:pt-[80px] 2xl:pb-[140px] relative z-10",
        className
      )}
    >
      <Container className="w-full 2xl:max-w-[1928px] 2xl:!px-[84px]">
        {/* Exact 3-column grid with 14px gap and 613x306 (2:1) aspect ratio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]">
          {images.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="group relative w-full aspect-[613/306] overflow-hidden bg-neutral-100 rounded-[2px] shadow-sm"
            >
              <Image
                src={item.src}
                alt={item.alt || "Fortune Travels Gallery Photo"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Subtle hover overlay for rich visual feedback */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
