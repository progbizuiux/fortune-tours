import { DestinationIndex } from "@/components/destinations/az/DestinationIndex";
import { getCountryParams } from "@/lib/strapi/country";

/* /destinations/a-z — the A to Z of destinations.
 *
 * A static segment beside app/destinations/[slug]/page.js. Static wins over a
 * sibling dynamic segment in Next's matcher, so this resolves here and never
 * reaches the destination route; and that route does not set
 * `dynamicParams = false`, so nothing about its allowlist is involved either.
 *
 * This is the page ALL_DESTINATIONS_LINK in lib/navigation.js points at — the
 * "A to Z Destination" row that closes the navbar's region list, in both the
 * desktop sheet and the mobile drill-down. It used to land on /search.
 */

/* ISR on the same terms as the rest of the app: cached until POST
   /api/revalidate fires on publish, with this window as the backstop. Must be
   a literal — Next reads it statically at build time. */
export const revalidate = 3600;

/* Bare title; the root layout carries the "%s | Fortune Travels" template.
 *
 * Deliberately WITHOUT /search's `robots: { index: false }`. That noindex is
 * there because its filtered permutations are near-infinite and thin. This
 * page is the opposite of that: one canonical URL carrying an internal link to
 * every destination the site has, which makes it the best crawl surface here.
 * Do not copy the /search metadata block onto it. */
export const metadata = {
  title: "A to Z of Destinations",
  description:
    "Every destination Fortune Travels journeys to, listed alphabetically and by region — from Anguilla to Zimbabwe.",
};

export default async function DestinationsAZPage() {
  /* Which country pages actually exist. A country route resolves only where a
     Strapi entry names BOTH the region and the country, so without this every
     name on the page would link to a country page and most would 404 — 29 of
     the 110 are published today. resolveDestinationHref() in
     lib/destinationsAZ.js turns this set into "its own page if it has one, its
     region's page if it does not", so nothing here has to know the rule.

     getCountryParams() returns [] rather than throwing when the collection is
     missing, so a build against an unreachable Strapi still renders the page
     with every name pointing at its region. */
  const params = await getCountryParams();
  const published = new Set(
    params.map((entry) => `${entry.slug}/${entry.country}`),
  );

  return (
    <>
      {/* The navbar is transparent with a white logo until an element marked
          like this crosses under it. There is no hero here, so a zero-height
          marker at the top of the document starts it solid and keeps it there
          — without it the logo would be invisible against the cream.

          If a hero is ever added to this page, this marker has to come out in
          the same change: CloudTransition emits the same attribute and the
          navbar resolves it with querySelector, taking the first match. */}
      <div data-navbar-solid-from aria-hidden="true" />

      <DestinationIndex published={published} />
    </>
  );
}
