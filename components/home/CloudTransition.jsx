import Image from "next/image";

// Four cloud PNGs rendered at their native aspect ratio (1580 × 440 px).
// Each frame's cloud mass is inset from the PNG's left/right borders, so
// butting the frames edge-to-edge leaves see-through gaps at every junction.
// FRAME_OVERLAP slides each frame under its neighbour's sparse edge: the
// dense white areas merge white-on-white and the strip reads as one
// continuous cloud bank. The overlap must be identical on every frame —
// the marquee's -50% loop only works with a uniform repeat pitch.
const FRAME_OVERLAP = 240;

const CLOUDS = [
  { src: "/cloude-frame/Frame@1.5x-1.png", key: "c1", w: 1580, h: 440 },
  { src: "/cloude-frame/Frame@1.5x-2.png", key: "c2", w: 1580, h: 440 },
  { src: "/cloude-frame/Frame@1.5x-3.png", key: "c3", w: 1580, h: 440 },
  { src: "/cloude-frame/Frame@1.5x-4.png", key: "c4", w: 1580, h: 440 },
];

// Doubled so the marquee -50% translate loops back to frame 0 invisibly.
const TRACK = [...CLOUDS, ...CLOUDS];

export function CloudTransition() {
  return (
    // The cloud bank is the visual top edge of section 02, so it is also where
    // the navbar has to stop being transparent — white nav text is invisible
    // against these clouds. Navbar finds this marker by attribute; see
    // components/layout/Navbar.jsx.
    <div
      className="relative z-10 -mt-10 lg:-mt-16"
      aria-hidden="true"
      data-navbar-solid-from=""
      style={{ pointerEvents: "none" }}
    >
      {/* Seamless scrolling cloud strip */}
      <div className="relative" style={{ overflow: "hidden", fontSize: 0, lineHeight: 0 }}>
        <div className="animate-marquee" style={{ display: "flex", width: "max-content" }}>
          {TRACK.map((cloud, index) => (
            <Image
              key={`${cloud.key}-${index}`}
              src={cloud.src}
              alt=""
              width={cloud.w}
              height={cloud.h}
              sizes="1580px"
              style={{
                display: "block",
                flexShrink: 0,
                width: cloud.w,
                height: "auto",
                margin: 0,
                marginRight: -FRAME_OVERLAP,
                padding: 0,
                border: "none",
              }}
              priority={index < 4}
            />
          ))}
        </div>

        {/* Soft white fade over the lower clouds. The cloud art is not solid
            near its bottom edge — it has see-through holes with hard cloud
            outlines — so the fade must hit full opacity well above the strip
            bottom (78% of the overlay) to bury those edges; the section below
            shares the same background color, so the hand-off is invisible.
            Eased stops avoid a visible gradient start line. */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 18%, rgba(255,255,255,0.4) 38%, rgba(255,255,255,0.72) 55%, rgba(255,255,255,0.92) 68%, var(--background) 78%)",
          }}
        />
      </div>
    </div>
  );
}
