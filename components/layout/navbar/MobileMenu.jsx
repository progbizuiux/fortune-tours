"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CtaLink } from "@/components/common/CtaLink";
import { FrameButton } from "@/components/common/FrameButton";
import {
  ALL_DESTINATIONS_LINK,
  DESTINATION_REGIONS,
  EXPERIENCE_MENU,
  MENU_KEYS,
  SITE_MENU,
  publishedCountrySet,
  resolveCountryHref,
} from "@/lib/navigation";
import { MENU_ROW_ENTER, menuRowDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* The navigation below lg — a drill-down.
 *
 * Level one is the main links. A link that has a dropdown on desktop is a row
 * with a chevron here instead; tapping it slides in level two: "Back", the
 * section's name, and its items. Regions under Destinations drill down into
 * their countries (level three), matching the desktop mega menu.
 * Going back slides the parent level in again from the other side.
 */

const SUBMENUS = {
  [MENU_KEYS.EXPERIENCES]: {
    title: "Experiences",
    items: EXPERIENCE_MENU.map(({ label, href }) => ({ label, href })),
  },
  // The desktop menu button's sheet, as one flat list here. Level one already
  // links to About, so it is left out rather than listed twice.
  [MENU_KEYS.SITE]: {
    title: "More",
    items: [...SITE_MENU.primary, ...SITE_MENU.secondary],
  },
};

const ROW_LINK =
  "text-navy/80 dark:text-cream/80 text-body flex min-h-11 items-center";

export function MobileMenu({ links, pathname, onNavigate, publishedCountries }) {
  const [level, setLevel] = useState(null);
  // Only a return from a sub-level slides the previous level in — the first open of the
  // menu animates as a whole (the panel's own entrance below).
  const [returning, setReturning] = useState(false);

  const backRef = useRef(null);
  const rowRefs = useRef({});
  // The row that opened the current sub-list, so Back can hand focus back to
  // it: both level changes unmount the focused control, and without this a
  // keyboard or screen-reader user is dropped on <body>.
  const openedFrom = useRef(null);

  const published = useMemo(
    () => publishedCountrySet(publishedCountries),
    [publishedCountries],
  );

  const isRegionLevel = level?.startsWith("region:");
  const activeRegion = isRegionLevel
    ? DESTINATION_REGIONS.find((r) => r.key === level.replace("region:", ""))
    : null;

  const submenu = level && !isRegionLevel ? SUBMENUS[level] : null;

  /* Only the rows that ARE links. A row that opens a sub-list carries an href
     for the desktop bar but is a button here, so its target — the A to Z
     under Destinations — must stay in the list it opens. */
  const topLevelHrefs = new Set(
    links.filter((link) => !link.menu).map((link) => link.href),
  );

  useEffect(() => {
    if (level) backRef.current?.focus();
    else if (openedFrom.current) rowRefs.current[openedFrom.current]?.focus();
  }, [level]);

  function drillInto(key) {
    openedFrom.current = key;
    setReturning(false);
    setLevel(key);
  }

  function goBack() {
    setReturning(true);
    if (level?.startsWith("region:")) {
      setLevel(MENU_KEYS.DESTINATIONS);
    } else {
      setLevel(null);
    }
  }

  return (
    <nav
      // md:px-8 tracks Container's own padding — at 768-1023 the panel's
      // links sat 16px from the edge while the logo and menu button above
      // them sat 32px in. max-h / overflow-y: the region list is 15 rows, which
      // runs off a phone screen under the fixed bar without it — and dvh, not
      // vh, so the cap is the screen actually visible under the browser's
      // toolbars rather than the taller one with them retracted.
      className="motion-safe:animate-menu-drop border-navy/10 max-h-[calc(100dvh-80px)] overflow-y-auto border-t bg-white px-4 py-6 md:px-8 lg:hidden"
      aria-label="Mobile"
      // Lenis does not release the wheel/touch to nested scrollers by default;
      // without this the region list could not be scrolled on a short screen.
      data-lenis-prevent
      // Any link in here closes the whole menu. Delegated once rather than
      // wired onto each CtaLink; see Navbar for why a pathname change alone
      // is not enough.
      onClick={(event) => {
        if (onNavigate && event.target.closest("a[href]")) onNavigate();
      }}
    >
      {activeRegion ? (
        <div key={level} className="motion-safe:animate-menu-slide-in">
          <FrameButton ref={backRef} variant="menuBack" onClick={goBack}>
            <ChevronLeft className="size-4" aria-hidden="true" />
            Back
          </FrameButton>
          <h4 className="text-navy dark:text-cream mt-2">
            Countries in {activeRegion.label}
          </h4>
          <ul className="mt-4 flex flex-col gap-1">
            <li className={MENU_ROW_ENTER} style={menuRowDelay(0)}>
              <CtaLink
                href={activeRegion.href}
                underline={false}
                className={cn(ROW_LINK, "font-medium text-sky")}
              >
                Explore all {activeRegion.label}
              </CtaLink>
            </li>
            {activeRegion.countries.map((country, index) => {
              const countryHref = resolveCountryHref(country, activeRegion, published);
              return (
                <li
                  key={country.name}
                  className={MENU_ROW_ENTER}
                  style={menuRowDelay(index + 1)}
                >
                  <CtaLink
                    href={countryHref}
                    underline={false}
                    className={cn(
                      "flex min-h-11 flex-col justify-center py-2 text-navy/80 hover:text-navy dark:text-cream/80",
                      pathname === countryHref && "text-sky",
                    )}
                  >
                    <span className="text-body font-normal text-navy dark:text-cream">
                      {country.name}
                    </span>
                    {country.tagline && (
                      <span className="text-small text-navy/60 dark:text-cream/60 mt-0.5 font-light">
                        {country.tagline}
                      </span>
                    )}
                  </CtaLink>
                </li>
              );
            })}
          </ul>
        </div>
      ) : level === MENU_KEYS.DESTINATIONS ? (
        <div key={level} className="motion-safe:animate-menu-slide-in">
          <FrameButton ref={backRef} variant="menuBack" onClick={goBack}>
            <ChevronLeft className="size-4" aria-hidden="true" />
            Back
          </FrameButton>
          <h4 className="text-navy dark:text-cream mt-2">Destinations</h4>
          <ul className="mt-4 flex flex-col gap-1">
            <li className={MENU_ROW_ENTER} style={menuRowDelay(0)}>
              <CtaLink
                href={ALL_DESTINATIONS_LINK.href}
                underline={false}
                className={cn(
                  ROW_LINK,
                  pathname === ALL_DESTINATIONS_LINK.href && "text-sky",
                )}
              >
                {ALL_DESTINATIONS_LINK.label}
              </CtaLink>
            </li>
            {DESTINATION_REGIONS.map((region, index) => (
              <li
                key={region.key}
                className={MENU_ROW_ENTER}
                style={menuRowDelay(index + 1)}
              >
                <FrameButton
                  ref={(node) => {
                    rowRefs.current[`region:${region.key}`] = node;
                  }}
                  variant="menuRow"
                  onClick={() => drillInto(`region:${region.key}`)}
                >
                  {region.label}
                  <ChevronRight
                    className="text-navy/60 size-4 shrink-0"
                    aria-hidden="true"
                  />
                </FrameButton>
              </li>
            ))}
          </ul>
        </div>
      ) : submenu ? (
        <div key={level} className="motion-safe:animate-menu-slide-in">
          <FrameButton ref={backRef} variant="menuBack" onClick={goBack}>
            <ChevronLeft className="size-4" aria-hidden="true" />
            Back
          </FrameButton>
          <h4 className="text-navy dark:text-cream mt-2">{submenu.title}</h4>
          <ul className="mt-4 flex flex-col gap-1">
            {submenu.items
              .filter((item) => !topLevelHrefs.has(item.href))
              .map((item, index) => (
                <li
                  key={item.href}
                  className={MENU_ROW_ENTER}
                  style={menuRowDelay(index)}
                >
                  <CtaLink
                    href={item.href}
                    underline={false}
                    className={cn(
                      ROW_LINK,
                      pathname === item.href && "text-sky",
                    )}
                  >
                    {item.label}
                  </CtaLink>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <ul
          key="top"
          className={cn(
            "flex flex-col gap-1",
            returning && "motion-safe:animate-menu-slide-back",
          )}
        >
          {links.map((link, index) => (
            <li
              key={link.menu ?? link.href}
              className={cn(!returning && MENU_ROW_ENTER)}
              style={returning ? undefined : menuRowDelay(index)}
            >
              {link.menu ? (
                <FrameButton
                  ref={(node) => {
                    rowRefs.current[link.menu] = node;
                  }}
                  variant="menuRow"
                  onClick={() => drillInto(link.menu)}
                >
                  {link.label}
                  <ChevronRight
                    className="text-navy/60 size-4 shrink-0"
                    aria-hidden="true"
                  />
                </FrameButton>
              ) : (
                <CtaLink
                  href={link.href}
                  underline={false}
                  className={cn(ROW_LINK, pathname === link.href && "text-sky")}
                >
                  {link.label}
                </CtaLink>
              )}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
