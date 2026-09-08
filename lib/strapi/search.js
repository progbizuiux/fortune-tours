import { StrapiError, strapiFetch } from "./client";
import { COUNTRY_TAGS } from "./country";
import { DESTINATION_TAGS } from "./destination";
import { mediaUrl } from "./media";
import { list, slugify, text } from "./normalise";
import { resolveDestinationHref } from "@/lib/destinationsAZ";
import { homeRegionForCountry, regionKeysForCountry } from "@/lib/navigation";
import { COUNTRIES, filterCountries } from "@/lib/searchCatalog";

/* /search results — the server half of lib/searchCatalog.js.
 *
 * A card links to its own country page where one is published and to its
 * region's page otherwise (the same rule /destinations/a-z uses), and shows
 * the country's hero upload, then the tile the region grid draws for it, then
 * a design still. Two requests for the whole page rather than one per card.
 *
 * The "Popular Packages" filter is read off the same country entries: each
 * carries the packages sold for it in its packagesSection. That is the one
 * package list this app can reach — the standalone `packages` collection is
 * not readable with the current token — and it is what the country pages
 * themselves display, so the filter cannot offer a package no page sells.
 */

/* Design stills for a country nobody has photographed in the CMS yet. Rotated
   by position so a page of unfilled cards does not repeat one picture. */
const FALLBACK_IMAGES = [
  "/destination/india.avif",
  "/destination/japan.avif",
  "/destination/norway.avif",
  "/destination/switzerland.avif",
  "/destinations/africa.png",
];

/* Places the site features that no CMS region card carries yet, matched to a
   picture already in public/. Munnar is a hill station inside Kerala;
   Lakshadweep has its own package page rather than a region card. The wizard's
   rail shows these until an editor adds the place to a region grid with its own
   upload — a CMS card of the same name then wins and the line here can go. */
const FEATURED_LOCAL_PLACES = [
  {
    name: "Munnar",
    slug: "munnar",
    image: "/destinations/kerala/hill-stations.avif",
  },
  {
    name: "Lakshadweep",
    slug: "lakshadweep",
    image: "/destinations/lakshadweep-banner.jpg",
  },
];

/* Every published country with its hero picture and package titles, keyed
   "<region>/<slug>". [] on a missing or forbidden collection, so the page
   still renders with every card pointing at its region.

   Next memoises identical fetches within a render, so getPackageOptions() and
   getSearchResults() calling this in the same request costs one round trip. */
async function fetchPublishedCountries() {
  try {
    const json = await strapiFetch("countries", {
      query: {
        fields: ["slug", "continentSlug"],
        populate: {
          heroSection: { populate: { image: true } },
          packagesSection: { populate: { packages: { fields: ["title"] } } },
        },
        pagination: { pageSize: 200 },
      },
      tags: COUNTRY_TAGS,
    });

    return list(json?.data)
      .map((entry) => ({
        region: text(entry.continentSlug, ""),
        slug: text(entry.slug, ""),
        image: mediaUrl(entry.heroSection?.image, null),
        packages: list(entry.packagesSection?.packages)
          .map((pkg) => text(pkg.title, ""))
          .filter(Boolean),
      }))
      .filter((entry) => entry.slug)
      .flatMap(({ region, slug, ...rest }) => {
        /* One key per URL the country answers under — its home region plus
           every region lib/navigation.js lists it in — the same expansion
           getCountryParams() does, so a /search card and a navbar row never
           disagree about whether a page exists. The home region is flagged
           canonical, which is the URL the card links to. The hero image is
           stored under every key, so any of them finds it. */
        const home = homeRegionForCountry(slug, region);
        const regions = new Set([
          ...(home ? [home] : []),
          ...regionKeysForCountry(slug),
        ]);
        return [...regions].map((r) => ({
          key: `${r}/${slug}`,
          canonical: r === home,
          ...rest,
        }));
      });
  } catch (error) {
    if (error instanceof StrapiError) return [];
    throw error;
  }
}

/* Every card in every region grid, as { name, key, image }.
 *
 * This is the curated set an editor maintains on the region pages, and it is
 * richer than the country list in lib/navigation.js: the Indian Subcontinent
 * grid alone adds Kashmir, Kerala, Rajasthan, Ladakh, Gujarat, Hampi and a
 * dozen more, each with its own upload. getDestinations() draws on that to give
 * the plan-my-trip wizard a photograph for places that are not countries.
 *
 * `key` is "<region>/<slug>" — from the card's own link where it has one (so it
 * matches the keys getSearchResults() and getDestinations() build), and the
 * region plus the slugified name otherwise, the same rule getCountryCardImage()
 * in ./destination.js uses. `image` is null when the card carries no upload. */
async function fetchRegionCards() {
  try {
    const json = await strapiFetch("continents", {
      query: {
        fields: ["slug"],
        populate: {
          countriesSection: {
            populate: { countries: { populate: { image: true } } },
          },
        },
        pagination: { pageSize: 50 },
      },
      tags: DESTINATION_TAGS,
    });

    const cards = [];
    for (const region of list(json?.data)) {
      const regionSlug = text(region.slug, "");
      for (const card of list(region.countriesSection?.countries)) {
        const name = text(card.name, "");
        if (!name) continue;

        const link = text(card.link, "").replace(/\/$/, "");
        const key = link.startsWith("/")
          ? link.slice(1)
          : `${regionSlug}/${slugify(name)}`;
        cards.push({ name, key, image: mediaUrl(card.image, null) });
      }
    }
    return cards;
  } catch (error) {
    if (error instanceof StrapiError) return [];
    throw error;
  }
}

/* The picture each region grid shows for each of its countries, keyed
   "<region>/<slug>" — the shape getSearchResults() looks a country up by.
   Cards with no upload are dropped, so a `.get()` miss means "no picture". */
async function fetchRegionCardImages() {
  const images = new Map();
  for (const card of await fetchRegionCards()) {
    if (card.image) images.set(card.key, card.image);
  }
  return images;
}

/* Every package title the published countries sell, as { value, label,
   keys }: the slug the URL carries, the title that prints, and the country
   keys it belongs to. A title sold under two countries becomes one option
   matching both. Alphabetical, so the dropdown reads the same on every visit. */
function collectPackages(published) {
  const byValue = new Map();

  for (const country of published) {
    for (const title of country.packages) {
      const value = slugify(title);
      if (!value) continue;

      const entry = byValue.get(value) ?? { value, label: title, keys: [] };
      entry.keys.push(country.key);
      byValue.set(value, entry);
    }
  }

  return [...byValue.values()].sort((a, b) =>
    a.label.localeCompare(b.label, "en", { sensitivity: "base" }),
  );
}

/**
 * The "Popular Packages" dropdown's options — { value, label } only, so the
 * list can cross into the client toolbar as a plain prop.
 */
export async function getPackageOptions() {
  const published = await fetchPublishedCountries();
  return collectPackages(published).map(({ value, label }) => ({ value, label }));
}

/**
 * The filtered catalogue with a link and a picture on every card.
 *
 * Shape matches what ResultsGrid renders: { slug, name, description, image,
 * href }. The description is the tagline followed by the region, so a card
 * reads "Safari • Nairobi — Africa".
 */
export async function getSearchResults({ pkg, ...filters } = {}) {
  const [published, cardImages] = await Promise.all([
    fetchPublishedCountries(),
    fetchRegionCardImages(),
  ]);

  /* A package the CMS no longer lists matches nothing rather than everything:
     the chip still shows what was asked for, and the empty state explains. */
  const packageKeys = pkg
    ? new Set(collectPackages(published).find((p) => p.value === pkg)?.keys ?? [])
    : undefined;

  const matches = filterCountries({ ...filters, packageKeys });

  /* The same shape publishedCountrySet() builds for the navbar and A to Z,
     so resolveDestinationHref() prefers the canonical URL here too. */
  const publishedKeys = new Set(
    published.flatMap((entry) =>
      entry.canonical ? [entry.key, `canonical:${entry.key}`] : [entry.key],
    ),
  );
  const heroImages = new Map(
    published.filter((entry) => entry.image).map((e) => [e.key, e.image]),
  );

  return matches.map((country, index) => {
    const keys = country.regions.map((region) => `${region.key}/${country.slug}`);
    const image =
      keys.map((key) => heroImages.get(key)).find(Boolean) ??
      keys.map((key) => cardImages.get(key)).find(Boolean) ??
      FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

    return {
      slug: country.slug,
      name: country.name,
      description: [country.tagline, country.regions[0].label]
        .filter(Boolean)
        .join(" — "),
      image,
      href: resolveDestinationHref(country, publishedKeys),
    };
  });
}

/**
 * EVERY country the site covers, as { name, slug, image }, alphabetical.
 *
 * Two jobs on /plan-my-trip: the autocomplete under "where would you like to
 * go?" suggests from the whole list (all ~110, so anywhere the site knows can
 * be picked), and the "Your journey" rail shows the chosen place's own photo.
 * So `image` is the country's real CMS picture (hero upload first, then the
 * region-grid tile — keyed exactly as getSearchResults() so a place pictures
 * the same here as on its /search card) or `null` when the CMS has none. It is
 * deliberately NOT back-filled with a rotated design still: the rail keeps its
 * neutral image for a place it cannot picture (an unrelated photo standing in
 * for a country is worse than a neutral one), while the name still suggests.
 *
 * On a forbidden/empty CMS the names still come through (they are static, from
 * lib/navigation.js) with every image null — suggestions work, rail stays
 * neutral. The names never depend on Strapi; only the pictures do.
 */
export async function getDestinations() {
  const [published, cards] = await Promise.all([
    fetchPublishedCountries().catch(() => []),
    fetchRegionCards().catch(() => []),
  ]);

  const heroImages = new Map(
    published.filter((entry) => entry.image).map((e) => [e.key, e.image]),
  );
  const cardImages = new Map();
  for (const card of cards) {
    if (card.image) cardImages.set(card.key, card.image);
  }

  /* The static country catalogue first — every name always present (it does
     not depend on Strapi), pictured by the hero upload, then the region-grid
     tile, then left neutral. */
  const catalogue = COUNTRIES.map((country) => {
    const keys = country.regions.map((r) => `${r.key}/${country.slug}`);
    const image =
      keys.map((key) => heroImages.get(key)).find(Boolean) ??
      keys.map((key) => cardImages.get(key)).find(Boolean) ??
      null;
    return { name: country.name, slug: country.slug, image };
  });

  /* Then every other place the CMS region grids curate — the ones that are not
     countries in lib/navigation.js and so never reached the wizard before:
     Kashmir, Kerala, Rajasthan, Ladakh, Gujarat, Hampi, Bali, Dubai … Each
     keeps its own upload, so the rail shows that place's own photograph rather
     than the neutral houseboat. Deduped by name against the country list, so a
     card for a country already listed does not double it up. */
  const seen = new Set(catalogue.map((d) => d.name.toLowerCase()));
  for (const card of cards) {
    const name = card.name.trim();
    const nameKey = name.toLowerCase();
    if (!name || seen.has(nameKey)) continue;
    seen.add(nameKey);
    catalogue.push({
      name,
      slug: card.key.split("/").pop() || slugify(name),
      image: card.image,
    });
  }

  /* Finally the featured places no region card carries yet, matched to a
     picture already in the repo (Munnar, Lakshadweep). A CMS card of the same
     name is added to `seen` above and wins, so these only fill a real gap. */
  for (const place of FEATURED_LOCAL_PLACES) {
    const nameKey = place.name.toLowerCase();
    if (seen.has(nameKey)) continue;
    seen.add(nameKey);
    catalogue.push(place);
  }

  return catalogue;
}
