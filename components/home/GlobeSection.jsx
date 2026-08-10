"use client";

import dynamic from "next/dynamic";

/* R3F/three must never run on the server — loaded client-only. */
const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), { ssr: false });

/* Section background sampled from the Figma globe frame. */
const BG = "#fbf4e8";

export function GlobeSection() {
  return (
    <section
      aria-label="Atlas — the world in motion"
      className="relative isolate z-0 h-[320px] overflow-hidden sm:h-[420px] md:h-[520px] lg:h-[600px]"
      style={{ backgroundColor: BG }}
    >
      <div className="absolute inset-0">
        <GlobeCanvas />
      </div>
      {/* Globe dissolves into the background towards the base (Figma) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-3/5"
        style={{
          background: `linear-gradient(to bottom, rgba(251, 244, 232, 0) 0%, ${BG} 78%, ${BG} 100%)`,
        }}
      />
    </section>
  );
}
