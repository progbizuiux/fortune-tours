import { strapiFetch } from "./client";
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
  populate: { image: true, coverImage: true, coverimage: true },
  sort: ["order:asc", "id:asc"],
  pagination: { pageSize: 100 },
};

/**
 * Fetch and normalise every travel style.
 * @returns carousel/banner items, or undefined when the CMS has nothing usable.
 */
export async function getTravelStyles() {
  const json = await strapiFetch("travel-styles", {
    query: TRAVEL_STYLE_QUERY,
    tags: TRAVEL_STYLE_TAGS,
  });

  return normaliseTravelStyles(json?.data);
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
    image: style.image,
    imageAlt: style.alt,
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
      const mediaSource = coverImageMedia ?? style.image;
      const image =
        mediaUrl(coverImageMedia, null) || mediaUrl(style.image, null);
      if (!label || !image) return null;

      /* The uid field is the natural key; slugify the name if an older entry
         predates it, and fall back to the row id so React always has one. */
      const key = text(style.slug) || slugify(label) || String(style.id);

      return {
        key,
        label,
        image,
        /* The explicit imageAlt field wins over whatever was typed in the
           media library, and the style's own name is better than "". */
        alt: text(style.imageAlt) || mediaAlt(mediaSource, label),

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
