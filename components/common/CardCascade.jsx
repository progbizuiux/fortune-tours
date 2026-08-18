"use client";

import { useCardCascade } from "@/lib/gsap/useCardCascade";

/* Client leaf for the card cascade in server components.

   Sections stay server components (async/CMS-fetchable) and pass their
   server-rendered markup through as children — this wrapper is the only client
   code involved and it never re-renders its children. Renders the `as` element
   with the given className untouched, and is the element the scroll trigger
   measures, so put it on the section rather than the track:

     <CardCascade as="section" ariaLabel="…" className="…">
       …
       <li data-cascade-card>
         <div data-cascade-picture>…</div>
         <h3><CascadeText part="title">{title}</CascadeText></h3>
         <p><CascadeText part="subtitle">{meta}</CascadeText></p>
       </li>
     </CardCascade>

   Three things a card has to mark, and it may mark any subset — a card with no
   subtitle simply animates the other two:

     data-cascade-card       the card, so the stagger knows what to count
     data-cascade-picture    the picture box, which slides in from the left
     data-cascade-title      a line of type that rises — use <CascadeText>,
     data-cascade-subtitle   in components/common/CascadeText.jsx

   `enabled={false}` renders exactly the same element with no effect attached,
   so a shared section can offer the cascade as an opt-in prop without branching
   its markup.

   A section that is already a client component with a ref of its own should
   call lib/gsap/useCardCascade.js directly instead of wrapping itself in this — that
   is what components/common/PackageCarouselSection.jsx does, since it already
   holds a ref for its scroll arrows. All behaviour, its options and the timing
   live in that hook. */
export function CardCascade({
  as: Tag = "div",
  enabled = true,
  cards,
  stagger,
  start,
  className,
  ariaLabel,
  children,
}) {
  const ref = useCardCascade({ enabled, cards, stagger, start });

  return (
    <Tag ref={ref} aria-label={ariaLabel} className={className}>
      {children}
    </Tag>
  );
}
