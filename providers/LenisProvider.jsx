"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis, setLenis } from "@/lib/lenis";

function ScrollToTopEffect() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollToTopSmooth = () => {
      const lenis = getLenis();
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(0, { force: true, duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    };

    // Trigger immediately, next frame, and after timeout to cover all client routing/hydration stages
    scrollToTopSmooth();
    const rafId = requestAnimationFrame(scrollToTopSmooth);
    const timer = setTimeout(scrollToTopSmooth, 50);

    window.addEventListener("popstate", scrollToTopSmooth);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      window.removeEventListener("popstate", scrollToTopSmooth);
    };
  }, [pathname, searchParams]);

  return null;
}

export function LenisProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.055,
      autoRaf: false,
    });

    setLenis(lenis);

    ScrollTrigger.config({ ignoreMobileResize: true });

    lenis.on("scroll", ScrollTrigger.update);

    function update(time) {
      lenis.raf(time * 1000);
    }

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

  return (
    <>
      <Suspense fallback={null}>
        <ScrollToTopEffect />
      </Suspense>
      {children}
    </>
  );
}
