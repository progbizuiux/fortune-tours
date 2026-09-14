import { JournalIndex } from "@/components/journal/JournalIndex";
import { getJournalIndex } from "@/lib/journal";

/* The journal archive — /journal, the destination the navbar's "Journal" link
   has been pointing at (components/layout/Navbar.jsx).

   Content comes from lib/journal.js rather than Strapi: there is no journal
   content type on the panel yet, and app/api/journal/route.js serves the HOME
   page's three-card strip rather than an archive. That module is the only seam
   — see its header for what changes when the collection lands.

   The page stays a server component; only the filtering and paging need the
   browser, and those live in JournalIndex. */

/* ISR on the same terms as the rest of the app. Must be a literal: Next reads
   this statically at build time, so it cannot be DEFAULT_REVALIDATE from
   lib/strapi/client.js. */
export const revalidate = 3600;

export const metadata = {
  /* Bare title on purpose — the root layout carries a
     `template: "%s | Fortune Travels"`, so adding the suffix here would print
     it twice. */
  title: "Journal",
  description:
    "Stories, guides and ideas for your next journey — remarkable places, unforgettable landscapes and experiences curated for the way you love to travel.",
};

export default function JournalPage() {
  const page = getJournalIndex();

  return (
    <>
      {/* The navbar starts transparent and turns solid when the element marked
          here slides under it, so that white nav text can sit over a dark hero.
          This page opens on the white masthead instead, where that same white
          text and white logo are invisible until the reader happens to scroll.
          A zero-height marker at the document top is already under the bar at
          rest, so the navbar is solid from first paint and stays there — the
          same fix app/search/page.js and components/experiences/ExperienceHero.jsx
          use, and the reason it is a marker rather than a prop on the navbar. */}
      {/* `data-navbar-ink` rides on the same marker: this page's masthead is
          black on white, and the bar's usual navy links read as a different,
          softer ink beside it. The rule is in app/globals.css. */}
      <div data-navbar-solid-from data-navbar-ink="black" aria-hidden="true" />

      <JournalIndex {...page} />
    </>
  );
}
