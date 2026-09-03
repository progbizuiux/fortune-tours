import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { InspirationBanner } from "@/components/search/InspirationBanner";
import { ResultsGrid } from "@/components/search/ResultsGrid";
import { SearchToolbar } from "@/components/search/SearchToolbar";
import { getInspiration } from "@/lib/inspirationData";
import { getTravelStyle, toInspiration } from "@/lib/strapi/travel-styles";
import { getPackageOptions, getSearchResults } from "@/lib/strapi/search";

// The band's caret points at the results, so the link needs a target to reach
// and the results need to clear the fixed navbar when it lands.
const RESULTS_ID = "journeys";

// A repeated param (?destination=India&destination=Japan) arrives as an array.
// Each group holds one value, so take the first and ignore the rest rather than
// letting an array reach a string comparison and silently match nothing.
function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }) {
  const term = first((await searchParams).term)?.trim();

  return {
    title: term ? `Search: ${term}` : "Search",
    description:
      "Search Fortune Travels destinations, experiences and packages to find your perfect stay.",
    // Filtered permutations are near-infinite and thin — one canonical entry
    // point is what belongs in the index.
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const experience = first(params.experience);

  // Real continents and countries from lib/navigation.js, with pictures and
  // links resolved against Strapi — see lib/strapi/search.js.
  const [journeys, packageOptions] = await Promise.all([
    getSearchResults({
      term: first(params.term),
      continent: first(params.continent),
      country: first(params.country),
      style: first(params.style),
      pkg: first(params.package),
    }),
    getPackageOptions(),
  ]);

  /* The band follows whichever theme the URL names. `?style=` comes from the
     travel-style cards on the destination pages and is answered from the CMS;
     `?experience=` is the older filter-driven path and still resolves from
     lib/inspirationData. A style that no longer exists falls through to the
     experience band rather than rendering an empty one.

     Fetched only when the param is present, so the unfiltered page does not
     pay for a request it will not use. */
  const style = await getTravelStyle(first(params.style));

  // Re-themes with the experience filter, so the band never contradicts the
  // results underneath it.
  const inspiration = style ? toInspiration(style) : getInspiration({ experience });

  return (
    <>
      {/* The navbar is transparent with a white logo until an element marked
          like this crosses under it — over the hero video that is the point,
          but on a white page it would leave the logo invisible at the top of
          the scroll. A zero-height marker at the document top starts it solid
          and keeps it there. */}
      <div data-navbar-solid-from aria-hidden="true" />

      <InspirationBanner inspiration={inspiration} ctaHref={`#${RESULTS_ID}`} />

      {/* scroll-mt clears the fixed 80px navbar, which would otherwise sit over
          the heading when the caret above jumps here. */}
      <section
        id={RESULTS_ID}
        className="scroll-mt-24 pt-20 pb-24 lg:pt-28 lg:pb-32"
      >
        <Container>
          <AnimateIn stagger={0.12} className="flex flex-col">

            {/* h2, not h1 — the banner above carries this page's only h1. The
                text-h1 class keeps the size it has always had, so this is a
                document-outline fix and nothing more. */}
            <h2 className="text-h2 text-navy max-lg:capitalize max-lg:text-[30px] max-lg:leading-[120%] max-lg:tracking-[0px]">Explore relaxing journeys</h2>
            <p className="text-navy/70 mt-[14px] max-lg:mt-[6px] max-lg:font-light max-lg:text-[14px] max-lg:leading-[100%] max-lg:tracking-[0px] max-lg:text-black/80">
              Find your perfect stay anywhere in the world.
            </p>
          </AnimateIn>

          <SearchToolbar
            className="mt-10 lg:mt-12"
            packageOptions={packageOptions}
          />

          <ResultsGrid journeys={journeys} />
        </Container>
      </section>
    </>
  );
}
