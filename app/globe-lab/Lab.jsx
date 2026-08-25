"use client";
import dynamic from "next/dynamic";
const GlobeCanvas = dynamic(() => import("@/components/home/GlobeCanvas"), { ssr: false });

const VARIANTS = [
  { tilt: 62, spin: 110 },
  { tilt: 62, spin: 130 },
  { tilt: 62, spin: 150 },
  { tilt: 55, spin: 130 },
  { tilt: 70, spin: 130 },
  { tilt: 62, spin: 170 },
];

export default function Lab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", background: "#FAF7F2" }}>
      {VARIANTS.map((v) => (
        <div key={`${v.tilt}-${v.spin}`} style={{ height: 340, position: "relative", outline: "1px solid #ccc" }}>
          <div style={{ position: "absolute", zIndex: 5, font: "12px monospace", color: "#333" }}>
            t{v.tilt} s{v.spin}
          </div>
          <GlobeCanvas tilt={v.tilt} spin={v.spin} spinSpeed={0} />
        </div>
      ))}
    </div>
  );
}
