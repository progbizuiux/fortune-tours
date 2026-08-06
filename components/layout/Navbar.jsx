"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Plane } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Destinations", href: "/destinations" },
  { label: "Tours", href: "/tours" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

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
        isSolid && "bg-cream/90 dark:bg-navy/90 shadow-sm backdrop-blur-md",
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="font-heading text-navy dark:text-cream flex items-center gap-2 text-xl"
        >
          <Plane className="text-sky size-6" aria-hidden="true" />
          Fortune Travels
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
                  "after:bg-sky text-navy/80 dark:text-cream/80 relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:transition-all after:duration-300 hover:after:w-full",
                  isActive && "text-navy dark:text-cream after:w-full",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button size="sm">Book Now</Button>
        </div>

        <button
          type="button"
          className="text-navy dark:text-cream inline-flex items-center justify-center rounded-full p-2 lg:hidden"
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
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-navy/80 dark:text-cream/80 block text-base font-medium",
                    pathname === link.href && "text-sky",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button fullWidth className="mt-6">
            Book Now
          </Button>
        </nav>
      )}
    </header>
  );
}
