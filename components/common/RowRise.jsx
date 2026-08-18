"use client";

import { useRowRise } from "@/lib/useRowRise";

/* Client leaf for the scroll-scrubbed card row entrance in server components.

   Sections stay server components (async/CMS-fetchable) and pass their
   server-rendered markup through as children — this wrapper is the only client
   code involved and it never re-renders its children. Renders the `as` element
   (default div) with the given className untouched, and treats its children as
   the cards:

     <RowRise as="ul" className="grid grid-cols-4 gap-1.5">
       {items.map((item) => <li key={item.key}>…</li>)}
     </RowRise>

   All animation behavior, its options and its style-safety guarantees live in
   lib/useRowRise.js — client components should use that hook directly instead
   of this wrapper, especially when the row already needs a ref of its own. */
export function RowRise({
  as: Tag = "div",
  className,
  children,
  targets,
  start,
  end,
  leadVh,
  trailVh,
  scale,
  fade,
  columns,
  staggerFrom,
  stagger,
}) {
  const ref = useRowRise({
    targets,
    start,
    end,
    leadVh,
    trailVh,
    scale,
    fade,
    columns,
    staggerFrom,
    stagger,
  });

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
