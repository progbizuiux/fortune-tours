import Image from "next/image";
import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

/* Second section of every destination region page — Figma "Discover Africa",
 * measured off the 1920 frame.
 *
 * A centred chapter heading, then one wide photograph with the region's story
 * and its signature places set over the dark end of a gradient.
 *
 * Figma values, all from the frame's own panel:
 *   image        1761 x 781 at left 80  — Container's content box exactly, so
 *                the picture is the Container rather than a measured width
 *                (padding-left/right is 80px from lg; see Container.module.css)
 *   overlay      linear gradient, #000000 -> #000000, transparent at the top
 *   description  Poppins 300 18/24, centred, #FFFFFF, box 1236 wide
 *   gap          description -> places 50
 *   places row   903 x 60 hug, each label 176 x 13 (cap height of 18px Poppins)
 *
 * The aspect ratio carries the picture rather than the raw 1761x781: the width
 * already tracks the Container at every breakpoint, so stating the height as a
 * ratio reproduces the frame exactly at 1920 and keeps the same crop on the way
 * down instead of letterboxing.
 *
 * Shape-only — every string comes from the page, so all thirteen regions render
 * through this one file. Content comes from lib/strapi/destination.js.
 */
export function ImageIntroSection({
  eyebrow,
  title,
  description,
  places = [],
  image,
  imageAlt = "",
  ariaLabel,
  className,
}) {
  return (
    <section
      aria-label={ariaLabel ?? title}
      /* bg-background is load-bearing, not cosmetic: the hero above is sticky,
         so a transparent section scrolls over it and lets the hero show
         straight through this one's copy. The home page's DestinationsSection
         carries the same ground for the same reason. The token, not bg-white,
         so the page ground stays defined in one place. */
      className={cn("bg-background spacing", className)}
    >
      <Container>
        <SectionHeading 
          align="center" 
          eyebrow={eyebrow} 
          title={title} 
          titleClassName="max-w-[900px] mx-auto"
        />

        {/* The frame puts 60 between the heading block and the picture. */}
        <AnimateIn className="mt-10 md:mt-14 lg:mt-[60px]">
          {/* justify-end drops the copy onto the box's bottom padding, which is
              what the frame measures: the places row closes 30px above the
              picture's bottom edge and the description sits 50 above that.

              The ratio only governs from lg, where the frame is measured and
              the 243px of copy has the picture's lower third to itself. Below
              that the same copy would be a dozen lines inside a 166px-tall
              strip, so the box takes a min-height and grows with the text —
              object-cover re-crops the photograph to whatever height that
              lands on, which is the same trade the hero makes. */}
          <div className="relative flex flex-col justify-end max-md:aspect-[3/4] max-md:max-h-[550px] md:max-xl:aspect-[16/9] xl:aspect-[1755/635] max-md:w-[calc(100%+2rem)] max-md:-ml-4 max-md:rounded-none md:w-full overflow-hidden md:rounded-sm">
            <Image
              /* The prop, not a literal: this section renders all thirteen
                 regions, and the file below was Africa's. lib/strapi/destination.js
                 supplies the CMS upload or the stand-in. */
              src={image}
              alt={imageAlt}
              fill
              /* The picture is the Container's content box: full-bleed minus
                 its padding, which is 160px once that padding reaches 80. */
              sizes="(min-width: 1024px) calc(100vw - 160px), (min-width: 768px) calc(100vw - 64px), calc(100vw - 32px)"
              className="object-cover"
            />

            {/* The frame's overlay, as its panel states it: one linear gradient,
                both stops #000000, the first at 0% opacity. Top to bottom is
                Figma's default direction, so the picture is untouched across
                its sky and ramps to solid black at the bottom edge — which is
                what carries the white copy over the lower third. Kept as the
                literal two stops rather than an eased ramp: the design is a
                straight interpolation and shaping it is a change, not a
                translation. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black"
            />

            <div className="relative px-4 pb-8 md:px-8 lg:pb-[30px]">
              {/* A bare <p> is already Poppins 300 with the body token's
                  16->18px ramp on a 24px line box — the frame's type spec
                  exactly at 1920, so only colour, measure and alignment are
                  stated here. */}
              {description && (
                <p className="mx-auto max-w-[1236px] text-center text-white xl:text-body max-xl:text-[14px] max-md:text-[13px] max-xl:leading-[1.5] font-light">
                  {description}
                </p>
              )}

              {places.length > 0 && (
                <ul
                  className={cn(
                    "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-white",
                    description && "mt-7 lg:mt-[27px]",
                    "lg:min-h-[60px]"
                  )}
                >
                  {places.map((place, i) => (
                    <li key={place} className="flex items-center gap-x-3">
                      {/* Between items, never before the first — the frame
                          draws four marks across five places. */}
                      {i > 0 && <PlaceMark />}
                      <span className="xl:text-body max-xl:text-[14px] max-md:text-[13px] max-xl:leading-[1.5] font-light">
                        {place}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}

/* The eight-petal mark the frame sets between places. Drawn here rather than
   loaded as an asset because the design's export is not in the repo — four
   ellipses crossed at 45 degrees, which is the shape the frame draws. Swap in
   the exported SVG when it lands; nothing else has to change.

   14px is what the row's own arithmetic gives it: the five labels measure ~761
   of the row's 903, leaving the four marks and their eight 12px gaps to fill
   the remaining 142. */
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
