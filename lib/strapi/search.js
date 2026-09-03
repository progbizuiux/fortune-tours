import { StrapiError, strapiFetch } from "./client";
import { COUNTRY_TAGS } from "./country";
import { DESTINATION_TAGS } from "./destination";
import { mediaUrl } from "./media";
import { list, slugify, text } from "./normalise";
import { resolveDestinationHref } from "@/lib/destinationsAZ";
import { homeRegionForCountry, regionKeysForCountry } from "@/lib/navigation";
import { filterCountries } from "@/lib/searchCatalog";

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

/* The picture each region grid shows for each of its countries, keyed the
   same way. Matched on `link` first and the slugified name second, as
   getCountryCardImage() in ./destination.js does. */
async function fetchRegionCardImages() {
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

    const images = new Map();
    for (const region of list(json?.data)) {
      const regionSlug = text(region.slug, "");
      for (const card of list(region.countriesSection?.countries)) {
        const image = mediaUrl(card.image, null);
        if (!image) continue;

        const link = text(card.link, "").replace(/\/$/, "");
        const key = link.startsWith("/")
          ? link.slice(1)
          : `${regionSlug}/${slugify(text(card.name, ""))}`;
        images.set(key, image);
      }
    }
    return images;
  } catch (error) {
    if (error instanceof StrapiError) return new Map();
    throw error;
  }
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
