import Link from "next/link";

/* One letter group of the A–Z index: the mark, a hairline under it, and the
 * names beneath.
 *
 * Shape-only — it takes an already-resolved list of `{ name, href }` and knows
 * nothing about where those hrefs came from.
 *
 * It used to serve the by-region view as well, through a `wide` variant that
 * laid a region's names out across the full measure instead of in a narrow
 * packed block. That view is now the globe alone, so the variant and the
 * `labelHref` that made a region mark a link to its own page have both gone
 * rather than being left as options nothing passes.
 */
export function IndexGroup({ id, label, destinations }) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      /* Clears whatever chrome is over this mark when the rail jumps to it,
         which is not the same stack at every width: the navbar's own height
         ladder (80 / 56 / 64 / 80) plus the 56px rail plus 16px of air —
         except on a phone, where the rail is NOT sticky and only the 80px bar
         is in the way. Hence the plain scroll-mt-24 base; using the 152px value
         there would drop the mark half a screen below the bar. Same purchase
         app/search/page.js makes for its results heading.

         `break-inside-avoid` is what keeps a group whole inside the parent's
         multi-column flow — without it a 13-name bucket splits across the
         column gap. */
      className="scroll-mt-24 sm:scroll-mt-[152px] lg:max-xl:scroll-mt-[128px] xl:max-2xl:scroll-mt-[136px] 2xl:scroll-mt-[152px] mb-10 break-inside-avoid lg:mb-[52px]"
    >
      <div className="border-b border-black/10 pb-3 lg:pb-[14px]">
        {/* A bare h2 carrying the h3 token's size rather than its own.
            Twenty-three letter marks at the h2 token's 65px is a shouting
            page, and the alternative — an h3 under an invisible h2 — buys a
            tidy outline with a heading nobody can see. So: the right level,
            drawn at the right size. The two band steps are stated by hand
            because a `text-*` utility is generated from an `@theme inline`
            token and never sees the 1024–1535 downscale in globals.css that
            bare tags get for free (see SectionHeading.jsx). */}
        <h2
          id={headingId}
          className="text-h3 text-navy lg:max-xl:text-[22px] xl:max-2xl:text-[25px] tracking-normal"
        >
          {label}
        </h2>
      </div>

      <ul className="mt-4 space-y-2.5 lg:mt-[22px] lg:space-y-3">
        {destinations.map((destination) => (
          <li key={destination.name}>
            <Link
              href={destination.href}
              /* The country-link treatment from the navbar's region grid —
                 navy settling to sky — with two deliberate differences. The
                 weight stays at the body token's 300 rather than the menu's
                 400: a menu row has to hold against a busy sheet, an index
                 page wants the lighter cut. And the focus ring is present,
                 spelled out from FrameButton's shared base; the menu's country
                 links carry none, and that gap should not scale to 110 links.

                 The band steps are mandatory here for the same reason as the
                 mark above: text-body pins at 18px through 1280–1535 where the
                 scale says 15. */
              className="text-body text-navy hover:text-sky focus-visible:outline-sky lg:max-xl:text-[14px] xl:max-2xl:text-[15px] 2xl:text-body block leading-tight font-light transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {destination.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
