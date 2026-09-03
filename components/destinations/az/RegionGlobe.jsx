"use client";

import dynamic from "next/dynamic";

/* three/R3F must never run on the server, so the canvas is loaded client-only —
   the same guard components/home/GlobeSection.jsx puts around it. */
const GlobeCanvas = dynamic(() => import("@/components/home/GlobeCanvas"), {
  ssr: false,
});

/* The globe that opens the By Region view.
 *
 * The home page's GlobeSection is not reused wholesale, only the canvas inside
 * it. That section carries its own chapter eyebrow, its own heading, and — the
 * reason it cannot come along — its own "Map of regions / A-Z of countries"
 * button pair, which on this page would sit directly under the tabs those very
 * buttons were drawn for and duplicate them.
 *
 * What is shared is the thing worth sharing: one globe, drawn once, in
 * components/home/GlobeCanvas.jsx. It is transparent (`alpha: true`), so it
 * takes the cream ground of the page it lands on, and it gates its own render
 * loop behind an IntersectionObserver — which is also what makes it free while
 * this panel is the hidden one.
 *
 * The band shows the top 40% of the sphere, and it is an aspect ratio rather
 * than a stack of pixel heights because a fraction of the globe is a ratio of
 * the canvas WIDTH, not a number of pixels. GlobeCanvas draws the sphere at
 * 0.74x the canvas width, so showing 40% of its height means a band of
 * 0.40 x 0.74 = 0.296 of the width — the 1000/296 below. That holds the same
 * fraction at every breakpoint; a fixed height cannot, because the sphere grows
 * with the frame while the height would not.
 *
 * To change how much shows, change only the second number: it is
 * `fraction x 740`. Half the globe, down to the equator, is 370; the full cap
 * to the equator plus the apex offset is 394.
 *
 * The cut lands above the equator, so the silhouette is still curving inward
 * where it meets the edge and only a narrow band of sphere touches the line —
 * which is exactly what lets the gradient below read as a horizon. It still has
 * to reach FULLY opaque cream before that line, or what is left gets sliced.
 */
export function RegionGlobe() {
  return (
    <div
      aria-hidden="true"
      /* Decorative. The names underneath are the navigable content, and every
         pin the globe draws is a link that also appears in the list below, so
         announcing it again would be a second copy of the same four places. */
      /* The 40% is a fraction of the WIDTH, so on a narrow screen it collapses:
         at 375px it is an 85–102px arc of a 254px sphere, which reads as a
         stray curve rather than a globe — and with the region lists gone this
         band is the whole view, so there is nothing else to carry it.

         `min-h` is the floor, and it is preferable to a second aspect ratio at
         a breakpoint because the two meet exactly rather than jumping: 0.296 x
         width equals 180px at a 608px container, so the floor governs below
         that and the ratio above it, with no step at the crossover. Under the
         floor the box is shorter than the ratio wants, which simply shows MORE
         of the sphere — about 70% on a phone, a proper dome.

         `w-full` is load-bearing next to that floor, not decoration. With an
         auto width, `aspect-ratio` is free to resolve the WIDTH from a definite
         height — so the moment min-h pinned the height at 180px the box grew to
         608px across inside a 375px phone and pushed the whole page sideways.
         Stating the width leaves the ratio only the height to decide. */
      className="pointer-events-none relative -mt-2 mb-2 aspect-[1000/296] min-h-[180px] w-full overflow-hidden"
    >
      {/* pointer-events restored on the canvas itself: the globe is draggable
          and its pins are links, and the wrapper above only opts out so the
          empty corners of the band do not swallow clicks meant for the page. */}
      <div className="pointer-events-auto absolute inset-0">
        {/* No continent names on the sphere. They are drawn for the home
            page's globe, where nothing else on screen says "Africa"; here the
            thirteen regions are already set in type directly underneath, and
            the same words floating over the map read as a duplicate rather
            than as labelling. */}
        <GlobeCanvas labels={false} />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(250,247,242,0) 0%, rgba(250,247,242,0.5) 45%, rgba(250,247,242,0.88) 75%, #faf7f2 100%)",
        }}
      />
    </div>
  );
}
