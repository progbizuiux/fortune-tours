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
          className="flex items-center"
        >
          {/* White logo — visible on transparent navbar (over hero) */}
          <Image
            src="/fortune_Logo_White.png"
            alt="Fortune Tours & Travels"
            width={140}
            height={48}
            className={cn(
              "object-contain transition-opacity duration-300",
              isSolid ? "opacity-0 absolute" : "opacity-100",
            )}
            priority
          />
          {/* Black & Blue logo — visible when navbar is solid/scrolled */}
          <Image
            src="/fortune_Logo_Black&Blue.png"
            alt="Fortune Tours & Travels"
            width={140}
            height={48}
            className={cn(
              "object-contain transition-opacity duration-300",
              isSolid ? "opacity-100" : "opacity-0 absolute",
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
              "text-nav",
              isSolid ? "text-navy dark:text-cream" : "text-white",
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
          className="border-navy/10 bg-white border-t px-4 py-6 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-4">
            {[...NAV_LINKS, CONCIERGE_LINK].map((link) => (
              <li key={link.href}>
                <CtaLink
                  href={link.href}
                  underline={false}
                  className={cn(
                    "text-navy/80 dark:text-cream/80 block text-body",
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
