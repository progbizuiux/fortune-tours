"use client";

import { useReveal } from "@/lib/gsap/useReveal";

/* Client leaf for scroll-in reveals in server components.

   Sections stay server components (async/CMS-fetchable) and pass their
   server-rendered markup through as children — this wrapper is the only
   client code involved and it never re-renders its children. Renders the
   `as` element (default div) with the given className untouched.

   All animation behavior and its style-safety guarantees (transform+opacity
   only, clearProps self-clean, y=0 fade-only mode, reduced-motion no-op,
   self-destroying triggers) live in lib/gsap/useReveal.js — client components
   should use that hook directly instead of this wrapper. */
export function AnimateIn({
  as: Tag = "div",
  className,
  children,
  y,
  duration,
  delay,
  stagger,
  start,
  targets,
}) {
  const ref = useReveal({ y, duration, delay, stagger, start, targets });

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
