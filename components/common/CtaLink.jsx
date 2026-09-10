"use client";

import { getLenis } from "@/lib/lenis";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FILL_SWEEP, FILL_SWEEP_INSET, LINK_UNDERLINE } from "@/lib/motion";

// The shared link primitive — every text link in the app renders through this.
//
// Deliberately carries no colour of its own: the navbar, footer and hero each
// sit on different backgrounds, so the caller passes text/hover colours through
// `className`. Only the layout-neutral bits (transition, underline animation,
// optional dividers) live here, which is what lets one component serve all of
// them without a variant explosion.
//
// Dividers are opt-in. Only the hero row and the featured-destinations CTA draw
// them, so defaulting them on would put a stray bar after every link in the app.
// `fill` and `underline` are alternatives, not additions: a 2px bar under a
// solid panel reads as a rendering bug. Passing `fill` wins and the underline
// is skipped.
export function CtaLink({

  href,
  children,
  className,
  underline = true,
  fill = false,
  withLeftDivider = false,
  withRightDivider = false,
  dividerClassName = "h-6 w-px bg-white/40",
  onClick,
  ...props
}) {
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (typeof href === "string" && href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(target);
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };
  /* next/link throws on a missing href rather than degrading — a 500 for the
     whole page on the server, and an aborted export at build time. Copy comes
     out of the CMS, where a filled label beside an empty link field is an
     everyday state, so the label renders as plain text instead. See cta() in
     lib/strapi/normalise.js, which drops such a pair before it gets here;
     this is the floor under every other call site. */
  if (!href) {
    return <span className={className}>{children}</span>;
  }

  return (
    <>
      {withLeftDivider && (
        <span className={dividerClassName} aria-hidden="true" />
      )}
      <Link
        href={href}
        onClick={handleClick}
        className={cn(
          "transition-colors",
          fill && [FILL_SWEEP, FILL_SWEEP_INSET],
          !fill && underline && LINK_UNDERLINE,
          className,
        )}
        {...props}
      >
        {children}
      </Link>
      {withRightDivider && (
        <span className={dividerClassName} aria-hidden="true" />
      )}
    </>
  );
}
