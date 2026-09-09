"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis, setLenis } from "@/lib/lenis";

/* The scroll reset below has to land before the browser paints the new page,
   or the first frame of it shows at the old page's offset. useLayoutEffect is
   the hook that runs there; on the server it does not exist, and React warns
   if it is called during SSR, so fall back to useEffect for that pass only. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function LenisProvider({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  /* Start every route at the top.
   *
   * The instance below lives for the whole app and drives the scroll position
   * itself: each frame it eases the window toward its own target. Next scrolls
   * the window to the top when a new page mounts, but Lenis only adopts an
   * outside scroll while it is idle — and with a lerp this slow it is almost
   * never idle at the moment a link is clicked. Left alone it keeps easing
   * toward the OLD page's target and drags the new page back down with it.
   *
   * Killing that in-flight ease is the whole job, and it is the part that was
   * missing: `scrollTo` only reaches Lenis's internal reset (the one call that
   * halts the animation) when the target it is given differs from the target
   * already set — `if (target === this.targetScroll) return` in lenis's
   * source. resize() had just assigned targetScroll = window.scrollY, and the
   * window.scrollTo(0, 0) above it had made that 0, so scrollTo(0) matched,
   * bailed one line early, and never stopped anything. The ease survived the
   * navigation and the reset it was supposed to perform did nothing.
   *
   * stop() then start() is the public route to that same reset, and it cannot
   * be short-circuited. Skip it when Lenis is already stopped: an open modal
   * holds it that way on purpose (see components/common/Modal.jsx) and stop()
   * has already done the reset, so starting it here would only unfreeze the
   * page under the overlay. */
  useIsomorphicLayoutEffect(() => {
    /* A URL that names a target is asking for that element, not for the top —
       #az-letter-k on /destinations/a-z, and any such link someone shares. */
    if (window.location.hash) return;

    const lenis = getLenis();

    if (lenis) {
      if (!lenis.isStopped) {
        lenis.stop();
        lenis.start();
      }
      // Re-measure first so the limit is the new page's height, not the old
      // one's; `force` applies even while stopped.
      lenis.resize();
      lenis.scrollTo(0, { immediate: true, force: true });
    }

    /* Unconditional, and last: it covers the first render (before the instance
       exists) and stays correct in the case where Lenis is already sitting at
       0 and its scrollTo is a no-op. */
    window.scrollTo(0, 0);
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
      // Halts the in-flight ease the moment an internal link to a different
      // path is clicked, so nothing is still gliding by the time the route
      // reset above runs. Lenis ships this option for exactly the problem
      // that effect describes; keeping both means a route entered without a
      // click — back/forward, or a router.push — is covered too.
      stopInertiaOnNavigate: true,
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
