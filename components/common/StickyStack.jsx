"use client";

import { useStickyStack } from "@/lib/useStickyStack";

/* Client leaf for the sticky-stack scroll effect in server components.

   Sections stay server components (async/CMS-fetchable) and pass their
   server-rendered markup through as children — this wrapper is the only client
   code involved and it never re-renders its children. Renders the `as` element
   (default div) with the given className untouched, and treats its children as
   the blocks that stack:

     <StickyStack as="section" ariaLabel="…" className="flex flex-col gap-16">
       {items.map((item) => <div key={item.key}>…</div>)}
     </StickyStack>

   `enabled={false}` renders exactly the same element with no effect attached,
   so a shared section can offer the stack as an opt-in prop without branching
   its markup.

   All behaviour, its options and the reason it is JS at all live in
   lib/useStickyStack.js — client components should use that hook directly
   instead of this wrapper, especially when the column already needs a ref of
   its own. */
export function StickyStack({
  as: Tag = "div",
  enabled = true,
  headroom,
  capBelow,
  className,
  ariaLabel,
  children,
}) {
  const ref = useStickyStack({ enabled, headroom, capBelow });

  return (
    <Tag ref={ref} aria-label={ariaLabel} className={className}>
      {children}
    </Tag>
  );
}
