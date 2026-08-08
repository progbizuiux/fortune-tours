"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/* Scroll-in reveal for section content (GSAP + ScrollTrigger).

   Renders `as` (default div) with the given className untouched, then slides
   and fades it up the first time it scrolls into view. With `stagger`, the
   wrapper's direct children animate in sequence instead of the wrapper as
   one block.

   Performance/safety notes:
   - Animates transform + opacity only (compositor-friendly, no layout work).
   - `once: true` — each trigger kills itself after firing, leaving no scroll
     listeners behind.
   - prefers-reduced-motion users get no motion at all; because the markup is
     never hidden server-side, no-JS visitors and crawlers always see content. */
export function Reveal({
  as: Tag = "div",
  y = 28,
  duration = 0.9,
  delay = 0,
  stagger = 0,
  start = "top 85%",
  className,
  children,
  ...rest
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const vars = {
          opacity: 0,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          // Self-cleaning: once a target finishes animating, its inline
          // styles are removed entirely, leaving the element exactly as if
          // it had never been animated (stylesheets stay in full control).
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ref.current,
            start,
            once: true,
          },
        };
        // Only take over transform when a lift is requested. When GSAP
        // animates y it bakes the element's CSS translate/rotate/scale into
        // its own transform and pins those properties to "none" inline —
        // permanently overriding stylesheet effects on them (e.g. the
        // polaroid hover). Pass y={0} for such elements to fade only.
        if (y) vars.y = y;
        gsap.from(stagger ? ref.current.children : ref.current, vars);
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
