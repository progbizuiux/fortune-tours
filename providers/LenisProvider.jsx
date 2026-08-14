"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function LenisProvider({ children }) {
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
      lerp: 0.05,
      // Touch stays on native OS momentum (syncTouch defaults to false):
      // iOS/Android inertia is already tuned per-platform, and running it
      // through this animator too is what makes mobile feel rubbery.
      autoRaf: false,
    });

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
      lenis.destroy();
    };
  }, []);

  return children;
}
