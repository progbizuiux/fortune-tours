import Image from "next/image";

// Save the partner logos (transparent PNG or SVG) here, then flip the flag.
const PARTNERS = [
  { name: "Partner 1", src: "/credentials/user-logo/Mask group.png" },
  { name: "Partner 2", src: "/credentials/user-logo/Mask group-1.png" },
  { name: "Partner 3", src: "/credentials/user-logo/Mask group-2.png" },
  { name: "Partner 4", src: "/credentials/user-logo/Mask group-3.png" },
  { name: "Partner 5", src: "/credentials/user-logo/Mask group-4.png" },
];

const HAS_PARTNER_LOGOS = true;

// Doubled so the marquee's -50% translate loops back to logo 0 invisibly.
// Spacing must be a margin carried by EVERY item (no flex gap): with a gap
// the track's two halves measure half a gap apart and the loop visibly jumps.
const TRACK = [...PARTNERS, ...PARTNERS];

/**
 * Partner logo strip scrolling smoothly to the left in an endless loop.
 * The soft mask at both edges lets logos fade in/out instead of clipping
 * against the container. Layout-only margins stay at the call site via
 * className.
 */
export function PartnerLogos({ className = "" }) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <ul className="animate-marquee-logos flex w-max items-center">
        {TRACK.map((partner, index) => (
          <li
            key={`${partner.name}-${index}`}
            className="mr-10 flex shrink-0 justify-center lg:mr-24"
            aria-hidden={index >= PARTNERS.length || undefined}
          >
            {HAS_PARTNER_LOGOS ? (
              <Image
                src={partner.src}
                alt={index < PARTNERS.length ? partner.name : ""}
                width={162}
                height={117}
                sizes="(min-width: 1024px) 157px, 112px"
                className="h-20 w-28 object-contain lg:h-[112.08px] lg:w-[156.713px]"
              />
            ) : (
              <span className="text-small text-navy/40 flex h-20 items-center text-center font-semibold">
                {partner.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
