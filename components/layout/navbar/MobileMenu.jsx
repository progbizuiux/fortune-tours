"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CtaLink } from "@/components/common/CtaLink";
import { FrameButton } from "@/components/common/FrameButton";
import {
  ALL_DESTINATIONS_LINK,
  DESTINATION_REGIONS,
  EXPERIENCE_MENU,
  MENU_KEYS,
  SITE_MENU,
} from "@/lib/navigation";
import { MENU_ROW_ENTER, menuRowDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* The navigation below lg — a drill-down.
 *
 * Level one is the main links. A link that has a dropdown on desktop is a row
 * with a chevron here instead; tapping it slides in level two: "Back", the
 * section's name, and its items as plain links. Going back slides level one
 * in again from the other side. Two levels only, matching the reference flow:
 * a region is a link at this size, not another list.
 *
 * Content is the same lib/navigation.js data the desktop sheets use, reduced
 * to labels and hrefs. */

const SUBMENUS = {
  [MENU_KEYS.DESTINATIONS]: {
    title: "Destinations",
    // A to Z leads here rather than closing the list as it does on desktop:
    // on a phone the shortcut to everything belongs above the long list.
    items: [
      ALL_DESTINATIONS_LINK,
      ...DESTINATION_REGIONS.map(({ label, href }) => ({ label, href })),
    ],
  },
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

export function MobileMenu({ links, pathname, onNavigate }) {
  const [level, setLevel] = useState(null);
  // Only a return from level two slides level one in — the first open of the
  // menu animates as a whole (the panel's own entrance below).
  const [returning, setReturning] = useState(false);

  const backRef = useRef(null);
  const rowRefs = useRef({});
  // The row that opened the current sub-list, so Back can hand focus back to
  // it: both level changes unmount the focused control, and without this a
  // keyboard or screen-reader user is dropped on <body>.
  const openedFrom = useRef(null);

  const submenu = level ? SUBMENUS[level] : null;
  const topLevelHrefs = new Set(links.map((link) => link.href));

  useEffect(() => {
    if (level) backRef.current?.focus();
    else if (openedFrom.current) rowRefs.current[openedFrom.current]?.focus();
  }, [level]);

  function drillInto(key) {
    openedFrom.current = key;
    setLevel(key);
  }

  function goBack() {
    setLevel(null);
    setReturning(true);
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
      {submenu ? (
        <div key={level} className="motion-safe:animate-menu-slide-in">
          <FrameButton ref={backRef} variant="menuBack" onClick={goBack}>
            <ChevronLeft className="size-4" aria-hidden="true" />
            Back
          </FrameButton>
          <h4 className="text-navy dark:text-cream mt-2">{submenu.title}</h4>
          {/* gap-1 rather than gap-4: each link carries its own 44px touch
              height, so the row rhythm comes from the links instead of the
              gap. */}
          <ul className="mt-4 flex flex-col gap-1">
            {submenu.items
              .filter((item) => !topLevelHrefs.has(item.href))
              .map((item, index) => (
                // The sub-list slides in as a block and its rows rise in
                // behind it — the same cascade as the top level and the
                // desktop sheets.
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
              // Staggered only on the first open; on the way back from a
              // sub-list the whole list slides as one.
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
