import Image from "next/image";
import { CascadeText } from "@/components/common/CascadeText";
import { cn } from "@/lib/utils";

/* Bordered package card: picture, then the title, the nights/destinations line
 * and an EXPERIENCES list pinned to the bottom of the box.
 *
 * Extracted from Kerala's FixedPackagesSection, which already had it built to
 * these exact redlines — Neiko 400 32/30 title with its 60px drop, the 16px
 * uppercase meta and EXPERIENCES label, the 16/20 list at black/80, and the
 * 15/33/35 content padding. The honeymoon package section draws the same card,
 * so it now has one home and Kerala renders through here too.
 *
 * What the two call sites genuinely differ on is passed in rather than
 * hardcoded: Kerala's picture is 447x423 against honeymoon's 460x423, its meta
 * line is a smaller letter-spaced full-black variant, and its content block is
 * inset 33 from md up where honeymoon holds the 12 its redline gives at every
 * width. Defaults are the honeymoon values; Kerala passes its own so it stays
 * pixel-identical.
 *
 * mt-auto on the lower block is what makes a row of these line up: titles wrap
 * to different line counts, and without it the meta and list would sit at a
 * different height in every card.
 */
export function PackageCard({
  title,
  meta,
  experiences,
  image,
  alt,
  className,
  imageAspectClassName = "aspect-[348/329] md:aspect-[460/423]",
  metaClassName = "text-[13px] lg:text-[16px] leading-[1] text-black/80 mb-[10px] lg:mb-[12px]",
  // 15 from the picture to the title and 12 in from each edge, per the redline.
  contentClassName = "px-[12px] pt-[15px] pb-[16px] md:pb-[35px]",
  sizes = "(min-width: 1280px) 460px, 85vw",
  /* Opt in to the scroll-in cascade (lib/gsap/useCardCascade.js), which needs the
     hooks below to find the three parts that move. Off by default, so Kerala's
     packages — which never asked for it — render exactly as they were. */
  cascade = false,
}) {
  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden border border-black/10 bg-white",
        className,
      )}
    >
      <div
        data-cascade-picture={cascade ? "" : undefined}
        className={cn("relative w-full overflow-hidden", imageAspectClassName)}
      >
        <Image
          src={image}
          alt={alt ?? title}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className={cn("flex flex-1 flex-col", contentClassName)}>
        <h3 className="font-heading mb-[20px] text-[18px] leading-[30px] font-normal text-black lg:mb-[60px] lg:text-[32px]">
          {cascade ? <CascadeText part="title">{title}</CascadeText> : title}
        </h3>

        <div className="mt-auto">
          <p className={cn("font-sans font-light uppercase", metaClassName)}>
            {cascade ? (
              <CascadeText part="subtitle">{meta}</CascadeText>
            ) : (
              meta
            )}
          </p>

          <p className="font-sans mb-1 text-[13px] leading-[1] font-light uppercase text-black/80 lg:text-[16px]">
            EXPERIENCES:
          </p>
          <p className="font-sans text-[13px] leading-[1.4] font-light text-black/80 lg:text-[16px] lg:leading-[20px]">
            {experiences}
          </p>
        </div>
      </div>
    </div>
  );
}
