"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/* Scroll-in reveal hook (GSAP + ScrollTrigger). Attach the returned ref to
   the element you want revealed:

     const ref = useReveal();                       // whole block rises in
     const ref = useReveal({ stagger: 0.12 });      // direct children cascade
     const ref = useReveal({ targets: ".card" });   // specific descendants

   Guarantees that keep it away from your styling:
   - Animates transform + opacity only, and strips both inline props from
     every target the moment its tween completes (clearProps) — after the
     entrance, elements are exactly as if they were never animated.
   - Pass y: 0 to fade only. Required for elements styled through the CSS
     translate/rotate/scale properties: while GSAP owns transform it pins
     those properties inline, overriding stylesheet effects on them.
   - prefers-reduced-motion → no animation at all. Server HTML is never
     hidden, so no-JS visitors and crawlers always see the content.
   - once: true → each trigger destroys itself after firing; nothing
     accumulates as sections are added. */
export function useReveal({
  y = 28,
  duration = 0.9,
  delay = 0,
  stagger = 0,
  start = "top 85%",
  targets,
} = {}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const nodes = targets
          ? el.querySelectorAll(targets)
          : stagger
            ? el.children
            : el;
        const vars = {
          opacity: 0,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: el, start, once: true },
        };
        if (y) vars.y = y;
        gsap.from(nodes, vars);
      });
    },
    { scope: ref },
  );

  return ref;
}
