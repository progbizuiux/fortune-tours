"use client";

import { useEffect, useRef } from "react";

/* Scroll-scrubbed stack for a column of blocks, measured off the reference site
   (bluezonehabitat.com's "Blue Zone Living"). Attach the returned ref to the
   column — its children are the blocks:

     const ref = useStickyStack();
     useStickyStack({ ref: existingRef });   // column already has a ref

   Server components can use <StickyStack> in components/common/StickyStack.jsx,
   which is a thin client leaf around this hook.

   Each block parks in the middle of the screen and the next one slides up over
   it and parks in its place; scrolling back up slides it off again. That is
   `position: sticky` on every block at once — they pin in turn and, being
   opaque and in source order, each one hides the one before it. So the motion
   is the scroll position itself rather than a timeline played at it, which is
   why it is exact in both directions and costs nothing per frame.

   All this hook does is give each block the `top` that centres it, which is the
   one part CSS cannot work out on its own: sticky needs a length, and half the
   leftover screen is only knowable once the block has been measured. That is
   also why it is worth the JS. The alternative — a screen-tall panel with the
   block centred inside it, which is how the reference does it — only lines up
   when the block happens to fill the screen. Ours are half that, so the panel
   would carry a screen-and-a-half of empty margin the layout has to make room
   for: space above the first block and below the last that the design does not
   have, and a stretch of scroll at every handover where nothing but blank
   passes over blank. Pinning the blocks themselves has neither. Nothing about
   the layout changes — sticky does not alter a box or its flow — so the column
   keeps whatever gaps, padding and margins it already had, at every width.

   Centring is capped on narrow screens, because a block much shorter than the
   screen parks a long way down it, and under a fixed header that reads as the
   column having been pushed down rather than as breathing room. `capBelow`
   sets the width under which a block may sit no further below the header than
   the column's own gap — the same gap it already keeps between its blocks, read
   off the container so it follows whatever that gap is at that width. Above
   `capBelow` the block centres outright, which is what the wide layout wants:
   there the block is a band across the screen and the space around it reads as
   the page's own margin.

   Two cases turn it off, and both leave the column flowing normally:
   - a block taller than the screen, which has nowhere to park and would pin
     with its foot hanging off the bottom. All-or-nothing, since a column of
     part-pinned blocks reads as broken rather than as a stack;
   - prefers-reduced-motion.
   The server HTML is never sticky either, so no-JS visitors and crawlers get
   the plain column too. */
export function useStickyStack({
  // Column element, if it already carries a ref for other reasons. Omit and the
  // hook makes its own; either way the ref it used comes back to you.
  ref: externalRef,
  // Space at the top of the screen a block should not park under, as px or as a
  // selector for the fixed chrome to measure — "header" for a fixed site
  // header. Only consulted below `capBelow`.
  headroom = 0,
  // Viewport width, in px, under which a block parks no further below the
  // headroom than the column's gap. 0 leaves every width centring outright.
  capBelow = 0,
  // Read once, on mount. Lets a shared component take the effect as an opt-in
  // prop without calling the hook conditionally.
  enabled = true,
} = {}) {
  const internalRef = useRef(null);
  const ref = externalRef ?? internalRef;

  useEffect(() => {
    if (!enabled) return;
    const stack = ref.current;
    if (!stack) return;

    const blocks = Array.from(stack.children);
    // One block has nothing to slide over.
    if (blocks.length < 2) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const measure = () => {
      frame = 0;

      // Heights are read straight off the pinned blocks: sticky moves where a
      // box paints, never its size, so there is no need to unset anything first
      // and no layout thrash from doing so.
      const viewport = window.innerHeight;
      const heights = blocks.map(
        (block) => block.getBoundingClientRect().height,
      );
      const on = !reduced.matches && heights.every((h) => h <= viewport);

      // Measured rather than passed as a number: the header is a client
      // component and a server component cannot read a value out of one, and
      // measuring follows whatever it actually renders as anyway.
      const chrome =
        typeof headroom === "number"
          ? headroom
          : (document.querySelector(headroom)?.getBoundingClientRect().height ??
            0);
      const gap = parseFloat(getComputedStyle(stack).rowGap) || 0;
      const cap =
        capBelow > 0 && window.innerWidth < capBelow
          ? chrome + gap
          : Number.POSITIVE_INFINITY;

      blocks.forEach((block, index) => {
        // No floor at `chrome`: when a block only just fits, centring already
        // puts it under the header and pushing it clear would hang its foot off
        // the bottom instead. Being tucked up is the better of the two.
        const top = Math.round(Math.min((viewport - heights[index]) / 2, cap));
        block.style.position = on ? "sticky" : "";
        block.style.top = on ? `${top}px` : "";
      });
    };

    // Coalesced: a resize fires the observer once per block and the window
    // listener on top of that, and they all want the same single re-measure.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();

    // The blocks resize without the window doing so — a font swapping in, a
    // picture settling, copy rewrapping — and each one changes where its own
    // centre is. Watching the blocks catches that; the window listener catches
    // a viewport height change, which moves every centre at once and is not a
    // resize of anything being observed.
    const observer = new ResizeObserver(schedule);
    for (const block of blocks) observer.observe(block);
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      for (const block of blocks) {
        block.style.position = "";
        block.style.top = "";
      }
    };
  }, [enabled, ref, headroom, capBelow]);

  return ref;
}
