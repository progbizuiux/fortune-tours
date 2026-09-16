import { StrapiError, strapiFetch } from "./client";
import { mediaAlt, mediaUrl } from "./media";
import { list, slugify, stripEmphasis, text } from "./normalise";

/* Travel styles — the collection behind the "choose your journey" carousel and
 * the editorial band at the top of /search.
 *
 * A standalone content type rather than a section component on one page: the
 * same styles are meant to show up wherever they render, so they are edited
 * once here instead of being duplicated per destination. That is what makes
 * the carousel destination-agnostic — the Kerala page and the India page read
 * the same eight entries.
 *
 * One normalised item serves both consumers. The carousel reads key/label/
 * image/alt/href; the banner reads title/body/cta/image. Splitting them into
 * two shapes would mean two fetches of the same eight rows.
 */

export const TRAVEL_STYLE_TAGS = ["travel-style", "destinations"];

/* `order` is the field editors sort by in the admin, so ask Strapi to apply it
   rather than letting insertion order decide. `id` breaks ties so the sequence
   is stable when two entries share an order value. */
const TRAVEL_STYLE_QUERY = {
  populate: {
    image: true,
    coverImage: true,
    countries: { fields: ["name", "slug", "continentSlug"] },
    continents: { fields: ["slug"] },
  },
  sort: ["order:asc", "id:asc"],
  pagination: { pageSize: 100 },
};

function fetchTravelStyles() {
  return strapiFetch("travel-styles", {
    query: TRAVEL_STYLE_QUERY,
    tags: TRAVEL_STYLE_TAGS,
  });
}

function styleKey(style) {
  const label = text(style.styleName, "");
  return text(style.slug) || slugify(label) || String(style.id);
}

/**
 * Fetch and normalise every travel style.
 * @returns carousel/banner items, or undefined when the CMS has nothing usable.
 */
export async function getTravelStyles() {
  const json = await fetchTravelStyles();
  return normaliseTravelStyles(json?.data);
}

/**
 * The countries and continents an editor picked on the style a /search
 * `?style=` value names, countries in the order the admin lists them.
 * @returns { countries: [{ name, slug, region }], continents: string[] }, or
 *   undefined when the style is unknown or has nothing picked.
 */
export async function getTravelStyleDestinations(key) {
  if (!key) return undefined;
  const json = await fetchTravelStyles();
  // Read raw rather than through the normaliser, which drops imageless styles.
  const style = list(json?.data).find((entry) => styleKey(entry) === key);
  if (!style) return undefined;

  const countries = list(style.countries)
    .map((country) => ({
      name: text(country.name, ""),
      slug: text(country.slug, ""),
      region: text(country.continentSlug, ""),
    }))
    .filter((country) => country.slug);
  const continents = list(style.continents)
    .map((continent) => text(continent.slug, ""))
    .filter(Boolean);

  return countries.length || continents.length
    ? { countries, continents }
    : undefined;
}

/* Its own request rather than a key on TRAVEL_STYLE_QUERY: a panel that has
   not deployed the field rejects the whole query, and that one also feeds the
   homepage carousel. */
const TRAVEL_STYLE_PACKAGES_QUERY = {
  fields: ["slug", "styleName"],
  populate: {
    packages: {
      fields: ["slug", "destinationSlug", "internalName"],
      populate: {
        heroSection: {
          fields: ["title", "eyebrow"],
          populate: { backgroundImage: true },
        },
      },
    },
  },
  pagination: { pageSize: 100 },
};

/**
 * The package (itinerary) pages picked on the style a /search `?style=`
 * value names, in the order the admin lists them.
 * @returns [{ slug, destination, name, tagline, duration, image }], [] when
 *   none are picked or the panel does not have the field yet.
 */
export async function getTravelStylePackages(key) {
  if (!key) return [];

  let json;
  try {
    json = await strapiFetch("travel-styles", {
      query: TRAVEL_STYLE_PACKAGES_QUERY,
      tags: TRAVEL_STYLE_TAGS,
    });
  } catch (error) {
    if (
      error instanceof StrapiError &&
      error.status === 400 &&
      /Invalid key/i.test(error.body ?? "")
    ) {
      return [];
    }
    throw error;
  }

  const style = list(json?.data).find((entry) => styleKey(entry) === key);

  return list(style?.packages)
    .map((pack) => {
      const slug = text(pack.slug);
      const destination = text(pack.destinationSlug);
      if (!slug || !destination) return null;

      // The hero title breaks after the package's name: "Thailand Tour\nKochi to…".
      const [name, tagline] = text(pack.heroSection?.title, "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      return {
        slug,
        destination,
        name: name || text(pack.internalName) || slug,
        tagline,
        duration: text(pack.heroSection?.eyebrow, "").replace(/\s+/g, " ") || undefined,
        image: mediaUrl(pack.heroSection?.backgroundImage, null),
      };
    })
    .filter(Boolean);
}

/**
 * The one style a /search `?style=` value refers to.
 * @returns the item, or undefined when nothing matches — callers fall back.
 */
export async function getTravelStyle(key) {
  if (!key) return undefined;
  const styles = await getTravelStyles();
  return styles?.find((style) => style.key === key);
}

/* The shape InspirationBanner takes. Kept next to the normaliser so the two
   cannot drift: the banner prints `Inspirations — {theme}`, which is why the
   style's NAME goes to `theme` and its headline to `title`. */
export function toInspiration(style) {
  return {
    theme: style.label,
    title: style.title,
    body: style.body,
    cta: style.cta,
    image: style.bannerImage || style.image,
    imageAlt: style.bannerAlt || style.alt,
  };
}

export function normaliseTravelStyles(data) {
  const items = list(data)
    .map((style) => {
      const label = text(style.styleName, "");

      /* ImageCarouselSection hands `image` straight to next/image, where null
         is a render error rather than a blank tile. An entry without a usable
         image is dropped instead of passed on — one unfinished entry should
         not take the whole carousel down with it. */
      const coverImageMedia = style.coverImage ?? style.coverimage;
      const bannerImageMedia = style.image;
      const coverImage =
        mediaUrl(coverImageMedia, null) || mediaUrl(bannerImageMedia, null);
      const bannerImage =
        mediaUrl(bannerImageMedia, null) || mediaUrl(coverImageMedia, null);

      if (!label || !coverImage) return null;

      /* The uid field is the natural key; slugify the name if an older entry
         predates it, and fall back to the row id so React always has one. */
      const key = styleKey(style);

      return {
        key,
        label,
        image: coverImage,
        bannerImage,
        /* The explicit imageAlt field wins over whatever was typed in the
           media library, and the style's own name is better than "". */
        alt: text(style.imageAlt) || mediaAlt(coverImageMedia ?? bannerImageMedia, label),
        bannerAlt: text(style.imageAlt) || mediaAlt(bannerImageMedia ?? coverImageMedia, label),

        /* Clicking a card opens /search themed to this style. A dedicated
           `style` param rather than the existing `experience` one: experience
           also drives filterJourneys, and its vocabulary ("Nature & Wildlife")
           is not this collection's, so reusing it would theme the band and
           filter the results underneath it down to nothing. */
        href: `/search?style=${encodeURIComponent(key)}`,

        /* Read only by the banner. The carousel ignores these, which is what
           lets one fetch serve both. */
        title: text(style.title, label),
        /* `description` is a richtext field holding one plain paragraph today;
           emphasis is stripped in case an editor reaches for markdown later,
           since this is rendered as text rather than markup. */
        body: stripEmphasis(
          text(style.description, "") || text(style.shortDescription, ""),
        ),
        cta: text(style.ctaLabel, `Explore ${label} journeys`),
      };
    })
    .filter(Boolean);

  /* Undefined rather than [], so a caller falls back to its own items instead
     of rendering an empty strip. */
  return items.length ? items : undefined;
}
