import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimateIn } from "@/components/common/AnimateIn";

/* A row of icon + title + lead + rule + body cards, divided by hairlines.

   Data-driven like TabbedCardsSection and SeasonsSection: the consuming
   section stays a data-only module and this owns all the layout. Items are
   `{ key, icon, iconWidth, iconHeight, iconAlt, title, lead, body }` — the
   icon dimensions are the DISPLAY size, handed straight to next/image so the
   intrinsic width/height attributes do the sizing. No CSS height class: the
   four source PNGs have different aspect ratios, and normalising them through
   the attributes keeps them on a common baseline without depending on an
   arbitrary-value utility.

   Four-up only from xl. At lg the columns are ~250px, which wraps every card
   title onto two lines, so the grid stays 2-up until there is room.

   Divider logic, by breakpoint — the cards carry their own borders rather than
   the grid carrying `divide-*`, because `divide-x/y` walks DOM order and so
   draws in the wrong places once the grid wraps to two columns:
     base (1 col)  every card border-t, first suppressed → interior rules only
     md   (2 cols) top two suppressed, odd cards border-r → a centre cross
     xl   (4 cols) tops all suppressed, every card border-l + last border-r
                   → five verticals, matching the Figma frame

   Height is a MIN, never fixed: the Figma frame pins 294px, but copy that runs
   longer than the mock must push the card taller rather than spill past the
   border it is supposed to sit inside. */
export function FeatureCards({ items, className, cardClassName }) {
  return (
    <AnimateIn
      as="ul"
      stagger={0.12}
      className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4", className)}
    >
      {items.map((item) => (
        <li
          key={item.key}
          className={cn(
            "flex flex-col items-center text-center rounded-[4px] border-black/20",
            "px-6 sm:px-8 pt-10 pb-8 md:pt-12 xl:min-h-[294px]",
            "border-t first:border-t-0",
            "md:[&:nth-child(-n+2)]:border-t-0 md:odd:border-r",
            "xl:border-t-0 xl:border-l xl:odd:border-r-0 xl:last:border-r",
            cardClassName,
          )}
        >
          {item.icon && (
            <Image
              src={item.icon}
              alt={item.iconAlt ?? ""}
              width={item.iconWidth}
              height={item.iconHeight}
              className="object-contain"
            />
          )}

          <h3 className="font-heading text-[20px] md:text-[22px] font-normal leading-[1.3] md:leading-[33px] tracking-normal text-black mt-4">
            {item.title}
          </h3>

          <p className="font-sans text-[13px] md:text-[14px] font-normal leading-[21px] text-black/80 mt-3 md:mt-4">
            {item.lead}
          </p>

          <span
            aria-hidden="true"
            className="block h-px w-full bg-black/20 mt-5 md:mt-6"
          />

          <p className="font-sans text-[13px] font-light leading-[21px] text-black/80 mt-5 md:mt-6">
            {item.body}
          </p>
        </li>
      ))}
    </AnimateIn>
  );
}
