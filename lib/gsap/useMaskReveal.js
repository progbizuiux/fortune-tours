"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/* Masked image reveal, taken from the D Luxury Collection Webflow site. Attach
   the returned ref to the section; the frame and the three things that move
   inside it are marked in the markup, which components/common/MaskReveal.jsx
   writes for you:

     <section ref={useMaskReveal()}>
       <MaskFrame>                              data-mask-frame   the window
         <MaskImage><Image fill /></MaskImage>   data-mask-image
         <MaskScrim />                           data-mask-scrim
       </MaskFrame>
       <MaskLine as="h1">…</MaskLine>            data-mask-line

   Four things move against one timeline, and the split between the first two
   is the whole effect:

     frame   clip-path inset(100% 0 0 0) → inset(0 0 0 0)   at 0
     image   y 18% → 0, scale 1.2 → 1                       at 0
     scrim   opacity 1 → 0, over 60% of the duration        at 0
     lines   y 110% → 0, opacity 0 → 1, staggered           at textStart

   The frame's bottom edge is pinned and its top edge climbs, so the window
   grows upward out of nothing. The image inside travels the same span of time
   on the same curve but covers a fraction of the distance — the mask edge
   crosses the frame's whole height while the image moves 18% of its own. That
   difference is parallax: the picture appears to drift up *through* a window
   opening around it, rather than sitting still while a curtain lifts off it.
   Give them the same distance and the effect collapses into a wipe.

   Same duration and same ease for both is not a shortcut — it is what makes two
   independently moving layers read as one object. Stagger them and the eye
   catches the frame arriving before its contents.

   power4.out, where the rest of this codebase reaches for power2.out. The
   argument in lib/gsap/useReveal.js — that a hard-decelerating curve dumps its
   distance early and then crawls, so a 30px nudge lands as a flick followed by
   a wait — is about a short travel, and it inverts here. This travel is a whole
   viewport: spend it evenly and it reads as a mechanical wipe at constant
   speed. The deceleration is the cinematic part, and there is enough distance
   for the tail to still be visibly moving rather than merely late. expo.out was
   the other candidate and is too much — it finishes so early that the mask edge
   looks frozen while the image is still settling, which is exactly the illusion
   the matched timing above exists to protect. The type keeps power2.out,
   because the type *is* a short travel.

   The start state is not here. It lives inline on the markup, in
   components/common/MaskReveal.jsx, so it ships in the server HTML — which is
   the point. Set from a layout effect like every other hook in this folder, the
   image would paint unclipped for however long hydration takes and then snap
   shut before opening, and "a sliver of the picture flashes before the reveal"
   is the one failure this animation cannot survive. It also means the distances
   are deliberately not options: a `y` prop here could silently disagree with
   the translateY baked into the markup, and the pair has to be one value.

   Two consequences of the start state living in the markup, both handled below:
   - prefers-reduced-motion cannot be the no-op it is elsewhere in this folder.
     Doing nothing would leave the hero clipped to nothing, permanently. It
     clears the inline start state instead, so the section arrives finished.
   - JavaScript that never runs would do the same. MaskRevealNoScript renders
     the matching reset, and the call sites include it.

   Otherwise the usual guarantees hold: clip-path, transform and opacity only,
   each stripped with clearProps the moment its tween lands, so the picture's
   own hover gets its transform back and nothing outlives the entrance. */
export function useMaskReveal({
  // Section element, if it already carries a ref for other reasons. Omit and
  // the hook makes its own; either way the ref it used comes back to you.
  ref: externalRef,
  // The windows, resolved inside the section. One timeline each.
  frames = "[data-mask-frame]",
  // Type that rises with the first frame. Matches nothing in a grid, which is
  // what you want there.
  lines = "[data-mask-line]",
  // How long the mask and the image take. They always share it.
  duration = 1.4,
  ease = "power4.out",
  // Where a frame has to reach before it opens. Ignored when onLoad is set.
  start = "top 88%",
  // Run on mount rather than on scroll, for a frame already on screen when the
  // page loads. A hero cannot wait to be scrolled to.
  onLoad = false,
  // Seconds before any of it begins.
  delay = 0,
  // Seconds between one column opening and the next. Columns, not cards: cards
  // in the same row share a scroll position, so without this a row of three
  // arrives as one flat event.
  stagger = 0.12,
  // How many columns the grid has at its widest. Narrower breakpoints stack the
  // same cards into fewer columns, which throws the modulo off — harmlessly,
  // because every card owns its own ScrollTrigger. A card whose column index
  // says "third" just waits 0.24s after being scrolled to instead of 0, and a
  // quarter-second on an entrance nobody has seen the start of is invisible.
  // Getting this right per breakpoint would cost a matchMedia arm per column
  // count to fix something that cannot be perceived.
  columns = 1,
  // When the type starts, measured from the frame it belongs to. Late enough
  // that the picture is unmistakably on screen first — the eye should be given
  // the image, then the words, never both at once.
  textStart = 0.2,
  textDuration = 0.8,
  textStagger = 0.1,
  // Portion of `duration` the scrim takes to lift. Under 1 so the picture
  // reaches full contrast a beat before it stops moving, rather than
  // brightening and settling on the same frame.
  scrimRatio = 0.6,
  // Read once, on mount. Lets a shared section take the reveal as an opt-in
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

      const units = gsap.utils.toArray(root.querySelectorAll(frames));
      if (!units.length) return;

      const parts = units.map((frame) => ({
        frame,
        image: frame.querySelector("[data-mask-image]"),
        scrim: frame.querySelector("[data-mask-scrim]"),
      }));
      const type = gsap.utils.toArray(root.querySelectorAll(lines));

      // Named once because the reduced-motion arm has to clear exactly what the
      // tweens clear, and those two lists drifting apart is how an element ends
      // up stranded at its start value.
      const FRAME_PROPS = "clipPath";
      const MOVED_PROPS = "transform,translate,rotate,scale";
      const LINE_PROPS = MOVED_PROPS + ",opacity";

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const images = parts.map((part) => part.image).filter(Boolean);
        const scrims = parts.map((part) => part.scrim).filter(Boolean);
        gsap.set(units, { clearProps: FRAME_PROPS });
        if (images.length) gsap.set(images, { clearProps: MOVED_PROPS });
        if (scrims.length) gsap.set(scrims, { clearProps: "opacity" });
        if (type.length) gsap.set(type, { clearProps: LINE_PROPS });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        parts.forEach(({ frame, image, scrim }, index) => {
          const tl = gsap.timeline({
            // On load every frame is on screen at once, so they queue in
            // document order. On scroll each one is reached separately, and
            // only its position within its row is worth waiting for.
            delay: delay + (onLoad ? index : index % columns) * stagger,
            scrollTrigger: onLoad
              ? undefined
              : { trigger: frame, start, once: true },
          });

          tl.to(
            frame,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration,
              ease,
              clearProps: FRAME_PROPS,
            },
            0,
          );

          if (image) {
            // Both y and yPercent, and both to zero. The markup parks the image
            // with translateY(18%), which getComputedStyle hands back already
            // resolved to pixels — so GSAP records it as `y`, not `yPercent`,
            // and tweening yPercent alone would land on a value it already held
            // while the pixels stayed exactly where they were.
            tl.to(
              image,
              {
                y: 0,
                yPercent: 0,
                scale: 1,
                duration,
                ease,
                clearProps: MOVED_PROPS,
              },
              0,
            );
          }

          if (scrim) {
            tl.to(
              scrim,
              {
                opacity: 0,
                duration: duration * scrimRatio,
                ease: "power2.out",
                // Back to the `opacity-0` its class list already carries, which
                // is why the scrim rests transparent and starts opaque rather
                // than the other way round: clearProps can only remove the
                // inline value, so the resting one has to be the one in CSS.
                clearProps: "opacity",
              },
              0,
            );
          }

          // Hung off the first frame's timeline rather than given one of its
          // own, so textStart means what it says — this many seconds after the
          // image began, not after some second trigger happened to fire.
          if (index === 0 && type.length) {
            tl.to(
              type,
              {
                y: 0,
                yPercent: 0,
                opacity: 1,
                duration: textDuration,
                ease: "power2.out",
                stagger: textStagger,
                clearProps: LINE_PROPS,
              },
              textStart,
            );
          }
        });
      });
    },
    { scope: ref },
  );

  return ref;
}
