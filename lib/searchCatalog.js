import { DESTINATION_REGIONS } from "@/lib/navigation";
import { sortKey } from "@/lib/destinationsAZ";
import { TRIP_TYPES, getTripType } from "@/lib/tripTypes";

/* Catalogue behind /search — the pure, synchronous half.
 *
 * NAMES come from lib/navigation.js: the same thirteen regions and 110
 * countries the navbar's Destinations menu and /destinations/a-z draw from, so
 * this module owns no place names of its own. A country listed under several
 * regions (Mauritius, Sri Lanka …) is folded to one card that remembers every
 * region it sits in, and a continent filter matches any of them.
 *
 * Nothing here touches Strapi, because SearchToolbar (a client component)
 * imports the filter groups. Pictures and links are attached on the server by
 * getSearchResults() in lib/strapi/search.js.
 */

// Filter groups render left to right in the toolbar in this order — the
// design's three cells — and each `key` is also its URL param:
// /search?country=Kenya&style=luxury&package=grand-egyptian-tour.
// An option is either a plain string (value and label the same) or
// { value, label } where the URL carries something other than what prints —
// the trip types use their Strapi slug (/search?style=adventure).
export const FILTER_GROUPS = [
  {
    key: "country",
    label: "Destinations",
    allLabel: "All destinations",
    // Filled below once the fold has run; listed here so the toolbar can treat
    // every group the same way.
    options: [],
  },
  {
    key: "style",
    label: "Experiences",
    allLabel: "All experiences",
    options: TRIP_TYPES.map((type) => ({ value: type.key, label: type.label })),
  },
  {
    key: "package",
    label: "Popular Packages",
    allLabel: "All packages",
    // Packages live in the CMS, so this list is fetched on the server and
    // handed to the toolbar — see withPackageOptions() and
    // getPackageOptions() in lib/strapi/search.js.
    options: [],
    // Not drawn in the rail for now. The param still filters and still shows
    // as a removable chip, so a /search?package=… link keeps working; flip
    // this to bring the cell back.
    hidden: true,
  },
];

/* The groups with the CMS-fed package list filled in. The toolbar (a client
   component) receives the options as a prop and calls this, so the static
   groups above never have to know about Strapi. */
export function withPackageOptions(packageOptions = []) {
  return FILTER_GROUPS.map((group) =>
    group.key === "package" ? { ...group, options: packageOptions } : group,
  );
}

/* One entry per distinct country, alphabetical, carrying every region it
   belongs to along with the tagline the menu prints under it. The shape is
   what resolveDestinationHref() in lib/destinationsAZ.js expects. */
function collectCountries() {
  const byName = new Map();

  for (const region of DESTINATION_REGIONS) {
    for (const place of region.countries) {
      const membership = {
        key: region.key,
        label: region.label,
        regionHref: region.href,
        countryHref: place.href,
      };
      const entry = byName.get(place.name);

      if (entry) {
        entry.regions.push(membership);
        continue;
      }

      byName.set(place.name, {
        slug: place.href.split("/").filter(Boolean).pop() ?? "",
        name: place.name,
        tagline: place.tagline,
        regions: [membership],
      });
    }
  }

  return [...byName.values()].sort((a, b) =>
    sortKey(a.name).localeCompare(sortKey(b.name), "en", {
      sensitivity: "base",
    }),
  );
}

export const COUNTRIES = collectCountries();

const COUNTRY_GROUP = FILTER_GROUPS.find((group) => group.key === "country");
COUNTRY_GROUP.options = COUNTRIES.map((country) => country.name);

/* The value a URL param carries and the text an option prints. */
export function optionValue(option) {
  return typeof option === "string" ? option : option.value;
}
export function optionLabel(option) {
  return typeof option === "string" ? option : option.label;
}

/* What an active chip should print for a param — the trip type's name rather
   than its slug, the package's title rather than its slug. Falls back to the
   raw value for anything unrecognised. */
export function labelFor(groups, key, value) {
  const group = groups.find((g) => g.key === key);
  const option = group?.options.find((o) => optionValue(o) === value);
  return option ? optionLabel(option) : value;
}

function fold(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/* Region labels are searchable, so ?term=africa lists every African country
   even though no card carries the word. */
function haystack(country) {
  return fold(
    [
      country.name,
      country.tagline,
      ...country.regions.map((region) => region.label),
    ].join(" "),
  );
}

/* Every filter is optional and they AND together. `term` matches each
   whitespace-separated word independently, so "africa safari" narrows rather
   than looking for that exact phrase. */
export function filterCountries({
  term,
  continent,
  country: countryName,
  style,
  /* "<region>/<slug>" keys the chosen package is sold for, resolved on the
     server from the CMS. undefined means no package filter; an empty set is
     a package that matches nothing. */
  packageKeys,
} = {}) {
  const words = fold(term).trim().split(/\s+/).filter(Boolean);
  // An unknown style is ignored rather than matching nothing — see tripTypes.
  const tripType = getTripType(style);

  return COUNTRIES.filter((country) => {
    if (continent && !country.regions.some((r) => r.label === continent))
      return false;
    if (countryName && fold(country.name) !== fold(countryName)) return false;
    if (tripType && !tripType.countries.includes(country.name)) return false;
    if (
      packageKeys &&
      !country.regions.some((r) => packageKeys.has(`${r.key}/${country.slug}`))
    )
      return false;
    if (!words.length) return true;

    const text = haystack(country);
    return words.every((word) => text.includes(word));
  });
}

const REGION_LABELS = new Map(
  DESTINATION_REGIONS.map((region) => [region.key, region.label]),
);

// CMS countries can live under a region the menu does not have (/india/goa).
const REGION_ALIASES = { india: "indian-subcontinent" };

export function regionLabel(key) {
  return REGION_LABELS.get(REGION_ALIASES[key] ?? key);
}

// CMS names drop the article the menu keeps: "Maldives" is "The Maldives".
const nameKey = (name) => fold(sortKey(name ?? ""));
const COUNTRIES_BY_SLUG = new Map(COUNTRIES.map((c) => [c.slug, c]));
const COUNTRIES_BY_NAME = new Map(COUNTRIES.map((c) => [nameKey(c.name), c]));

/* Whether a destination outside the catalogue passes the filters. Needs a
   region, since that is the first segment of its URL. */
export function entryMatches(entry, { term, continent, country, packageKeys }) {
  const label = regionLabel(entry.region);
  if (!entry.region) return false;
  if (continent && label !== continent) return false;
  if (country && fold(entry.name) !== fold(country)) return false;
  if (packageKeys && !packageKeys.has(`${entry.region}/${entry.slug}`))
    return false;

  const words = fold(term).trim().split(/\s+/).filter(Boolean);
  const text = fold([entry.name, entry.tagline, label].join(" "));
  return words.every((word) => text.includes(word));
}

/* Whether a picked package passes the filters, judged by the country or
   region its URL sits under (/destinations/<destination>/<slug>). */
export function packageMatches(pack, { term, continent, country }) {
  const home = COUNTRIES_BY_SLUG.get(pack.destination);
  const labels = home
    ? home.regions.map((region) => region.label)
    : [regionLabel(pack.destination)].filter(Boolean);

  if (country && fold(home?.name) !== fold(country)) return false;
  if (continent && !labels.includes(continent)) return false;

  const words = fold(term).trim().split(/\s+/).filter(Boolean);
  const text = fold(
    [pack.name, pack.tagline, pack.duration, pack.destination, home?.name, ...labels].join(" "),
  );
  return words.every((word) => text.includes(word));
}

/**
 * The destinations a travel style picked, in place of its lib/tripTypes.js
 * list: exactly its countries, in the order given. Only a style with no
 * countries picked lists its continents instead, alphabetical. The remaining
 * filters still AND on top.
 *
 * @param {{ countries: {name, slug, region, tagline?}[], continents: string[] }} selection
 * @returns {({ country } | { entry })[]} a catalogue country, or the picked
 *   entry itself when the catalogue has no such country (a cruise, Dubai).
 */
export function pickStyleCountries(selection, { style, ...filters } = {}) {
  const allowed = new Set(filterCountries(filters));
  const seen = new Set();
  const picks = [];

  for (const entry of selection.countries) {
    const country =
      COUNTRIES_BY_SLUG.get(entry.slug) ?? COUNTRIES_BY_NAME.get(nameKey(entry.name));
    const slug = country?.slug ?? entry.slug;
    if (seen.has(slug)) continue;
    seen.add(slug);

    if (country) {
      if (allowed.has(country)) picks.push({ country });
    } else if (entryMatches(entry, filters)) {
      picks.push({ entry });
    }
  }

  if (selection.countries.length) return picks;

  const continents = new Set(selection.continents);
  for (const country of COUNTRIES) {
    if (seen.has(country.slug) || !allowed.has(country)) continue;
    if (!country.regions.some((region) => continents.has(region.key))) continue;
    seen.add(country.slug);
    picks.push({ country });
  }

  return picks;
}
