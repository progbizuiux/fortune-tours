"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/* Scroll-scrubbed entrance for a row of cards, measured frame by frame off the
   reference clip (its three-up "NATURE" row) so it reads identically here.
   Attach the returned ref to the row itself — its children are the cards:

     const ref = useRowRise();                      // a single row of cards
     const ref = useRowRise({ targets: ".card" });  // cards nested deeper
     const ref = useRowRise({ columns: 4 });        // a grid that wraps
     useRowRise({ ref: existingRef });              // row already has a ref

   Server components can use <RowRise> in components/common/RowRise.jsx, which
   is a thin client leaf around this hook.

   Two things happen against the same scroll progress, and the split is what
   makes the effect:
   - every card scales up together, 0.72 → 1, linear in scroll position;
   - each column starts further down than the one before it and closes that
     gap over the same range, so the row is a diagonal on the way in and
     resolves to a straight line exactly as it settles.
   The lag is a function of scroll position, not of time — in the reference
   the columns re-open the same diagonal when you scroll back up, which a
   velocity-based (ScrollSmoother `data-lag`) treatment would not do.

   The reference runs from the row's top at 80% of the viewport to 40% of it,
   with the leading column offset 12.8vh and the trailing one 49.2vh; those two
   ends are the defaults, and whatever columns sit between them are spread
   evenly, so the row keeps the same overall spread at any column count.

   The fade is ours — the reference has no opacity change at all. It finishes
   at 45% of the range so the cards are solid for most of the rise instead of
   drifting up as ghosts.

   Below `staggerFrom` the row is usually a horizontal snap-scroller rather
   than columns, so the cards all take the leading offset and rise together.
   prefers-reduced-motion → no animation at all, and the server HTML is never
   hidden, so no-JS visitors and crawlers always see the cards. */
export function useRowRise({
  // Row element, if it already carries a ref for other reasons. Omit and the
  // hook makes its own; either way the ref it used comes back to you.
  ref: externalRef,
  // Selector for the cards, resolved inside the row. Defaults to its children.
  targets,
  // Scroll range, as the row's own top crosses the viewport.
  start = "top 80%",
  end = "top 40%",
  // How far below its resting place the first and last column begin, in vh.
  leadVh = 12.8,
  trailVh = 49.2,
  // Scale the cards grow from over that same range.
  scale = 0.72,
  // Portion of the range the fade takes. 0 turns the fade off.
  fade = 0.45,
  // Column count to stagger across. Defaults to the number of cards, which is
  // right for a single row; set it for a grid that wraps onto several rows so
  // each row repeats the same diagonal instead of continuing it.
  columns,
  // Viewport width, in px, at and above which the columns stagger.
  staggerFrom = 1024,
  // false keeps the rise and fade but drops the per-column offset entirely.
  stagger = true,
  // Read once, on mount. Lets a shared component take the animation as an
  // opt-in prop without calling the hook conditionally.
  enabled = true,
} = {}) {
  const internalRef = useRef(null);
  const ref = externalRef ?? internalRef;

  useGSAP(
    () => {
      if (!enabled) return;
      const row = ref.current;
      if (!row) return;
      const cards = gsap.utils.toArray(
        targets ? row.querySelectorAll(targets) : row.children,
      );
      if (!cards.length) return;

      const columnCount = Math.max(1, columns ?? cards.length);

      // Read at tween time, not at build time: invalidateOnRefresh re-runs
      // these on resize so the offsets follow the new viewport height.
      const offset = (index) => {
        const span =
          columnCount > 1 ? (index % columnCount) / (columnCount - 1) : 0;
        const vh = leadVh + (trailVh - leadVh) * span;
        return (vh * window.innerHeight) / 100;
      };

      // A row that scrolls sideways clips vertically too: CSS forces overflow-y
      // to `auto` the moment overflow-x is anything but `visible`, and the
      // cards sit offset below the row's own box until the entrance finishes,
      // so they would rise in with their bottoms sliced off — and the row would
      // be vertically scrollable meanwhile, swallowing wheel and touch that
      // belong to the page. Lend it exactly that much room as padding and take
      // it straight back with a negative margin: nothing moves, and the padded
      // box is not vertically scrollable either, because the offset cards never
      // reach past it.
      //
      // Held from mount until the entrance completes, then dropped — that is
      // the point of doing it here rather than in a stylesheet. At rest the row
      // is back to its own box instead of a tall invisible one lying over the
      // section below, intercepting its clicks; and while it is held, the row
      // has not been reached yet, so everything under it is off screen anyway.
      const lendRoom = (staggered) => {
        row.style.paddingBottom = "";
        row.style.marginBottom = "";
        const rowStyle = getComputedStyle(row);
        if (rowStyle.overflowX === "visible") return () => {};

        const basePadding = parseFloat(rowStyle.paddingBottom) || 0;
        const baseMargin = parseFloat(rowStyle.marginBottom) || 0;
        let held = null;

        return (needed) => {
          if (needed === held) return;
          held = needed;
          if (!needed) {
            row.style.paddingBottom = "";
            row.style.marginBottom = "";
            return;
          }
          const room = offset(staggered ? columnCount - 1 : 0);
          row.style.paddingBottom = `${basePadding + room}px`;
          row.style.marginBottom = `${baseMargin - room}px`;
        };
      };

      const build = (staggered) => {
        const setRoom = lendRoom(staggered);
        // Needed for every progress short of 1, not just while the trigger is
        // active: below its start the cards are still parked at full offset.
        const roomNeeded = (self) => setRoom(self.progress < 1);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: row,
            start,
            end,
            scrub: true,
            invalidateOnRefresh: true,
            onLeave: () => setRoom(false),
            onEnterBack: () => setRoom(true),
            onRefresh: roomNeeded,
          },
        });

        tl.fromTo(
          cards,
          { y: (i) => offset(staggered ? i : 0), scale },
          { y: 0, scale: 1, duration: 1 },
          0,
        );

        if (fade > 0) {
          tl.fromTo(
            cards,
            { opacity: 0 },
            { opacity: 1, duration: fade, ease: "power1.out" },
            0,
          );
        }

        roomNeeded(tl.scrollTrigger);

        return () => setRoom(false);
      };

      const mm = gsap.matchMedia();
      mm.add(
        `(min-width: ${staggerFrom}px) and (prefers-reduced-motion: no-preference)`,
        () => build(stagger),
      );
      mm.add(
        `(max-width: ${staggerFrom - 0.02}px) and (prefers-reduced-motion: no-preference)`,
        () => build(false),
      );
    },
    { scope: ref },
  );

  return ref;
}
