"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function LenisProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      // Setting `duration` switches Lenis off its default `lerp: 0.1` smoothing
      // and onto a fixed expo-out curve. Both are passed to the animator on
      // every wheel tick and duration wins, so `lerp` is deliberately left
      // unset rather than set to a fighting value.
      //
      // aerodynamics.nl runs this same curve at 1.2. Raised here because the
      // easing is heavily front-loaded — it covers 75% of the travel in the
      // first 20% of the duration — so stretching the duration is what makes
      // the glide read as longer. 1.2 -> 1.8 moves that 75% mark from 0.24s
      // to 0.36s. Past roughly 2.2 the bar stops tracking the wheel and
      // starts feeling laggy.
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
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
