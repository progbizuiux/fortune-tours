"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function LenisProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      // Scroll feel matched to aerodynamics.nl (Lenis 1.3.17). Setting `duration`
      // switches Lenis off its default `lerp: 0.1` smoothing and onto a fixed
      // 1.2s expo-out curve — that long, gliding tail is the whole difference.
      // Both are passed to the animator on every wheel tick and duration wins,
      // so `lerp` is deliberately left unset rather than set to a fighting value.
      duration: 1.2,
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
