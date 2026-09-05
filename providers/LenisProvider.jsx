"use client";

import { useEffect, Suspense, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis, setLenis } from "@/lib/lenis";

// Set history scrollRestoration to manual so the browser never restores scroll to the middle
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function scrollToTopSmooth() {
  const lenis = getLenis();
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(0, { force: true, duration: 1.2 });
  } else if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
}

function ScrollToTopEffect() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevUrlRef = useRef(null);

  useEffect(() => {
    const currentUrl = `${pathname}?${searchParams.toString()}`;
    scrollToTopSmooth();

    const timers = [
      setTimeout(scrollToTopSmooth, 20),
      setTimeout(scrollToTopSmooth, 100),
      setTimeout(scrollToTopSmooth, 300),
      setTimeout(scrollToTopSmooth, 600),
    ];

    const rafId = requestAnimationFrame(scrollToTopSmooth);
    prevUrlRef.current = currentUrl;

    return () => {
      cancelAnimationFrame(rafId);
      timers.forEach(clearTimeout);
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    window.addEventListener("popstate", scrollToTopSmooth);
    window.addEventListener("hashchange", scrollToTopSmooth);

    const handleDocumentClick = (e) => {
      const anchor = e.target.closest("a");
      if (anchor && anchor.href) {
        try {
          const targetUrl = new URL(anchor.href, window.location.href);
          if (targetUrl.origin === window.location.origin) {
            scrollToTopSmooth();
          }
        } catch {
          // ignore invalid URLs
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });

    return () => {
      window.removeEventListener("popstate", scrollToTopSmooth);
      window.removeEventListener("hashchange", scrollToTopSmooth);
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, []);

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

    // Initial smooth scroll to top on mount
    lenis.resize();
    scrollToTopSmooth();
    const mountTimer = setTimeout(scrollToTopSmooth, 100);

    return () => {
      clearTimeout(mountTimer);
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
