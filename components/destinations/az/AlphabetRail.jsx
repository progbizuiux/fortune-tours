import { cn } from "@/lib/utils";

/* The thumb-index down the side of a printed gazetteer, laid flat: A to Z, each
 * live letter jumping to its group.
 *
 * Deliberately no client code. These are native `<a href="#…">` anchors and the
 * offset they land at is CSS (`scroll-mt-*` on each group in IndexGroup),
 * exactly as the caret on /search jumps to its results. That means the rail
 * works before hydration and with JavaScript off, which matters more here than
 * anywhere else on the site: it is this page's only affordance.
 *
 * Sticky from `sm` up, offset by the navbar's own height ladder — the header is
 * `h-20 lg:max-xl:h-14 xl:max-2xl:h-16 2xl:h-20`, so these tops mirror it band
 * for band. Get one wrong and the rail hides under the bar at exactly that
 * width and nowhere else. `bg-cream` is load-bearing rather than decorative: a
 * see-through sticky bar lets the letter groups scroll up through it.
 *
 * Not sticky on a phone. Two rows of 44px cells under an 80px bar is a fifth of
 * an 812px screen given over to chrome. It still RENDERS there — 110 names with
 * no way to move through them is the worse failure — it just scrolls away.
 */
export function AlphabetRail({ letters, className }) {
  return (
    <nav
      aria-label="Jump to a letter"
      className={cn(
        "bg-cream border-y border-black/10",
        "sm:sticky sm:top-20 lg:max-xl:top-14 xl:max-2xl:top-16 2xl:top-20 sm:z-20",
        className,
      )}
    >
      {/* A grid rather than a wrapping flex row: wrapped flex spreads its last
          row unevenly, and a thumb-index is even by definition. Two rows of
          thirteen on a phone, one row of twenty-six from sm. */}
      <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] sm:grid-cols-[repeat(26,minmax(0,1fr))]">
        {letters.map(({ letter, populated }) =>
          populated ? (
            <a
              key={letter}
              href={`#az-letter-${letter.toLowerCase()}`}
              /* min-h-11 buys the 44px touch target the width cannot: at
                 375px a thirteen-column row leaves about 26px per cell. */
              className="font-top text-navy/60 hover:text-sky focus-visible:outline-sky flex min-h-11 items-center justify-center text-[13px] tracking-[0.08em] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 lg:text-[14px]"
            >
              {letter}
            </a>
          ) : (
            /* W, X and Y. Inert type, never an anchor to a group that does not
               exist. Deliberately carries neither aria-hidden — the gaps in the
               alphabet are meaningful, and hiding them would tell a screen
               reader the alphabet is twenty-three letters long — nor
               aria-disabled, which would claim these are controls when they are
               just printed letters. */
            <span
              key={letter}
              className="font-top text-navy/25 flex min-h-11 items-center justify-center text-[13px] tracking-[0.08em] lg:text-[14px]"
            >
              {letter}
            </span>
          ),
        )}
      </div>
    </nav>
  );
}
