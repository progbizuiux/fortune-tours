import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { FullContainer } from "@/components/common/FullContainer";
import { CloudTransition } from "@/components/home/CloudTransition";

// Drop matching files into public/destinations/ and the placeholder below is
// replaced automatically — no other change needed.
const DESTINATIONS = [
  {
    name: "Japan.",
    caption: "Temples, cities, blossoms.",
    href: "/destinations/japan",
    image: "/destination/japan.png",
  },
  {
    name: "Switzerland.",
    caption: "Wake up in the Alps.",
    href: "/destinations/switzerland",
    image: "/destination/switzerland.png",
  },
  {
    name: "India.",
    caption: "Where time slows.",
    href: "/destinations/india",
    image: "/destination/india.png",
  },
  {
    name: "Norway.",
    caption: "Chase northern lights.",
    href: "/destinations/norway",
    image: "/destination/norway.png",
  },
];

const HAS_IMAGES = true;

// Must track the grid below: 4 columns at lg, 2 at sm, 1 on phones.
const CARD_SIZES =
  "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 1rem)";

export function DestinationsSection() {
  return (
    // relative z-10 is required, not cosmetic: the hero is sticky (positioned),
    // so without a stacking position of its own this section would paint
    // underneath it instead of scrolling over it.
    <>
    <CloudTransition />
    <section className="bg-background relative z-10">
      {/* Vertical rhythm measured off the design: 40px above the eyebrow,
          24px to the heading, 12px to the sub-line, 56px down to the strip. */}
      <Container className="pt-10 text-center lg:pt-14">
        <p className="font-top text-h4 text-navy">Chapter 02 - Atlas</p>

        <h2 className="font-heading text-h3 text-navy mt-6">
          Where will your story start?
        </h2>

        <p className="text-caption text-navy/60 mx-auto mt-3 max-w-xl">
          Not destinations, but openings. Each place teaches us something.
        </p>
      </Container>

      <FullContainer>
        <ul className="mt-14 grid grid-cols-1 gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-4 lg:pb-24">
          {DESTINATIONS.map((destination) => (
            <li key={destination.href}>
              <Link href={destination.href} className="group block">
                {/* aspect-ratio instead of a fixed h-[590px]: at four columns on
                    a phone that height produced 78px-wide, 590px-tall slivers.
                    7/12 keeps the desktop card at ~583px, its original look. */}
                <div className="bg-navy/5 relative aspect-7/12 w-full overflow-hidden">
                  {HAS_IMAGES ? (
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      sizes={CARD_SIZES}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="from-navy/15 to-navy/5 absolute inset-0 flex items-center justify-center bg-gradient-to-br">
                      <span className="text-small text-navy/40">
                        {destination.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="font-sans text-small group-hover:text-sky text-navy font-semibold transition-colors">
                    {destination.name}
                  </h3>
                  <p className="text-micro text-navy/60 mt-1">
                    {destination.caption}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </FullContainer>
    </section>
    </>
  );
}
