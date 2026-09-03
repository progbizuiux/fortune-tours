import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { AlphabetRail } from "./AlphabetRail";
import { DestinationIndexTabs } from "./DestinationIndexTabs";
import { IndexGroup } from "./IndexGroup";
import { RegionGlobe } from "./RegionGlobe";
import {
  DESTINATION_COUNT,
  REGION_COUNT,
  getAlphabet,
  getDestinationGroups,
  resolveDestinationHref,
} from "@/lib/destinationsAZ";
import { HERO_BODY, HERO_HEADING } from "@/lib/typography";
import { cn } from "@/lib/utils";

/* The destinations index — every place Fortune travels, on one page, ordered
 * two ways.
 *
 * A gazetteer rather than a landing page: cream paper, navy ink, Neiko marks
 * over hairlines, and nothing on it that is not a name you can follow. The
 * reference frame this was drawn from opens on a pair of tabs over columns of
 * letter-grouped names, and that is the shape kept — rendered in Fortune's own
 * type and palette rather than the reference's.
 *
 * A server component, and everything below the tab row is server-rendered
 * markup handed to the client leaf as nodes. See DestinationIndexTabs.
 */
export function DestinationIndex({ published }) {
  const letterGroups = getDestinationGroups();

  const tabs = [
    {
      key: "a-z",
      label: "A to Z",
      panel: (
        <>
          <AlphabetRail
            letters={getAlphabet()}
            className="mb-10 lg:mb-[52px]"
          />

          {/* A multi-column flow, not a grid of blocks. The letter buckets run
              from one name (D, H, K, O, Q, V) to thirteen (M and S), and a
              row-major grid sizes every row to its tallest cell — a row
              holding M beside D would leave most of a screen empty under the
              D. Columns pack them tight and read down-then-across, which is
              both how a printed index reads and, checked against the frame
              this follows, how its own columns run: A, B, C down the first
              before F opens the second. */}
          {/* Two columns from the smallest screen up, then three and four as
              the frame allows. Two on a phone is a deliberate trade: it halves
              a 110-name scroll, at the cost of the four longest names — "St
              Vincent and the Grenadines" and its like — taking two lines in a
              ~162px column. In an index that reads as a wrapped entry rather
              than as breakage, and the shorter scroll is worth more here than
              a guarantee that every name sits on one line.

              The gutter is tightened to 20px on a phone for the same reason:
              it is width the columns can use, and at this size the rule the
              wider gaps draw between columns is not doing any work.

              It stops at four. A fifth was tried and dropped — at 2xl it makes
              the columns 232px and the long names wrap there too, where there
              is no scroll-length argument to justify it, and the frame this
              follows draws four. Above 1536 the four simply grow. */}
          <div className="columns-2 gap-x-5 sm:gap-x-8 lg:columns-3 lg:gap-x-10 xl:columns-4 xl:gap-x-[50px]">
            {letterGroups.map((group) => (
              <IndexGroup
                key={group.letter}
                id={`az-letter-${group.letter.toLowerCase()}`}
                label={group.letter}
                destinations={group.destinations.map((destination) => ({
                  name: destination.name,
                  href: resolveDestinationHref(destination, published),
                }))}
              />
            ))}
          </div>
        </>
      ),
    },
    {
      key: "regions",
      label: "By Region",
      /* This view is the map, and only the map. It carried the thirteen
         regions as lists of names underneath, and those are gone: every one of
         those 149 rows was a second printing of a name the A to Z already
         carries — 110 distinct places between them — so the page was saying
         everything twice.

         The globe is a `lead` rather than a `panel` so it mounts only once the
         tab is opened; see DestinationIndexTabs. There is no `panel` now,
         which the tabs component renders as nothing. */
      lead: <RegionGlobe />,
    },
  ];

  return (
    <div className="bg-cream">
      {/* Explicit paddings rather than the shared `spacing` rule: that one is
          written for a stacked rhythm of sections and steps DOWN at 1024, and
          this is a masthead that has to clear the fixed navbar at every width. */}
      <Container className="pt-28 pb-24 md:pt-36 md:pb-28 lg:pt-[190px] lg:pb-[120px]">
        <AnimateIn stagger={0.12} className="flex flex-col">
          <span
            /* The eyebrow ladder as SectionHeading states it, so the two can
               never drift. */
            className="font-top text-navy/45 max-lg:text-[12px] max-lg:leading-none lg:max-xl:text-[13.5px] xl:max-2xl:text-[15px] 2xl:text-h4 tracking-[0.08em] uppercase"
          >
            The Gazetteer
          </span>

          {/* HERO_HEADING, not a bare `text-h1`: the token compiles to its
              literal clamp on a utility and would draw 85px on a 1280 laptop
              where the scale says 58. */}
          <h1
            className={cn(HERO_HEADING, "text-navy mt-5 max-w-[900px] lg:mt-7")}
          >
            Every destination, A to Z
          </h1>

          <p
            className={cn(
              HERO_BODY,
              "text-navy/60 mt-5 max-w-[640px] font-light lg:mt-8",
            )}
          >
            Every place Fortune travels, set out the way an index sets things
            out — by letter, or by the part of the world it belongs to.
          </p>
        </AnimateIn>

        {/* Deliberately NOT wrapped in <AnimateIn>. The reveal leaves a GSAP
            transform on its wrapper, and a transformed ancestor becomes the
            containing block for everything inside it — which would pin the
            sticky letter rail to this wrapper instead of the viewport and let
            it scroll away with the page. The masthead above is the whole
            motion budget; the index itself is simply there when you arrive,
            which is also the right register for a page you came to look
            something up in. */}
        <DestinationIndexTabs
          tabs={tabs}
          label="How to browse destinations"
          className="mt-10 lg:mt-[55px]"
        />

        {/* The rule that closes a printed index. Both numbers are derived, so
            the line cannot fall out of step with the list above it. */}
        <p className="font-top text-navy/40 mt-16 border-t border-black/10 pt-6 text-[13px] tracking-[0.08em] lg:mt-[80px]">
          {DESTINATION_COUNT} destinations across {REGION_COUNT} regions
        </p>
      </Container>
    </div>
  );
}
