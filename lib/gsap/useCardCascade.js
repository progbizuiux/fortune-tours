"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/* Scroll-in cascade for a row of picture cards, taken from vita-travel.webflow.io's
   statistics section. Attach the returned ref to the section; the cards and the
   three things that move inside each one are marked in the markup:

     <section ref={useCardCascade()}>
       <li data-cascade-card>
         <div data-cascade-picture>…</div>
         <span data-cascade-title>…</span>
         <span data-cascade-subtitle>…</span>

   The shape is the reference's, read straight off its ScrollTrigger onEnter
   rather than guessed at — one timeline, three tweens per card, fired once at
   `top 88%`:

     title       opacity 0→1, y 30→0    at  stagger * index
     subtitle    opacity 0→1, y 30→0    at  stagger * index + 0.12
     picture     opacity 0→1, x -40→0   at  stagger * index + 0.18

   So each card leads with its heading, the second line chases it just behind,
   the picture slides in from the left last, and the next card starts before the
   one before it has finished — the row arrives as one diagonal rather than
   three separate entrances.

   The timing is the one place this departs from the reference, which runs
   0.6/0.6/0.8s on power3.out at a 0.30 stagger. That is brisk on a small
   travel: 30px under a hard-decelerating curve is mostly over before the eye
   follows it. Ours runs longer on power2.out, a gentler curve that
   spends the distance evenly instead of snapping and then crawling — which is
   what makes a short move read as smooth rather than merely slow. The wider
   stagger against the longer durations also leaves the cards overlapping more,
   so the row reads as one wave rather than three bursts.

   The title and subtitle rise out from behind a mask: the reference wraps its
   pair in an `overflow: hidden` head, which is what turns a 30px nudge into
   type coming up off its own baseline. That mask belongs to the markup, not
   here — see the call site.

   Deliberately not carried over: the reference also grows a hairline rule and
   the vertical dividers between its cards, and flickers its section heading in
   per character with SplitText. Those animate furniture our section does not
   have, and the heading is not this section's to touch.

   Standard guarantees, the same ones lib/gsap/useReveal.js gives: transform and
   opacity only, both stripped with clearProps the moment each tween lands so
   the picture's own hover has its transform back, prefers-reduced-motion is a
   no-op, and the server HTML is never hidden — no-JS visitors and crawlers get
   the cards as they are. */
export function useCardCascade({
  // Section element, if it already carries a ref for other reasons. Omit and
  // the hook makes its own; either way the ref it used comes back to you.
  ref: externalRef,
  // The cards, resolved inside the section.
  cards = "[data-cascade-card]",
  // Seconds between one card starting and the next. Kept under the tween
  // durations below so the cards overlap into a single wave.
  stagger = 0.4,
  // Where the section has to reach before the row goes.
  start = "top 88%",
  // Read once, on mount. Lets a shared section take the cascade as an opt-in
  // prop without calling the hook conditionally.
  enabled = true,
} = {}) {
  const internalRef = useRef(null);
  const ref = externalRef ?? internalRef;

  useGSAP(
    () => {
      if (!enabled) return;
      const root = ref.current;
      if (!root) return;

      const items = gsap.utils.toArray(root.querySelectorAll(cards));
      if (!items.length) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const parts = items.map((item) => ({
          title: item.querySelector("[data-cascade-title]"),
          subtitle: item.querySelector("[data-cascade-subtitle]"),
          picture: item.querySelector("[data-cascade-picture]"),
        }));

        // Park everything at its start, then tween to the resting value — which
        // is how the reference builds it, and it is not a stylistic choice.
        // The same thing written as `from()` tweens placed along the timeline
        // looks equivalent and is not: each one renders itself immediately on
        // creation, that fights a playhead the ScrollTrigger has not released
        // yet, and the row ends up already finished and cleared at the top of
        // the page — visible, with the entrance silently spent. A plain `set`
        // leaves nothing to resolve, so the timeline holds until it is played.
        const risers = parts
          .flatMap((part) => [part.title, part.subtitle])
          .filter(Boolean);
        const pictures = parts.map((part) => part.picture).filter(Boolean);
        gsap.set(risers, { y: 30, opacity: 0 });
        gsap.set(pictures, { x: -40, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start, once: true },
        });

        // Placed by absolute time rather than sequenced: that is what lets a
        // card start while the one before it is still going, which a plain
        // stagger cannot express once the three parts have their own offsets
        // and durations. clearProps hands the transform back at the end, so the
        // picture's own hover is not left fighting an inline style.
        const land = { ease: "power2.out", clearProps: "transform,opacity" };

        parts.forEach(({ title, subtitle, picture }, index) => {
          const at = index * stagger;
          if (title)
            tl.to(title, { y: 0, opacity: 1, duration: 1, ...land }, at);
          if (subtitle)
            tl.to(
              subtitle,
              { y: 0, opacity: 1, duration: 1, ...land },
              at + 0.12,
            );
          if (picture)
            tl.to(
              picture,
              { x: 0, opacity: 1, duration: 1, ...land },
              at + 0.18,
            );
        });
      });
    },
    { scope: ref },
  );

  return ref;
}
