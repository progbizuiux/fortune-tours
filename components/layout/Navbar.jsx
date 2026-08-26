"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/common/Container";
import { CtaLink } from "@/components/common/CtaLink";
import { FrameButton } from "@/components/common/FrameButton";
import { DestinationsMenu } from "@/components/layout/navbar/DestinationsMenu";
import { ExperiencesMenu } from "@/components/layout/navbar/ExperiencesMenu";
import { MobileMenu } from "@/components/layout/navbar/MobileMenu";
import { SiteMenu } from "@/components/layout/navbar/SiteMenu";
import { MENU_KEYS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

// `menu` names the dropdown a link opens on hover (desktop only). Links without
// one are plain, and hovering them closes whatever dropdown is open.
const NAV_LINKS = [
  {
    label: "Destinations",
    href: "/destinations",
    menu: MENU_KEYS.DESTINATIONS,
  },
  { label: "Experiences", href: "/experiences", menu: MENU_KEYS.EXPERIENCES },
  { label: "About", href: "/about-us" },
  { label: "Journal", href: "/journal" },
];

// The bar's last control is a menu button rather than a link: it opens the
// site-wide sheet on click. Below lg the same list is a "More" row in the
// drill-down, so it goes through MobileMenu as a menu entry with no href.
const SITE_MENU_ENTRY = { label: "More", menu: MENU_KEYS.SITE };

// The dropdown each menu key renders, and the id its trigger points at through
// aria-controls. One place to add a menu.
const MENU_PANELS = {
  [MENU_KEYS.DESTINATIONS]: {
    id: "navbar-menu-destinations",
    Component: DestinationsMenu,
  },
  [MENU_KEYS.EXPERIENCES]: {
    id: "navbar-menu-experiences",
    Component: ExperiencesMenu,
  },
  [MENU_KEYS.SITE]: {
    id: "navbar-menu-site",
    Component: SiteMenu,
  },
};

// Hover intent. A short delay before opening means sweeping the pointer along
// the bar to a further link never flashes a panel on the way past. The close
// delay is the grace period for the trip from a trigger down into its sheet:
// the two are 32px apart in the bar, and leaving the trigger starts the close,
// reaching the sheet cancels it. Anywhere else the pointer comes to rest —
// the logo, blank bar, the page — the sheet is gone after this.
const OPEN_DELAY_MS = 80;
const CLOSE_DELAY_MS = 200;

// Must match the header's `h-20` below.
const NAVBAR_HEIGHT = 80;

/* Bar triggers opt out of the shared LINK_UNDERLINE — no rule is drawn under
   them at any point. Hover swells the label a touch and brings it to full
   strength; scaling from the centre keeps the row's metrics fixed, so the
   labels beside it never shift. Colour and transform only, so it stays on the
   compositor and never triggers layout. */
const NAV_TRIGGER = "text-nav transition-colors duration-300 ease-out";

/* Only the page you are actually on marks itself, and it does so by weight
   rather than a rule. Hovering a trigger opens its panel, so anything keyed to
   the open state would read as a hover effect. */
const NAV_TRIGGER_MARKER = "font-medium";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const openTimer = useRef(null);
  const closeTimer = useRef(null);
  const headerRef = useRef(null);
  const triggerRefs = useRef({});
  const panelRef = useRef(null);
  const lastTap = useRef({ pointerType: null, wasOpen: false });

  const clearTimers = useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }, []);

  const showMenu = useCallback(
    (key) => {
      clearTimers();
      setOpenMenu(key);
    },
    [clearTimers],
  );

  const hideMenu = useCallback(() => {
    clearTimers();
    setOpenMenu(null);
  }, [clearTimers]);

  // Immediate when switching between two open menus — the intent is already
  // clear — and delayed only from the closed state.
  const scheduleShow = useCallback(
    (key) => {
      clearTimers();
      if (openMenu) {
        setOpenMenu(key);
        return;
      }
      openTimer.current = setTimeout(() => setOpenMenu(key), OPEN_DELAY_MS);
    },
    [clearTimers, openMenu],
  );

  // Also the sweep-past case: clearTimers drops an open that is still pending
  // when the pointer crosses a trigger on its way out of the bar.
  const scheduleHide = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY_MS);
  }, [clearTimers]);

  // Timers must not outlive the component.
  useEffect(() => clearTimers, [clearTimers]);

  // While a dropdown is open: Escape closes it, and a pointer pressed anywhere
  // outside the header closes it too (a sheet opened by keyboard focus has no
  // mouseleave to close it otherwise, and the pointer may never have entered
  // the bar).
  useEffect(() => {
    if (!openMenu) return;

    function handleKeyDown(event) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      // Hand focus back to the trigger only if it was inside the header to
      // begin with. A sheet opened by hover leaves focus wherever it was — a
      // search field, say — and yanking it into the bar on Escape would be a
      // real surprise. Focus first, then hide: the trigger opens its menu on
      // focus, so the other order would have the refocus reopen it (both
      // updates land in the same batch, so nothing flashes).
      if (headerRef.current?.contains(document.activeElement)) {
        triggerRefs.current[openMenu]?.focus();
      }
      hideMenu();
    }

    function handlePointerDown(event) {
      if (!headerRef.current?.contains(event.target)) hideMenu();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openMenu, hideMenu]);

  useEffect(() => {
    // Stay transparent over the hero and turn solid the moment the next
    // section's top edge slides under the bar. Resolved from the marked
    // element rather than a scroll offset so it tracks the real section
    // boundary instead of the hero's assumed height. Pages that don't mark
    // one fall back to turning solid as soon as the page moves.
    const trigger = document.querySelector("[data-navbar-solid-from]");

    function handleScroll() {
      setIsScrolled(
        trigger
          ? trigger.getBoundingClientRect().top <= NAVBAR_HEIGHT
          : window.scrollY > 20,
      );
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // The pathname effect above is not enough on its own: most menu links land on
  // /search?term=…, and going from one of those to another changes only the
  // query string, which usePathname does not see. So the menus also close the
  // moment one of their links is activated. Delegated from the menu roots
  // (see MegaMenuPanel / MobileMenu) rather than wired onto every link.
  const closeAll = useCallback(() => {
    hideMenu();
    setIsMenuOpen(false);
  }, [hideMenu]);

  // A dropdown is a white sheet hanging off the bar, so the bar must be solid
  // for as long as one is open — otherwise white nav text sits over the hero
  // video while a white panel hangs beneath it.
  const isSolid = isScrolled || isMenuOpen || openMenu !== null;

  const panel = openMenu ? MENU_PANELS[openMenu] : null;

  // Down-arrow on a trigger moves focus into its panel. Tab alone cannot get
  // there: the panel is after every nav link in the DOM, and focusing the next
  // link swaps or closes the dropdown before it is ever reached.
  function handleTriggerKeyDown(event, key) {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    showMenu(key);
    // The panel may only mount on this render — defer until it has.
    requestAnimationFrame(() => panelRef.current?.querySelector("a")?.focus());
  }

  // A touch on a trigger at lg+ (an iPad in landscape) has no hover to open the
  // sheet with — the tap would just follow the link. So the first tap opens the
  // sheet and a second tap on the same, now-open, trigger navigates. Mouse and
  // pen clicks navigate as before. `click` carries pointerType in current
  // browsers; older WebKit does not, so the preceding pointerdown's type (a
  // PointerEvent everywhere) is kept as the fallback.
  //
  // "Already open" is judged at pointerdown, not at click: on Android the tap
  // focuses the link first, and onFocus has already opened the sheet by the
  // time click fires — checking then would let the very first tap navigate.
  function handleTriggerPointerDown(event, key) {
    lastTap.current = {
      pointerType: event.pointerType,
      wasOpen: openMenu === key,
    };
  }

  function handleTriggerClick(event, key) {
    const { pointerType, wasOpen } = lastTap.current;
    const type = event.nativeEvent.pointerType ?? pointerType;
    if (type !== "touch" || wasOpen) return;
    event.preventDefault();
    showMenu(key);
  }

  // Focus leaving the header altogether (past the last panel link, or a click
  // elsewhere on the page) closes the dropdown. relatedTarget is null when focus
  // goes to the browser chrome or a non-focusable click target inside the
  // panel, and neither of those should close it.
  function handleHeaderBlur(event) {
    const next = event.relatedTarget;
    if (next && !event.currentTarget.contains(next)) hideMenu();
  }

  // Focus arriving on a trigger opens its sheet — but only focus that moved
  // there from somewhere in the document (Tab from the logo, Shift+Tab from
  // Experiences). relatedTarget is null when the window itself regains focus
  // and re-fires focus on whatever was active, which is how an Alt+Tab back to
  // the page, or a return from a navigation this link started (Chrome focuses
  // links on mousedown), would otherwise pop the sheet open with the pointer
  // nowhere near the bar.
  function handleTriggerFocus(event, key) {
    if (event.relatedTarget) showMenu(key);
  }

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isSolid ? "shadow-sm" : "bg-transparent",
        // Fully opaque while a dropdown is open: the sheet below is solid white,
        // and the usual frosted 90% bar over the hero video shows a grey seam
        // where the two meet.
        isSolid && (openMenu ? "bg-white" : "bg-white/90 backdrop-blur-md"),
      )}
      // Hover is tracked on the trigger and the sheet, not on the header: the
      // sheet stays only while the pointer is on one of those two. Resting on
      // the logo or the blank bar is "outside" and closes it after the grace
      // period, the same as leaving the header altogether.
      onBlur={openMenu ? handleHeaderBlur : undefined}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          aria-label="Fortune Tours & Travels — Home"
          // relative is load-bearing: the cut being faded out is absolutely
          // positioned, and without a positioned parent it anchors to the fixed
          // <header> instead of this box — so it leaves the logo's slot and
          // parks in the bar's top-left corner mid-fade.
          className="relative flex items-center"
        >
          {/* Two cuts of one mark, cross-faded. Both files are 192x70, so the
              pair sits pixel for pixel on top of each other through the fade.

              width/height carry the file's intrinsic size, not the display
              size — that is what Next reserves space from, and giving it the
              exact numbers means the ratio hint needs no rounding. The 140px
              the bar actually shows is set in CSS below. */}
          {/* White — visible on the transparent navbar (over the hero) */}
          <Image
            src="/fortune_Logo_White.png"
            alt="Fortune Tours & Travels"
            width={192}
            height={70}
            className={cn(
              // Both axes sized in CSS on purpose. Tailwind's preflight sets
              // `height: auto` on every img, which left height CSS-driven and
              // width attribute-driven — Next flags that mismatch in dev and
              // can no longer guarantee the aspect ratio. Pairing w-[140px]
              // with h-auto puts both under CSS and silences it; the width and
              // height props stay as the ratio hint that reserves the space.
              "h-auto w-[140px] object-contain transition-opacity duration-300",
              isSolid ? "absolute opacity-0" : "opacity-100",
            )}
            priority
          />
          {/* Black — visible once the navbar turns solid.
              Do not point this back at fortune_Logo_Black&Blue.png: the `&` in
              that filename makes the request to the image optimiser hang in the
              browser and never resolve, so the mark silently never paints. */}
          <Image
            src="/fortune_Logo_Black.png"
            alt="Fortune Tours & Travels"
            width={192}
            height={70}
            className={cn(
              // Both axes sized in CSS on purpose. Tailwind's preflight sets
              // `height: auto` on every img, which left height CSS-driven and
              // width attribute-driven — Next flags that mismatch in dev and
              // can no longer guarantee the aspect ratio. Pairing w-[140px]
              // with h-auto puts both under CSS and silences it; the width and
              // height props stay as the ratio hint that reserves the space.
              "h-auto w-[140px] object-contain transition-opacity duration-300",
              isSolid ? "opacity-100" : "absolute opacity-0",
            )}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const isOpen = Boolean(link.menu) && openMenu === link.menu;
            // Underline only — the filled block is reserved for the menu
            // button below, so it reads as the one solid control in the bar.
            // The open dropdown pins its trigger's underline the same way the
            // current page does, so the bar shows which panel is showing.
            return (
              <CtaLink
                key={link.href}
                href={link.href}
                ref={
                  link.menu
                    ? (node) => {
                        triggerRefs.current[link.menu] = node;
                      }
                    : undefined
                }
                aria-current={isActive ? "page" : undefined}
                // aria-expanded + aria-controls, no aria-haspopup: "true"
                // means a role=menu with arrow-key traversal, and the sheet
                // is a region of plain links — a disclosure, not a menu.
                aria-expanded={link.menu ? isOpen : undefined}
                aria-controls={
                  link.menu ? MENU_PANELS[link.menu].id : undefined
                }
                onMouseEnter={
                  link.menu ? () => scheduleShow(link.menu) : hideMenu
                }
                // Leaving a trigger starts the close — and drops a pending
                // open, which is the sweep-past case. Entering its sheet
                // within the grace period cancels it (MegaMenuPanel below).
                onMouseLeave={link.menu ? scheduleHide : undefined}
                onFocus={
                  link.menu
                    ? (event) => handleTriggerFocus(event, link.menu)
                    : hideMenu
                }
                onPointerDown={
                  link.menu
                    ? (event) => handleTriggerPointerDown(event, link.menu)
                    : undefined
                }
                onClick={
                  link.menu
                    ? (event) => handleTriggerClick(event, link.menu)
                    : undefined
                }
                onKeyDown={
                  link.menu
                    ? (event) => handleTriggerKeyDown(event, link.menu)
                    : undefined
                }
                underline={false}
                className={cn(
                  NAV_TRIGGER,
                  isSolid
                    ? "text-navy/80 hover:text-navy dark:text-cream/80 dark:hover:text-cream"
                    : "text-white/90 hover:text-white",
                  isActive && NAV_TRIGGER_MARKER,
                  (isActive || isOpen) && [
                    isSolid ? "text-navy" : "text-white",
                  ],
                )}
              >
                {link.label}
              </CtaLink>
            );
          })}

          {/* Click to toggle, unlike the hover links: a button has no
              destination to fall through to, so a click is the whole gesture.
              Hovering it does nothing; hovering a link beside it switches or
              closes as usual, and leaving the bar closes it like the rest. */}
          <FrameButton
            variant="menu"
            ref={(node) => {
              triggerRefs.current[MENU_KEYS.SITE] = node;
            }}
            active={openMenu === MENU_KEYS.SITE}
            // Brand colours, following the bar: over the hero it is the same
            // white rule the hero's own buttons wear and fills white on
            // hover; on the solid bar it is a navy block. Open = navy block in
            // either case (the bar is solid then anyway).
            className={cn(
              isSolid || openMenu === MENU_KEYS.SITE
                ? "border-navy bg-navy text-white hover:bg-navy/90"
                : "border-white/40 text-white hover:bg-white hover:text-navy",
            )}
            aria-label="Site menu"
            aria-expanded={openMenu === MENU_KEYS.SITE}
            aria-controls={MENU_PANELS[MENU_KEYS.SITE].id}
            onClick={() =>
              openMenu === MENU_KEYS.SITE
                ? hideMenu()
                : showMenu(MENU_KEYS.SITE)
            }
            onMouseEnter={clearTimers}
            onMouseLeave={scheduleHide}
            onKeyDown={(event) => handleTriggerKeyDown(event, MENU_KEYS.SITE)}
          >
            <Menu className="size-5" aria-hidden="true" />
          </FrameButton>
        </nav>

        <FrameButton
          variant="bare"
          className={cn("lg:hidden", isSolid ? "text-navy" : "text-white")}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </FrameButton>
      </Container>

      {/* Desktop dropdown. Mounted only while open so its pictures are not
          fetched on every page load and its links stay out of the tab order
          when closed. Keyed by menu so switching Destinations → Experiences
          remounts and replays the entrance rather than morphing one sheet
          into the other. */}
      {panel && (
        <panel.Component
          key={openMenu}
          ref={panelRef}
          id={panel.id}
          onNavigate={closeAll}
          onMouseEnter={clearTimers}
          onMouseLeave={scheduleHide}
        />
      )}

      {/* Below lg this is the only navigation, tablets included. Mounted while
          open, so its drill-down level resets to the top each time it closes. */}
      {isMenuOpen && (
        <MobileMenu
          links={[...NAV_LINKS, SITE_MENU_ENTRY]}
          pathname={pathname}
          onNavigate={closeAll}
        />
      )}
    </header>
  );
}
