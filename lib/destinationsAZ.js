import { DESTINATION_REGIONS } from "@/lib/navigation";

/* The index behind /destinations/a-z.
 *
 * Derived from DESTINATION_REGIONS, never a second copy of it. That list is
 * already the single source the navbar's Destinations menu draws from, so a
 * place added there appears here on the same edit and this module owns no
 * place names of its own.
 *
 * Two things the raw list cannot be rendered as-is, and one that only the CMS
 * can answer:
 *
 * DUPLICATES. A country deliberately sits under several regions there —
 * Mauritius under Africa, Asia and the Indian Ocean; Sri Lanka under Asia, the
 * Indian Ocean and the Indian subcontinent. The thirteen regions hold 149 rows
 * between them but only 110 distinct places. An alphabetical index prints one
 * line per place, so the rows are folded to one entry per name here, keeping
 * every region the name appeared under — which is what lets a name still be
 * linked to whichever of its regions actually has a page.
 *
 * SORTING. The list stores display names, and seven lead with an article —
 * "The Maldives", "The Seychelles", "The USA". Sorted on the raw string they
 * all pile under T. sortKey() drops the article and folds the accents so
 * "The Maldives" files under M and "Réunion Island" under R, while both still
 * PRINT in full.
 *
 * WHICH REGION A NAME LINKS TO. Not decided here. A country page only exists
 * where a Strapi entry names the region AND the country, so the honest answer
 * depends on what is published — see resolveDestinationHref(), which the page
 * calls with the published set.
 */

/* The letter rail draws the whole alphabet and greys the letters nothing files
   under — W, X and Y today. Derived per render rather than hardcoded, so a
   Western Sahara added to lib/navigation.js lights its letter on its own. */
export const ALPHABET = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i),
);

/* Fold the accents and drop the leading article, so a name files under the
   letter a reader would look for it under.
 *
 * NFD splits "é" into "e" plus a combining acute, which the range then strips;
 * without it "Réunion Island" sorts after every plain-R name, because U+00E9
 * is above every ASCII letter. The article is dropped after the fold so the
 * two rules cannot interact.
 *
 * The result is a sort key only. `name` is always what prints — never
 * "Maldives, The". */
export function sortKey(name) {
  return String(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^the\s+/i, "")
    .trim();
}

/* The letter a name files under. "#" for anything not starting with a letter —
   nothing does today, and the group would otherwise be headed by a digit. */
function letterFor(name) {
  const first = sortKey(name).charAt(0).toUpperCase();
  return first >= "A" && first <= "Z" ? first : "#";
}

/* The last segment of "/africa/mauritius" — the country slug lib/navigation.js
   derived with its own slugify(). Read back off the href rather than
   re-slugified here, so this module cannot disagree with the one the navbar
   links to (including its quirks: "Réunion Island" is `r-union-island`). */
function slugOf(href) {
  return href.split("/").filter(Boolean).pop() ?? "";
}

/* One entry per distinct destination, carrying EVERY region it belongs to
   along with both hrefs that region offers: the country page and, as the
   always-live fallback, the region page itself. Which of them a name actually
   links to is resolveDestinationHref()'s decision, made against the CMS. */
function collectDestinations() {
  const byName = new Map();

  for (const region of DESTINATION_REGIONS) {
    for (const place of region.countries) {
      const entry = byName.get(place.name);
      const membership = {
        key: region.key,
        label: region.label,
        regionHref: region.href,
        countryHref: place.href,
      };

      if (entry) {
        entry.regions.push(membership);
        continue;
      }

      byName.set(place.name, {
        name: place.name,
        slug: slugOf(place.href),
        sortKey: sortKey(place.name),
        letter: letterFor(place.name),
        regions: [membership],
      });
    }
  }

  /* localeCompare, never `<`. A code-point comparison files "Réunion Island"
     after Rwanda; this gives the R order a reader expects. The locale is
     stated rather than left to the runtime default, because this module is
     evaluated on the server and in the browser and an unstated ICU default is
     a hydration mismatch waiting to happen. */
  return [...byName.values()].sort((a, b) =>
    a.sortKey.localeCompare(b.sortKey, "en", { sensitivity: "base" }),
  );
}

/* Built once per module load: the input is a literal in lib/navigation.js, so
   the result cannot differ between calls and every render would otherwise redo
   the same 149-row fold. */
const DESTINATIONS = collectDestinations();

const GROUPS = DESTINATIONS.reduce((groups, destination) => {
  const group = groups.at(-1);

  if (group?.letter === destination.letter)
    group.destinations.push(destination);
  else groups.push({ letter: destination.letter, destinations: [destination] });

  return groups;
}, []);

const ACTIVE_LETTERS = new Set(GROUPS.map((group) => group.letter));

/* Every distinct destination, alphabetical. */
export function getDestinations() {
  return DESTINATIONS;
}

/* The same list cut into letter groups — [{ letter: "A", destinations: [...] }].
   Letters with nothing behind them are absent rather than present and empty,
   so the layout never draws a mark with no list under it. */
export function getDestinationGroups() {
  return GROUPS;
}

/* The alphabet, each letter flagged with whether anything files under it. The
   rail renders a jump link for the populated ones and inert type for the rest. */
export function getAlphabet() {
  return ALPHABET.map((letter) => ({
    letter,
    populated: ACTIVE_LETTERS.has(letter),
  }));
}

/**
 * Where a destination's name should link.
 *
 * A country page exists only where a Strapi `countries` entry names BOTH the
 * region and the country — app/[slug]/[country]/page.js calls notFound() on
 * anything else — so this cannot be answered from lib/navigation.js alone, and
 * a fixed rule about which region "owns" a place gets it wrong either way.
 * Twenty-nine countries are published today and they follow no such rule:
 * Canada, Finland, Norway and Sweden are published under `arctic-circle`
 * rather than the region a reader would guess, while French Polynesia is
 * published under `south-pacific` rather than the `australasia-oceania` it is
 * listed under first. Any hand-written "the umbrella region yields to the
 * narrower one" table breaks one set of those to fix the other.
 *
 * So the published entry decides. The first region with a live country page
 * wins; a name with none falls back to its first region's own page, which
 * always renders (app/[slug]/page.js resolves all thirteen keys and falls back
 * to shipped copy). That is why an unpublished destination lands the reader on
 * a real page about the part of the world it sits in rather than on a 404, and
 * why every name starts pointing at its own page the moment an editor
 * publishes it, with no edit here.
 *
 * @param {object} destination  an entry from getDestinations()
 * @param {Set<string>} published  "<regionKey>/<countrySlug>" for every
 *   published country — build it from getCountryParams(). An empty set (Strapi
 *   unreachable) degrades every link to its region page rather than throwing.
 */
export function resolveDestinationHref(destination, published) {
  const live = destination.regions.find((region) =>
    published?.has(`${region.key}/${destination.slug}`),
  );

  return live ? live.countryHref : destination.regions[0].regionHref;
}

/* Printed in the page's closing line, so the copy cannot fall out of step with
   the list above it. */
export const DESTINATION_COUNT = DESTINATIONS.length;
export const REGION_COUNT = DESTINATION_REGIONS.length;
