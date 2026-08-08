import Image from "next/image";

// Save your four cloud PNGs (white clouds on a TRANSPARENT background) here,
// then flip HAS_CLOUDS to true.
const CLOUDS = [
  { src: "/clouds/cloud-1.png", key: "c1" },
  { src: "/clouds/cloud-2.png", key: "c2" },
  { src: "/clouds/cloud-3.png", key: "c3" },
  { src: "/clouds/cloud-4.png", key: "c4" },
];

const HAS_CLOUDS = false;

// Rendered twice so the -50% translate in the `marquee` keyframes lands on an
// identical frame. Tiles butt together with no gap or margin, so half the track
// is exactly the repeat length and the loop is seamless.
const TRACK = [...CLOUDS, ...CLOUDS];

const CLOUD_W = 640;
const CLOUD_H = 320;

export function CloudTransition() {
  return (
    // Pulled up over the bottom of the hero so the clouds sit on top of the
    // video, then resolve into the white section below. Decorative only.
    <div
      className="relative z-10 -mt-40 lg:-mt-56"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      {HAS_CLOUDS && (
        <div className="overflow-hidden">
          <div className="animate-marquee motion-reduce:animate-none flex w-max [animation-duration:90s]">
            {TRACK.map((cloud, index) => (
              <div
                key={`${cloud.key}-${index}`}
                className="relative shrink-0"
                style={{ width: CLOUD_W, height: CLOUD_H }}
              >
                <Image
                  src={cloud.src}
                  alt=""
                  fill
                  sizes={`${CLOUD_W}px`}
                  className="object-cover object-bottom"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolves whatever is above into the page background, so the hero video
          never ends on a hard horizontal edge. */}
      <div className="to-background h-28 bg-gradient-to-b from-transparent lg:h-36" />
      <div className="bg-background h-8" />
    </div>
  );
}
