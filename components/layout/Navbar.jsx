"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "Departures", href: "/departures" },
  { label: "Journal", href: "/journal" },
];

const CONCIERGE_LINK = { label: "Concierge", href: "/concierge" };

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isSolid = isScrolled || isMenuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isSolid
          ? "bg-cream/90 dark:bg-navy/90 shadow-sm backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          aria-label="Fortune Tours & Travels — Home"
          className="flex items-center transition-[filter] duration-300"
          style={isSolid ? { filter: "invert(1) brightness(0)" } : {}}
        >
          <Image
            src="/fortune_Logo_White (1).png"
            alt="Fortune Tours & Travels"
            width={140}
            height={48}
            className="object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "after:bg-sky relative text-small font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:transition-all after:duration-300 hover:after:w-full",
                  isSolid ? "text-navy/80 dark:text-cream/80" : "text-white/90",
                  isActive &&
                    (isSolid ? "text-navy dark:text-cream" : "text-white") +
                      " after:w-full",
                )}
              >
                {link.label}
              </Link>
            );
          })}

          <span
            className={cn(
              "h-4 w-px",
              isSolid ? "bg-navy/20 dark:bg-cream/20" : "bg-white/30",
            )}
            aria-hidden="true"
          />

          <Link
            href={CONCIERGE_LINK.href}
            className={cn(
              "text-small font-medium transition-colors",
              isSolid ? "text-navy dark:text-cream" : "text-white",
            )}
          >
            {CONCIERGE_LINK.label}
          </Link>
        </nav>

        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center rounded-full p-2 lg:hidden",
            isSolid ? "text-navy dark:text-cream" : "text-white",
          )}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </Container>

      {isMenuOpen && (
        <nav
          className="border-navy/10 bg-cream dark:border-cream/10 dark:bg-navy border-t px-4 py-6 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-4">
            {[...NAV_LINKS, CONCIERGE_LINK].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-navy/80 dark:text-cream/80 block text-body font-medium",
                    pathname === link.href && "text-sky",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
