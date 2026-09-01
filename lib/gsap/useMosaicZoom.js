"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/* Scroll-scrubbed mosaic zoom, taken from the D Luxury Collection Webflow site.
   Attach the returned ref to the section; the three boxes it needs are marked in
   the markup:

     <section ref={useMosaicZoom()}>
       <div data-zoom-section>      the tall box that supplies the scroll room
         <div data-zoom-stage>      sticky, viewport-tall, clips
           <div data-zoom-grid>     what actually scales
             …tiles…

   One tween, scrubbed against the section's own scroll range: the grid starts
   blown up far enough that a single tile covers the stage, and shrinks to its
   natural layout as you scroll. The reference reads as a camera pulling back —
   you begin inside one photograph and end looking at the whole wall of them.

   Three numbers make that work, and all three are measured rather than guessed,
   because a hard-coded scale is only ever right at one viewport size:

   - The focal tile is the one the zoom opens on — by default whichever sits
     nearest the grid's centre, or a given index via `focal`. Scaling about the
     grid's raw centre lands on a gap between tiles as often as on a tile, which
     is why it is always resolved to a real tile either way.
   - transform-origin is set to that tile's centre, so the tile the viewer is
     looking at is the one thing that does not move for the whole zoom. Every
     other tile flies outward from it.
   - The grid is then translated so that fixed point begins at the stage's
     centre and ends wherever the natural layout puts it. Without this the zoom
     is centred on the page rather than on the tile, and the focal image drifts
     off to one side as it grows.

   startScale is set by `open`, and its default covers the stage rather than
   fitting inside it — max of the two ratios, not min — so the opening frame is
   filled edge to edge by one photograph. It is the one number to reach for when
   the move is too much or too little: everything else about the zoom follows
   from how far in it starts.

   endScale is normally 1, but is allowed to go below it when the grid is taller
   than the stage, so the last frame is the whole mosaic rather than a mosaic cut
   off at the bottom. On a viewport tall enough for the natural layout this
   resolves to exactly 1 and the tween ends on the untouched grid.

   ease "none": the curve belongs to the scroll, not to us. Any easing here would
   mean the mosaic moves at a speed the wheel did not ask for, which is the one
   thing a scrubbed animation must never do.

   Below `from` the grid is a single column and far taller than any viewport, so
   there is no zoom to be had — fitting twelve stacked photographs into one
   screen would make each of them thumbnail-sized. That arm gets the house rise
   instead, per card, so the section is never simply static. The markup keeps the
   sticky/tall classes behind the same `lg:` breakpoint, so below it the grid is
   in normal flow and this hook only ever adds transforms that clear themselves.

   Nothing here is baked into the markup — unlike lib/gsap/useMaskReveal.js, the
   start state is a transform this hook applies, so no-JS and reduced-motion both
   land on the plain grid with no help needed. */
export function useMosaicZoom({
  // Section element, if it already carries a ref for other reasons. Omit and
  // the hook makes its own; either way the ref it used comes back to you.
  ref: externalRef,
  // The tall box whose scroll range the zoom is scrubbed against.
  section = "[data-zoom-section]",
  // The sticky, clipping box the grid is sized against.
  stage = "[data-zoom-stage]",
  // What scales.
  grid = "[data-zoom-grid]",
  // The tiles. Defaults to the grid's own children.
  tiles,
  // Which tile the zoom opens on. "center" picks whichever sits nearest the
  // grid's middle; a number picks that tile by index. Pass 0 when the first
  // tile is doing a hero's job and has to be the one filling the screen.
  focal = "center",
  // How far in the zoom opens, measured on the focal tile:
  //   "cover"  it fills the stage in both directions, so nothing else is
  //            visible and the crop is whatever the aspect mismatch costs
  //   "width"  it spans the stage's width only, leaving the section's own
  //            ground showing above and below — a shorter, calmer pull-back,
  //            and what the reference actually does on its opening frame
  //   number   used as the scale directly, for when neither fits
  // Lower means less zoom to undo, so the whole move is smaller.
  open = "cover",
  // Anything laid over the stage — a title card, usually. It fades out as the
  // zoom pulls back, because type sized to be read across a full-bleed
  // photograph is type sitting on top of eleven other photographs a moment
  // later. Scaling it with the grid is not the answer either: it would leave at
  // the same rate as the picture and be unreadable for most of the way.
  content = "[data-zoom-content]",
  // Portion of the zoom's range the content takes to go. Well under half, so it
  // is gone before the mosaic is busy enough to compete with it.
  contentFade = 0.35,
  // How much scrolling the zoom is spent over, as a fraction of the viewport's
  // height. It ends there and the grid is then just a grid: whatever is taller
  // than the screen scrolls the ordinary way, which is the point — the mosaic is
  // a gallery to be read through, not a slide to be held on.
  distance = 0.8,
  // Hold the stage still for exactly that distance, then let go. Without it the
  // zoom and the page's own scrolling spend the same wheel travel: the mosaic
  // reaches full size only once it has already been carried past the top of the
  // screen, so the rows you watched grow are the rows you then have to scroll
  // back up to look at. Pinned, the zoom finishes with the gallery still where
  // it started, and the scrolling that follows is the ordinary kind.
  pin = true,
  // Viewport width, in px, at and above which the zoom runs at all. Matches the
  // `lg:` prefix the markup uses for its sticky stage.
  from = 1024,
  // Seconds of catch-up between the wheel and the grid. A little lag is what
  // keeps a scrubbed scale from feeling glued to the mouse; too much and the
  // mosaic is still moving after the page has stopped.
  scrub = 1,
  // The per-card rise used below `from`, matching lib/gsap/useReveal.js exactly
  // so the two treatments cannot be told apart where they meet.
  riseY = 30,
  riseDuration = 1,
  riseStart = "top 88%",
  // Read once, on mount. Lets a shared section take the zoom as an opt-in prop
  // without calling the hook conditionally.
  enabled = true,
} = {}) {
  const internalRef = useRef(null);
  const ref = externalRef ?? internalRef;

  useGSAP(
    () => {
      if (!enabled) return;
      const root = ref.current;
      if (!root) return;

      const sectionEl = root.querySelector(section);
      const stageEl = root.querySelector(stage);
      const gridEl = root.querySelector(grid);
      if (!sectionEl || !stageEl || !gridEl) return;

      const cards = gsap.utils.toArray(
        tiles ? gridEl.querySelectorAll(tiles) : gridEl.children,
      );
      if (!cards.length) return;

      const MOVED_PROPS = "transform,translate,rotate,scale,opacity";

      const mm = gsap.matchMedia();

      mm.add(
        `(min-width: ${from}px) and (prefers-reduced-motion: no-preference)`,
        () => {
          // Re-measured on every refresh rather than closed over once, so a
          // resize or an orientation change re-derives the scale instead of
          // zooming to a number that was right for the old viewport.
          let startScale = 1;
          let endScale = 1;
          let startX = 0;
          let startY = 0;
          let endX = 0;
          let endY = 0;

          const measure = () => {
            // Measure the untransformed layout. Reading geometry while the
            // hook's own scale is still applied would compound it, and every
            // refresh would zoom further than the last.
            gsap.set(gridEl, {
              clearProps: "transform,translate,rotate,scale",
            });

            const stageBox = stageEl.getBoundingClientRect();
            const gridBox = gridEl.getBoundingClientRect();
            if (!stageBox.height || !gridBox.height) return;

            const gridCx = gridBox.left + gridBox.width / 2;
            const gridCy = gridBox.top + gridBox.height / 2;

            let focalBox = null;
            if (typeof focal === "number") {
              const picked =
                cards[gsap.utils.clamp(0, cards.length - 1, focal)];
              focalBox = picked && picked.getBoundingClientRect();
            } else {
              let best = Infinity;
              for (const card of cards) {
                const box = card.getBoundingClientRect();
                const distance = Math.hypot(
                  box.left + box.width / 2 - gridCx,
                  box.top + box.height / 2 - gridCy,
                );
                if (distance < best) {
                  best = distance;
                  focalBox = box;
                }
              }
            }
            if (!focalBox || !focalBox.width) return;

            const focalCx = focalBox.left + focalBox.width / 2;
            const focalCy = focalBox.top + focalBox.height / 2;
            const stageCx = stageBox.left + stageBox.width / 2;
            // Centred on what can actually be seen, not on the stage's whole
            // box. The stage is as tall as the grid now, which on a wide screen
            // is taller than the window — centring on its true middle would put
            // the banner below the fold at the one moment it is the page.
            const stageCy =
              stageBox.top + Math.min(stageBox.height, window.innerHeight) / 2;

            if (typeof open === "number") {
              startScale = open;
            } else if (open === "width") {
              startScale = stageBox.width / focalBox.width;
            } else {
              startScale = Math.max(
                stageBox.width / focalBox.width,
                stageBox.height / focalBox.height,
              );
            }
            // Always 1 — the zoom ends on the layout as designed, never on a
            // shrunk-to-fit version of it. Fitting the whole mosaic into one
            // screen is what stopped it being scrollable: twelve cards squeezed
            // to 70% so the last row could be seen all at once, when the last
            // row is exactly what scrolling is for.
            endScale = 1;

            gsap.set(gridEl, {
              transformOrigin: `${((focalCx - gridBox.left) / gridBox.width) * 100}% ${
                ((focalCy - gridBox.top) / gridBox.height) * 100
              }%`,
            });

            // The origin is the focal tile's centre, so scaling leaves it where
            // it is: at the start it only has to be carried to the middle of the
            // stage. At the end the grid's centre is what should sit there, and
            // scaling about the focal point has moved it to
            // focal + endScale * (gridCentre - focal).
            startX = stageCx - focalCx;
            startY = stageCy - focalCy;
            // Nothing. The grid ends at full size, and at full size the place it
            // belongs is the place the layout already put it — an end offset
            // could only move it away from that. This used to centre the grid on
            // the stage instead, which was right only while the stage was a
            // viewport-tall box the grid had to be fitted into; against a stage
            // that is now the grid's own height it dragged the whole gallery up
            // by half the difference and left the top row cropped.
            endX = 0;
            endY = 0;
          };

          // Read at refresh time, not closed over, so it follows a resize.
          const zoomPx = () => Math.max(1, window.innerHeight * distance);

          measure();

          gsap.fromTo(
            gridEl,
            {
              scale: () => startScale,
              x: () => startX,
              y: () => startY,
            },
            {
              scale: () => endScale,
              x: () => endX,
              y: () => endY,
              ease: "none",
              scrollTrigger: {
                trigger: sectionEl,
                start: "top top",
                // A measured distance rather than the section's own end. The
                // section is only as tall as the grid now, so "bottom bottom"
                // would be a few pixels of range on a short one and the whole
                // zoom would happen in a flick.
                end: () => `+=${zoomPx()}`,
                pin: pin ? stageEl : false,
                // The pin swaps in a placeholder at the moment it engages;
                // starting it a frame early hides the shift that otherwise
                // shows as a jump at high scroll speeds.
                anticipatePin: pin ? 1 : 0,
                scrub,
                invalidateOnRefresh: true,
                // Before ScrollTrigger re-reads the tween's function values, so
                // they resolve against geometry measured for the new viewport.
                onRefreshInit: measure,
              },
            },
          );

          // Its own trigger rather than a second tween on the one above,
          // because it has to finish well before the zoom does and a scrubbed
          // timeline cannot hold two different end points.
          const card = root.querySelector(content);
          if (card) {
            gsap.to(card, {
              opacity: 0,
              ease: "none",
              scrollTrigger: {
                trigger: sectionEl,
                start: "top top",
                end: () => `+=${Math.max(1, zoomPx() * contentFade)}`,
                scrub,
                invalidateOnRefresh: true,
              },
            });
          }
        },
      );

      mm.add(
        `(max-width: ${from - 0.02}px) and (prefers-reduced-motion: no-preference)`,
        () => {
          // A tile carrying the masked reveal's marker is the hero tile and
          // already has an entrance of its own; giving it this one as well
          // would have two animations arguing over the same opacity.
          const risers = cards.filter(
            (card) => !card.hasAttribute("data-mask-frame"),
          );
          risers.forEach((card) => {
            gsap.set(card, { opacity: 0, y: riseY });
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: riseDuration,
              ease: "power2.out",
              clearProps: MOVED_PROPS,
              scrollTrigger: { trigger: card, start: riseStart, once: true },
            });
          });
        },
      );
    },
    { scope: ref },
  );

  return ref;
}
