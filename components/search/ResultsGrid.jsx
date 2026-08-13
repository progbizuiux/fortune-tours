import Image from "next/image";
import Link from "next/link";
import { AnimateIn } from "@/components/common/AnimateIn";

// Must track the grid below: 4 columns at xl, 3 at lg, 2 at sm, 1 on phones.
// Wrong values here cost bandwidth silently — the layout still looks right, the
// browser just fetches the wrong size — so these move together.
const CARD_SIZES =
  "(min-width: 1280px) 23vw, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, calc(100vw - 2rem)";

/* Results for /search. Card proportions come from the design frame: a near
   square 433:412 image, the name in Neiko at 24px, the line of copy under it in
   Poppins Light — the same card the atlas strip on the home page uses, widened
   for a four-up grid.
   The trailing period is added here rather than stored on the name, so the same
   value can be reused as a filter chip label or a search match. */
export function ResultsGrid({ journeys }) {
  if (!journeys.length) {
    return (
      <div className="border-navy/15 mt-16 border px-6 py-20 text-center lg:mt-24">
        {/* leading-tight because the h3 token's line-height is exactly 1: this
            sentence wraps to two lines on a phone, and at 1.0 the descenders of
            the first line touch the caps of the second. */}
        <p className="font-heading text-h3 text-navy leading-tight">
          No journeys match those filters.
        </p>
        <p className="text-navy/70 mx-auto mt-4 max-w-md">
          Try a different search term, or clear a filter to widen the results.
        </p>
      </div>
    );
  }

  return (
    <AnimateIn
      as="ul"
      stagger={0.1}
      y={36}
      className="mt-16 grid grid-cols-1 gap-x-3 gap-y-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 xl:grid-cols-4"
    >
      {journeys.map((journey) => (
        <li key={journey.slug}>
          <Link href={`/destinations/${journey.slug}`} className="group block">
            <div className="bg-navy/5 relative aspect-[433/412] w-full overflow-hidden">
              <Image
                src={journey.image}
                alt={journey.name}
                fill
                sizes={CARD_SIZES}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <h3 className="font-heading group-hover:text-sky text-navy mt-4 text-[24px] leading-none transition-colors">
              {journey.name}.
            </h3>
            <p className="mt-2 text-[16px] leading-6 font-light text-black/80">
              {journey.description}
            </p>
          </Link>
        </li>
      ))}
    </AnimateIn>
  );
}
