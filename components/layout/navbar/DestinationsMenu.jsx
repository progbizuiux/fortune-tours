"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone } from "lucide-react";
import { MegaMenuPanel } from "./MegaMenuPanel";
import {
  ALL_DESTINATIONS_LINK,
  CONCIERGE_PROMO,
  CURATED_DESTINATIONS,
  DESTINATION_REGIONS,
} from "@/lib/navigation";
import { MENU_ROW_ENTER, menuRowDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* The Destinations dropdown.
 *
 * Two columns. The left one is the fixed region list; the right one is
 * "Curated For You" until a region is hovered, then that region's countries
 * with the concierge card beside them. The hovered region is remembered
 * rather than tracked live so the pointer can leave the list and travel across
 * to the country grid without the column snapping back — it resets only when
 * the whole menu closes, because the panel unmounts with it.
 *
 * All content comes from lib/navigation.js; nothing here is hardcoded. */
export const DestinationsMenu = forwardRef(function DestinationsMenu(
  { id, onNavigate, ...panelProps },
  ref,
) {
  const [activeKey, setActiveKey] = useState(null);
  const activeRegion = DESTINATION_REGIONS.find((r) => r.key === activeKey);
  const columnRef = useRef(null);

  // Keyboard route into the right-hand column: ArrowRight on a region row
  // shows that region and moves focus to its first country. Tab alone must
  // not swap the column (see RegionList), so this is the only way a keyboard
  // reaches a country grid — and it reaches every one of them.
  function activateAndEnter(key) {
    setActiveKey(key);
    requestAnimationFrame(() => columnRef.current?.querySelector("a")?.focus());
  }

  return (
    <MegaMenuPanel
      ref={ref}
      id={id}
      label="Destinations menu"
      onNavigate={onNavigate}
      {...panelProps}
    >
      {/* Leaving the two columns clears the region, so the curated cards come
          back rather than the last-hovered country grid staying up. Scoped to
          this row, not the panel: the pointer travels between the region list
          and its grid constantly, and both live inside here. */}
      <div
        className="flex items-start gap-14 2xl:gap-20"
        onMouseLeave={() => setActiveKey(null)}
      >
        <RegionList
          activeKey={activeKey}
          onActivate={setActiveKey}
          onEnter={activateAndEnter}
        />
        <div ref={columnRef} className="min-w-0 flex-1">
          {activeRegion ? (
            <RegionCountries region={activeRegion} />
          ) : (
            <CuratedDestinations />
          )}
        </div>
      </div>
    </MegaMenuPanel>
  );
});

/* ── Left column ──────────────────────────────────────────────────────────── */

const REGION_ROW =
  "text-nav text-navy/85 hover:text-navy flex h-[42px] items-center justify-between border-b border-black/10 px-3 transition-colors duration-200 hover:bg-black/[0.04]";

// A row has to be rested on for this long before it takes over the right-hand
// column. Moving diagonally from a region across to its country grid crosses
// the rows beneath it, and without the delay the last row crossed would win —
// the grid the user was reaching for swaps out from under the pointer. Each
// row cancels its own pending switch on mouseleave, so a sweep commits nothing
// and only the row the pointer stops on does.
const REGION_SWITCH_DELAY_MS = 150;

function RegionList({ activeKey, onActivate, onEnter }) {
  const timer = useRef(null);
  const cancel = useCallback(() => clearTimeout(timer.current), []);
  useEffect(() => cancel, [cancel]);

  function scheduleActivate(key) {
    cancel();
    timer.current = setTimeout(() => onActivate(key), REGION_SWITCH_DELAY_MS);
  }

  return (
    <nav
      aria-label="Destination regions"
      className="w-[240px] shrink-0 2xl:w-[280px]"
    >
      <h4 className="text-navy">Destinations</h4>
      <ul className="mt-9">
        {DESTINATION_REGIONS.map((region, index) => {
          const isActive = region.key === activeKey;
          return (
            <li
              key={region.key}
              className={MENU_ROW_ENTER}
              style={menuRowDelay(index)}
            >
              {/* Hover selects; focus deliberately does not. The right-hand
                  column comes after this whole list in the DOM, so if Tab
                  swapped it the curated cards could never be reached and the
                  last row tabbed past would always win. ArrowRight is the
                  keyboard's way in. */}
              <Link
                href={region.href}
                onMouseEnter={() => scheduleActivate(region.key)}
                onMouseLeave={cancel}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowRight") return;
                  event.preventDefault();
                  cancel();
                  onEnter(region.key);
                }}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  REGION_ROW,
                  isActive && "bg-black/[0.04] text-navy",
                )}
              >
                {region.label}
                <ChevronRight
                  aria-hidden="true"
                  className="text-navy/60 size-3.5 shrink-0"
                />
              </Link>
            </li>
          );
        })}
        <li
          className={MENU_ROW_ENTER}
          style={menuRowDelay(DESTINATION_REGIONS.length)}
        >
          {/* No chevron: this is a plain link with no country panel behind it,
              which is exactly how the design draws it. */}
          <Link href={ALL_DESTINATIONS_LINK.href} className={REGION_ROW}>
            {ALL_DESTINATIONS_LINK.label}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

/* ── Right column: default ────────────────────────────────────────────────── */

function CuratedDestinations() {
  return (
    <section aria-labelledby="navbar-curated-heading">
      <h4 id="navbar-curated-heading" className="text-navy">
        Curated For You
      </h4>
      {/* max-w pins the five cards at the design's 252px on the 1920 frame
          instead of letting them stretch to fill the column; below that the
          grid shrinks with the viewport and the aspect ratio keeps their shape.
          Three across below xl: at 1024 the column is ~570px wide and five
          cards there are 95px boxes that cannot hold their captions. */}
      <ul className="mt-6 grid max-w-[1324px] grid-cols-3 gap-4 xl:grid-cols-5 2xl:max-w-[1460px]">
        {CURATED_DESTINATIONS.map((place, index) => (
          <li
            key={place.key}
            className={MENU_ROW_ENTER}
            style={menuRowDelay(index, { step: 40 })}
          >
            <Link
              href={place.href}
              className="group relative block aspect-[252/244] overflow-hidden bg-navy/5"
            >
              <Image
                src={place.image}
                alt={place.alt}
                fill
                sizes="(min-width: 1536px) 280px, (min-width: 1280px) 252px, 30vw"
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/15"
              />
              <span className="absolute inset-x-0 bottom-0 flex flex-col p-4 text-white">
                <span className="text-body leading-tight font-medium lg:max-xl:text-[11.5px] xl:max-2xl:text-[12.5px] 2xl:text-[15px]">
                  {place.title}
                </span>
                <span className="text-small mt-1 leading-none font-light text-white/80 lg:max-xl:text-[10px] xl:max-2xl:text-[10.5px] 2xl:text-[13px]">
                  {place.tagline}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Right column: a region is hovered ────────────────────────────────────── */

// The design lists countries down each column, then across. CSS grid flows
// row-major by default, so the row count is fixed from the item count and the
// flow flipped to columns. Three columns as drawn; a fourth for the long lists
// (Asia and Europe run to 29), so the tallest region stays about the height of
// the region list beside it instead of pushing the sheet past the viewport.
function countryColumns(count) {
  return count > 18 ? 4 : 3;
}

function RegionCountries({ region }) {
  const columns = countryColumns(region.countries.length);
  const rows = Math.ceil(region.countries.length / columns);
  const headingId = `navbar-region-${region.key}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <h4 id={headingId} className="text-navy">
        Countries in {region.label}
      </h4>
      <div className="mt-6 flex items-start gap-8 2xl:gap-10">
        {/* auto-cols-fr: the columns are implicit (created by the column
            flow), and implicit tracks size to content by default — Europe's
            columns would land in different places than Africa's and the grid
            would jitter as regions swap. Equal fractions pin them. */}
        {/* Keyed by region so a swap remounts the list and its items rise in
            again — the same entrance as the rest of the menu. */}
        <ul
          key={region.key}
          className="grid min-w-0 flex-1 auto-cols-fr grid-flow-col gap-x-8 gap-y-[34px] 2xl:gap-x-10"
          style={{ gridTemplateRows: `repeat(${rows}, auto)` }}
        >
          {region.countries.map((place, index) => (
            <li
              key={place.name}
              className={MENU_ROW_ENTER}
              // Delay follows the reading order (down, then across), so the
              // stagger ripples down each column rather than across rows.
              style={menuRowDelay(index, { step: 16 })}
            >
              <Link href={place.href} className="group block">
                <span className="text-body text-navy group-hover:text-sky block leading-tight font-normal transition-colors">
                  {place.name}
                </span>
                <span className="text-small text-navy/70 mt-1 block leading-none font-light">
                  {place.tagline}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <ConciergePromo />
      </div>
    </section>
  );
}

function ConciergePromo() {
  return (
    // 2xl and up only: the card is drawn at the design's 414px and below that
    // frame the country columns need the width more than the card does.
    <div className="relative hidden aspect-[414/400] w-[414px] shrink-0 overflow-hidden bg-navy/5 2xl:block">
      <Image
        src={CONCIERGE_PROMO.image}
        alt={CONCIERGE_PROMO.alt}
        fill
        sizes="414px"
        className="object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10"
      />
      {/* Smaller type than the sheet's lists: this is a caption block on a
          photograph, and at the body size it crowded the 414px card. text-sm /
          text-xs are Tailwind's fixed 14px / 12px — the site's own --text-small
          is 16px, which is what was too big here. */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-7 text-white">
        <p className="text-sm leading-none">{CONCIERGE_PROMO.lead}</p>
        <a
          href={CONCIERGE_PROMO.phoneHref}
          className="hover:bg-sky text-navy mt-3 flex h-10 w-full items-center justify-center gap-2 bg-white text-sm leading-none transition-colors duration-300 hover:text-white"
        >
          <Phone aria-hidden="true" className="size-4 shrink-0" />
          {CONCIERGE_PROMO.phoneLabel}
        </a>
        <p className="mt-3 text-xs leading-none text-white/75">
          {CONCIERGE_PROMO.hours}
        </p>
        <p className="mt-1.5 text-xs leading-snug text-white/75">
          {CONCIERGE_PROMO.note}
        </p>
      </div>
    </div>
  );
}
