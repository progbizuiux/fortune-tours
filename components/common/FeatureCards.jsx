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
      className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 max-md:gap-5 lg:max-xl:max-w-[700px] lg:max-xl:mx-auto lg:max-xl:w-full xl:max-2xl:max-w-[960px] xl:max-2xl:mx-auto xl:max-2xl:w-full", className)}
    >
      {items.map((item) => (
        <li
          key={item.key}
          className={cn(
            "flex flex-col items-center text-center max-md:bg-white max-md:rounded-[8px] md:rounded-[4px] border-black/20",
            "px-6 sm:px-8 pt-10 pb-8 md:pt-12 xl:max-2xl:min-h-[240px] 2xl:min-h-[294px]",
            "lg:max-2xl:px-5 lg:max-2xl:pt-8 lg:max-2xl:pb-6 2xl:px-8 2xl:pt-12 2xl:pb-8",
            "max-md:border md:border-t md:first:border-t-0",
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
              className="object-contain transition-all duration-300 w-[var(--w)] h-[var(--h)] lg:max-2xl:w-[var(--w-lg-reduced)] lg:max-2xl:h-[var(--h-lg-reduced)] 2xl:w-[var(--w-lg)] 2xl:h-[var(--h-lg)]"
              style={{
                "--w": `${item.iconWidth}px`,
                "--h": `${item.iconHeight}px`,
                "--w-lg-reduced": `${item.iconWidth * 1.1}px`,
                "--h-lg-reduced": `${item.iconHeight * 1.1}px`,
                "--w-lg": `${item.iconWidth * 1.5}px`,
                "--h-lg": `${item.iconHeight * 1.5}px`,
              }}
            />
          )}

          <h3 className="font-heading text-[20px] md:text-[22px] font-normal leading-[1.3] md:leading-[33px] lg:leading-[28px] xl:max-2xl:text-[21px] xl:max-2xl:leading-[28.5px] 2xl:text-[22px] 2xl:leading-[33px] tracking-normal text-black mt-4">
            {item.title}
          </h3>

          <p className="font-sans text-[13px] md:text-[14px] font-normal max-md:leading-[145%] md:leading-[21px] xl:max-2xl:text-[14px] xl:max-2xl:leading-[20px] 2xl:text-[14px] 2xl:leading-[21px] text-black/80 max-md:mt-7 md:mt-4">
            {item.lead}
          </p>

          <span
            aria-hidden="true"
            className="block h-px w-full bg-black/20 mt-5 md:mt-6"
          />

          <p className="font-sans text-[13px] font-light leading-[21px] xl:max-2xl:text-[13px] xl:max-2xl:leading-[20px] 2xl:text-[13px] 2xl:leading-[21px] text-black/80 mt-5 md:mt-6">
            {item.body}
          </p>
        </li>
      ))}
    </AnimateIn>
  );
}
