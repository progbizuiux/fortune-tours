"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/common/Container";
import { CtaLink } from "@/components/common/CtaLink";
import { FrameButton } from "@/components/common/FrameButton";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "Departures", href: "/departures" },
  { label: "Journal", href: "/journal" },
];

const CONCIERGE_LINK = { label: "Concierge", href: "/concierge" };

// Must match the header's `h-20` below.
const NAVBAR_HEIGHT = 80;

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
  }, [pathname]);

  const isSolid = isScrolled || isMenuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isSolid ? "bg-white/90 shadow-sm backdrop-blur-md" : "bg-transparent",
      )}
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
            // Underline only — the sky fill is reserved for Concierge below,
            // so it reads as the one primary action in the bar.
            return (
              <CtaLink
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "text-nav",
                  isSolid ? "text-navy/80 dark:text-cream/80" : "text-white/90",
                  isActive &&
                    (isSolid ? "text-navy" : "text-white") + " after:w-full",
                )}
              >
                {link.label}
              </CtaLink>
            );
          })}

          <CtaLink
            href={CONCIERGE_LINK.href}
            fill
            className={cn(
              "text-nav border-r pr-6",
              isSolid
                ? "text-navy dark:text-cream border-navy/20 dark:border-cream/20"
                : "text-white border-white/40"
            )}
          >
            {CONCIERGE_LINK.label}
          </CtaLink>
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

      {isMenuOpen && (
        <nav
          // md:px-8 tracks Container's own padding — at 768-1023 the panel's
          // links sat 16px from the edge while the logo and menu button above
          // them sat 32px in.
          className="border-navy/10 bg-white border-t px-4 py-6 md:px-8 lg:hidden"
          aria-label="Mobile"
        >
          {/* gap-1 rather than gap-4: each link now carries its own 44px touch
              height (this is the only navigation below lg, tablets included),
              so the row rhythm comes from the links instead of the gap. */}
          <ul className="flex flex-col gap-1">
            {[...NAV_LINKS, CONCIERGE_LINK].map((link) => (
              <li key={link.href}>
                <CtaLink
                  href={link.href}
                  underline={false}
                  className={cn(
                    "text-navy/80 dark:text-cream/80 text-body flex min-h-11 items-center",
                    pathname === link.href && "text-sky",
                  )}
                >
                  {link.label}
                </CtaLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
