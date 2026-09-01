"use client";

import Image from "next/image";
import { Container } from "@/components/common/Container";
import {
  MaskFrame,
  MaskImage,
  MaskLine,
  MaskRevealNoScript,
  MaskScrim,
} from "@/components/common/MaskReveal";
import { useMaskReveal } from "@/lib/gsap/useMaskReveal";
import { useMosaicZoom } from "@/lib/gsap/useMosaicZoom";
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
  title = "Moments Along the Way",
  description = "A collection of places, people, and moments that bring every Fortune journey to life.",
  images = GALLERY_IMAGES,
  className,
}) {
  // The grid opens blown up on its middle tile and shrinks to the layout below
  // as you scroll past. Everything it needs is measured off the markup — see
  // lib/gsap/useMosaicZoom.js.
  // focal: 0 so the zoom opens on the first tile — it is the one carrying the
  // page's title. open: "width" so it opens spanning the screen's width rather
  // than swallowing it whole: a shorter pull-back, and the banner still reads
  // as a banner with the section's dark ground showing above and below it.
  const ref = useMosaicZoom({ focal: 0, open: "width" });
  // The first tile's own entrance, on load, before any of that: its mask opens
  // upward and the title rises with it. Marked on one tile only, which is what
  // keeps this off the other eleven. See lib/gsap/useMaskReveal.js.
  useMaskReveal({ ref, onLoad: true });

  return (
    <section
      ref={ref}
      aria-label="Photo Gallery"
      className={cn(
        "bg-white pb-20 sm:pb-24 md:pb-28 lg:pb-32 2xl:pb-[140px] relative z-10",
        className,
      )}
    >
      <MaskRevealNoScript />

      {/* No spacer and nothing pinned: the section is exactly as tall as the
          grid, so once the zoom has run its course the gallery is an ordinary
          block of pictures and the page scrolls through it. Holding it in a
          viewport-tall sticky stage is what made the last rows unreachable. */}
      <div data-zoom-section className="relative">
        {/* Clips the grid while it is scaled up — at the opening scale the
            mosaic is several times the height of the screen. At rest the box is
            the grid's own size, so this clips nothing. */}
        <div data-zoom-stage className="relative lg:overflow-hidden">
          {/* The title card. From `lg` it is laid over the stage rather than
              placed inside the grid, so it keeps its size while the mosaic
              changes its own by a factor of four, and it fades out as the zoom
              pulls back (see useMosaicZoom). Below `lg` there is no zoom to sit
              over, so it is simply the section's heading, in flow above the
              photographs — which is also why it comes first in the DOM. */}
          <div
            data-zoom-content
            className="pointer-events-none relative z-10 flex flex-col items-center justify-center px-4 pt-28 pb-12 text-center sm:px-6 sm:pt-32 md:px-8 lg:absolute lg:inset-0 lg:px-8 lg:pt-0 lg:pb-0"
          >
            {/* Navy on the page's own white in the stacked layout, white once it
                is sitting on the photograph. The contrast underneath it belongs
                to the banner tile, not to this — a scrim stretched across the
                stage would also darken the white showing above and below the
                banner, which is the page's ground and not part of the picture. */}
            <div className="relative mx-auto flex max-w-4xl flex-col items-center">
              <MaskLine
                as="h1"
                className="font-heading text-navy text-[38px] leading-[1.06] font-normal tracking-[-0.01em] sm:text-[54px] md:text-[68px] lg:text-[80px] lg:text-white lg:drop-shadow-sm xl:text-[92px] 2xl:text-[100px]"
              >
                {title}
              </MaskLine>

              <MaskLine
                as="p"
                className="text-navy/70 mt-4 max-w-xl font-sans text-[14px] leading-relaxed font-light sm:mt-6 sm:text-[16px] md:max-w-2xl md:text-[18px] lg:text-white/90 lg:drop-shadow-sm 2xl:text-[20px] 2xl:leading-[30px]"
              >
                {description}
              </MaskLine>
            </div>
          </div>

          <Container className="w-full 2xl:max-w-[1928px] 2xl:!px-[84px]">
            {/* Exact 3-column grid with 14px gap and 613x306 (2:1) aspect ratio */}
            <div
              data-zoom-grid
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]"
            >
              {images.map((item, index) => {
                const image = (
                  <Image
                    src={item.src}
                    alt={item.alt || "Fortune Travels Gallery Photo"}
                    fill
                    // The first tile is the page's opening frame, so it is
                    // fetched eagerly; the rest stay lazy and mostly never load
                    // at all until the zoom has pulled back far enough to show
                    // them. 100vw from `lg`, where a single tile is blown up to
                    // fill the screen — asking for 33vw there buys a 480px file
                    // and shows it four times that wide.
                    priority={index === 0}
                    sizes="(min-width: 1024px) 100vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                );
                const hover = (
                  /* Subtle hover overlay for rich visual feedback */
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
                );
                const tile =
                  "group relative w-full aspect-[613/306] bg-neutral-100 rounded-[2px] shadow-sm";

                // The first tile alone carries the masked reveal's markup: it
                // is the one on screen at load, and the one the title sits on.
                //
                // It is also placed into the middle column rather than left to
                // land top-left, which is where document order would put it.
                // The zoom holds the banner still and moves the mosaic around
                // it, so an off-centre banner means the whole wall has to travel
                // to get where it belongs — from the corner that was a 426px
                // diagonal slide on the way out. Centred horizontally it is
                // none: the grid's own centre is already under it, and only the
                // half-row of vertical offset is left. The other eleven flow
                // around it, since auto-placement skips a cell that is spoken
                // for. Below `lg` there is no zoom and one column, so this does
                // nothing and the banner stays first, where it reads as the
                // heading's picture.
                return index === 0 ? (
                  <MaskFrame
                    key={`${item.id}-${index}`}
                    className={cn(tile, "lg:col-start-2 lg:row-start-2")}
                  >
                    <MaskImage>{image}</MaskImage>
                    {/* Contrast for the title, and only under it: inside the
                        tile it covers the photograph exactly and scales away
                        with it, where a scrim on the stage would grey out the
                        page's own white above and below the banner. Kept from
                        `lg` because that is the only place type sits here. */}
                    <div className="pointer-events-none absolute inset-0 hidden bg-black/35 lg:block" />
                    {hover}
                    <MaskScrim className="bg-black/50" />
                  </MaskFrame>
                ) : (
                  <div
                    key={`${item.id}-${index}`}
                    className={cn(tile, "overflow-hidden")}
                  >
                    {image}
                    {hover}
                  </div>
                );
              })}
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
