import { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { MegaMenuPanel } from "./MegaMenuPanel";
import { CONCIERGE_PROMO, SITE_MENU } from "@/lib/navigation";
import { MENU_ROW_ENTER, menuRowDelay } from "@/lib/motion";

/* The sheet behind the bar's menu button — the site-wide pages.
 *
 * Two tiers, as the design draws them: the primary pages large (at the h4
 * token in the heading face), then the smaller service links. Both come from
 * lib/navigation.js. */
export const SiteMenu = forwardRef(function SiteMenu(
  { id, onNavigate, ...panelProps },
  ref,
) {
  return (
    <MegaMenuPanel
      ref={ref}
      id={id}
      label="Site menu"
      onNavigate={onNavigate}
      {...panelProps}
    >
      <div className="flex items-start gap-14 2xl:gap-20">
      <nav
        aria-label="Site"
        className="flex flex-col gap-14 lg:gap-[59px] lg:max-2xl:gap-[32px]"
      >
        <ul className="flex flex-col gap-[26px] lg:max-2xl:gap-[16px]">
          {SITE_MENU.primary.map((item, index) => (
            <li
              key={item.href}
              className={MENU_ROW_ENTER}
              style={menuRowDelay(index)}
            >
              {/* Figma: Neiko 400, 32px on 100% leading, #1D232A. Classes
                  rather than seven <h4> elements — this is a list of links. */}
              <Link
                href={item.href}
                className="font-heading text-[32px] leading-none font-normal text-[#1D232A] lg:max-xl:text-[19px] xl:max-2xl:text-[20.5px] hover:text-sky inline-flex min-h-11 items-center transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-[9px] lg:max-2xl:gap-[4px]">
          {SITE_MENU.secondary.map((item, index) => (
            <li
              key={item.href}
              className={MENU_ROW_ENTER}
              // Continues the count from the primary list, so the two tiers
              // read as one cascade.
              style={menuRowDelay(SITE_MENU.primary.length + index)}
            >
              <Link
                href={item.href}
                className="text-[18px] leading-none font-light text-[#454E56] lg:max-xl:text-[13.5px] xl:max-2xl:text-[14.5px] hover:text-sky flex min-h-9 items-center transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <FeaturedPanel />
      </div>
    </MegaMenuPanel>
  );
});

/* The picture beside the link lists, with the concierge details over it.
   Figma → the site menu at 1920: a 1103x758 image carrying a flat #000000 at
   12%. Written as a ratio rather than those fixed pixels so it holds the shape
   while the column flexes.

   Hidden below lg: the sheet is a single stacked column of links there and the
   picture would push them off the screen. */
function FeaturedPanel() {
  return (
    <div className="relative ml-auto hidden aspect-[1103/758] w-full max-w-[1103px] lg:max-2xl:max-w-[620px] min-w-0 flex-1 overflow-hidden bg-navy/5 lg:block">
      <Image
        src="/featured_image.png"
        alt=""
        fill
        sizes="(min-width: 1536px) 1103px, 50vw"
        className="object-cover object-center"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/[0.12]" />

      {/* Centred over the foot of the picture, as drawn — the same copy the
          destinations sheet's concierge card carries, from lib/navigation.js. */}
      {/* Figma: 611 wide, hugging 156 tall, 16 padding, 12 gap, on #000000 at
          10.2% with a blur behind it. */}
      <div className="absolute inset-x-0 bottom-8 mx-auto flex w-[611px] max-w-[calc(100%-3.5rem)] flex-col gap-3 bg-black/[0.102] p-4 text-center text-white backdrop-blur-[6px]">
        {/* Poppins 400 16/100%, #FFFFFF. */}
        <p className="text-[16px] leading-none font-normal">
          {CONCIERGE_PROMO.lead}
        </p>
        {/* 36 tall, full width; label Poppins 300 18/100% at #111827. */}
        <a
          href={CONCIERGE_PROMO.phoneHref}
          className="hover:bg-sky flex h-9 w-full items-center justify-center gap-2 bg-white text-[18px] leading-none font-light text-[#111827] transition-colors duration-300 hover:text-white"
        >
          <Phone aria-hidden="true" className="size-4 shrink-0" />
          {CONCIERGE_PROMO.phoneLabel}
        </a>
        {/* One centred block in the design, Poppins 400 12/150% at 70% white. */}
        <p className="text-[12px] leading-[1.5] font-normal text-white/70">
          {CONCIERGE_PROMO.hours} {CONCIERGE_PROMO.note}
        </p>
      </div>
    </div>
  );
}
