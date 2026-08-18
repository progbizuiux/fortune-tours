"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/* Scroll-in reveal hook (GSAP + ScrollTrigger). Attach the returned ref to
   the element you want revealed:

     const ref = useReveal();                       // whole block rises in
     const ref = useReveal({ stagger: 0.12 });      // direct children cascade
     const ref = useReveal({ targets: ".card" });   // specific descendants

   The motion is the card cascade's, to the number — 30px up over 1s on
   power2.out, from "top 88%", which is exactly what lib/gsap/useCardCascade.js
   gives a card's type. A page runs both: the cascade on its picture rows and
   this on everything else, and two rises that are nearly the same read worse
   than either would alone, because the eye catches the mismatch without being
   able to name it. Matching them outright is what makes a page feel like one
   treatment rather than several.

   power3.out is what this used to run on, and it is the wrong curve for a
   short travel: it dumps most of the distance in the first third and then
   crawls, so 30px arrives as a flick followed by a wait. power2 spends the
   distance more evenly.

   The scale and blur that briefly lived here are gone from the defaults. Both
   are still reachable — see below — but neither is in the cascade, and a
   reveal that grew and defocused while the cascade beside it only rose was the
   mismatch this hook is meant to avoid.

   Guarantees that keep it away from your styling:
   - Animates transform, scale, filter and opacity, and strips all of them from
     every target the moment its tween completes (clearProps) — after the
     entrance, elements are exactly as if they were never animated. That list
     includes `translate`, `rotate` and `scale`: GSAP pins those three CSS
     properties to `none` whenever it touches a transform, and clearing only
     `transform` left them behind. In Tailwind v4 `scale-*` and `translate-*`
     compile to those very properties, so an inline `scale: none` outranked
     every `group-hover:scale-*` on the page — hover zooms on revealed cards
     were dead, quietly, and had been.
   - Set from a `set` and tweened to explicit resting values rather than
     `gsap.from`, whose immediateRender fights a playhead ScrollTrigger has not
     released yet — the cascade arrived already finished that way. It also
     means the optional blur has a real number to end on rather than having to
     interpolate back to the element's own `filter`, which is `none`.
   - scale and blur are off by default and stay available: pass scale: 0.985
     for a little growth, or blur: 4 to have the block pull into focus. Treat
     blur as expensive — it re-rasterises every frame, so keep it off anything
     full-bleed. y: 0 gives a plain fade.
   - prefers-reduced-motion → no animation at all. Server HTML is never
     hidden, so no-JS visitors and crawlers always see the content.
   - once: true → each trigger destroys itself after firing; nothing
     accumulates as sections are added. */
export function useReveal({
  // How far the block travels, in px. 0 to hold still.
  y = 30,
  // What it grows from. 1 to hold its size — the cascade does not scale.
  scale = 1,
  // What it focuses out of, in px. 0 to arrive sharp, as the cascade does.
  blur = 0,
  duration = 1,
  delay = 0,
  stagger = 0,
  ease = "power2.out",
  start = "top 88%",
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

        // Both ends spelled out, so nothing has to be inferred from whatever
        // the element happens to compute to.
        const from = { opacity: 0 };
        const to = {
          opacity: 1,
          duration,
          delay,
          stagger,
          ease,
          clearProps: "transform,translate,rotate,scale,filter,opacity",
          scrollTrigger: { trigger: el, start, once: true },
        };

        if (y) {
          from.y = y;
          to.y = 0;
        }
        if (scale !== 1) {
          from.scale = scale;
          to.scale = 1;
        }
        if (blur) {
          from.filter = `blur(${blur}px)`;
          to.filter = "blur(0px)";
        }

        gsap.set(nodes, from);
        gsap.to(nodes, to);
      });
    },
    { scope: ref },
  );

  return ref;
}
