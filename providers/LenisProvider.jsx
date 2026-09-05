"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis, setLenis } from "@/lib/lenis";

export function LenisProvider({ children }) {
  const pathname = usePathname();

  /* Resync Lenis with the browser after every route change.
   *
   * The instance below lives for the whole app, and it drives the scroll
   * position itself: each frame it eases the window toward its own target.
   * Next scrolls the window to the top when a new page mounts (or back to the
   * saved spot on back/forward), but Lenis only adopts an outside scroll when
   * it is idle — and with a lerp this slow it is almost never idle at the
   * moment a link is clicked. So it kept easing toward the OLD page's target,
   * and on a shorter page that target clamps to the bottom: click a card at
   * the foot of one page and the next one opened at its foot instead of its
   * hero.
   *
   * Reading window.scrollY here rather than forcing 0 keeps both cases right:
   * a push has been scrolled to 0 by Next's layout effect before this runs,
   * and a pop has been restored to wherever it was. `immediate` cancels the
   * in-flight ease, `force` applies even while stopped; resize() first so the
   * new page's height is the limit rather than the old one's. */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = getLenis();
    if (!lenis) return;
    lenis.resize();
    lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      // Lerp, not `duration`/`easing` — Lenis runs one animator or the other,
      // and `duration` silently wins if both are set. With a duration, every
      // wheel tick restarts a fresh fixed-length tween from zero velocity, so
      // repeated ticks read as a chain of restarts instead of one glide. Lerp
      // has no end time: it eases toward a moving target each frame, so new
      // input blends into the motion already in progress. That continuity is
      // the smoothness being asked for, so do not reintroduce `duration`.
      //
      // 0.1 is Lenis's own default, and what both reference sites for this
      // feel resolve to — unilawtech.com passes it explicitly, and
      // webandcrafts.com falls back to it.
      lerp: 0.055,
      // Touch stays on native OS momentum (syncTouch defaults to false):
      // iOS/Android inertia is already tuned per-platform, and running it
      // through this animator too is what makes mobile feel rubbery.
      autoRaf: false,
    });

    // Published for overlays that have to freeze the page under them — see
    // lib/lenis.js.
    setLenis(lenis);

    // Stops ScrollTrigger refreshing when mobile browsers show/hide the URL bar,
    // which otherwise reads as a stutter mid-scroll.
    ScrollTrigger.config({ ignoreMobileResize: true });

    lenis.on("scroll", ScrollTrigger.update);

    function update(time) {
      lenis.raf(time * 1000);
    }

    // A ScrollTrigger refresh can change page height (pinning, lazy images);
    // Lenis needs to re-measure or its scroll limit goes stale.
    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(update);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return children;
}
