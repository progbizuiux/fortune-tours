import { StrapiError, strapiFindOne } from "./client";
import { mediaAlt, mediaUrl } from "./media";
import { list, text } from "./normalise";

/* The gallery page (/gallery) — query, cache tags and the CMS→props
 * normaliser.
 *
 * One page modelled as a collection type, the same way kerala-pages is: the
 * panel has no single types, so the reader takes the first published entry and
 * treats an empty collection as "nothing published yet" rather than an error.
 *
 * THE ORDER OF `photos` IS CONTENT, not presentation. The first entry is the
 * banner — components/gallery/GalleryGridSection.jsx gives index 0 the masked
 * reveal, the centre-column placement, the scrim its title sits on, and the
 * only `priority` load, and lib/gsap/useMosaicZoom.js opens the zoom on it.
 * So this normaliser never sorts, never filters, and never drops a row: a
 * photo whose upload went missing keeps its place and borrows a design
 * picture, because removing it would silently promote the next photograph into
 * the banner slot with nothing in the CMS to explain why.
 *
 * EVERY WORD AND PICTURE is optional. The section ships with its own title,
 * standfirst and twelve photographs, so a field left empty falls through to
 * the design rather than rendering a hole — the same contract the country and
 * Kerala pages use. That is also why the image list comes back as `undefined`
 * rather than `[]` when there is nothing: the component takes its fallback
 * through a default parameter, and a default parameter only fires on
 * undefined.
 */

export const GALLERY_TAGS = ["gallery-page", "gallery"];

/* `populate: "*"` reaches one level only, so it would return the photo rows
   with their alt text and no pictures at all. The media sits one level below
   that and needs naming. */
const GALLERY_QUERY = {
  populate: { photos: { populate: { image: true } } },
};

/* The photographs the design shipped with, in the order it drew them, used
   until an editor uploads real ones. Copy comes back undefined and the
   component falls through to its own line, but next/image throws on a null
   `src`, so a picture needs a real path rather than nothing.

   The whole sequence is here rather than a token few, and that matters once
   the entry is seeded: scripts/seed-gallery.cjs writes the twelve rows with
   their words but no uploads, so every tile resolves through this list. A
   shorter list would cycle four pictures where the design shows eight, and
   moving the copy into the CMS would have quietly changed the page. Indexed by
   position for the same reason, and it rotates so a wall longer than the
   design drew reuses them rather than running out. */
const FALLBACK_PHOTOS = [
  "/gallery/gallery-1.jpg",
  "/gallery/gallery-2.jpg",
  "/gallery/gallery-3.jpg",
  "/gallery/hero-bg.jpg",
  "/destination/india.avif",
  "/destination/japan.avif",
  "/destination/norway.avif",
  "/destination/switzerland.avif",
  "/gallery/gallery-1.jpg",
  "/gallery/gallery-2.jpg",
  "/gallery/gallery-3.jpg",
  "/gallery/hero-bg.jpg",
];

/**
 * The gallery entry, or null when there is none.
 *
 * Two statuses mean "no content" rather than "something broke", and both are
 * states this collection genuinely passes through on its way to being live:
 *
 *   404 — the content type has not reached this Strapi yet, the same reading
 *         lib/strapi/country.js gives it.
 *   403 — it is there, and the Public role has not been granted `find`. The
 *         site carries no API token, so an unticked box is indistinguishable
 *         from a missing collection from out here.
 *
 * Neither is fixed by retrying, and neither is worth failing a build over: the
 * section carries its own copy and photographs, so the page renders. The 403
 * is warned about rather than swallowed silently, because unlike the 404 it is
 * a box someone can tick — scripts/seed-gallery.cjs in the backend ticks it.
 *
 * Every other failure still throws, which is what keeps ISR honest: a
 * regeneration that throws leaves Next serving the last good render instead of
 * caching a stripped page.
 */
async function fetchGallery() {
  try {
    return await strapiFindOne("gallery-pages", {
      query: GALLERY_QUERY,
      tags: GALLERY_TAGS,
    });
  } catch (error) {
    if (!(error instanceof StrapiError)) throw error;

    if (error.status === 403) {
      console.warn(
        "[gallery] Strapi returned 403 — the Public role has no `find` on " +
          "gallery-page, so the page is rendering the design's own photographs. " +
          "Run scripts/seed-gallery.cjs on the panel, or tick it in " +
          "Settings → Roles → Public.",
      );
      return null;
    }

    if (error.status === 404) return null;

    throw error;
  }
}

/**
 * Fetch and normalise the gallery page.
 * @returns the props tree, or null when no published entry exists.
 */
export async function getGalleryPage() {
  const entry = await fetchGallery();
  return entry ? normaliseGallery(entry) : null;
}

/* ── CMS → props ──────────────────────────────────────────────────────── */

function normaliseGallery(entry) {
  const photos = list(entry.photos).map((photo, index) => ({
    /* The component keys on this. Repeatable component rows carry a numeric
       `id` and no documentId; the index is only there so a row that somehow
       arrives without one still keys uniquely. */
    id: photo.id ?? index,
    src: mediaUrl(photo.image, FALLBACK_PHOTOS[index % FALLBACK_PHOTOS.length]),
    /* The component's own `alt` is the authored line and wins. The media
       library's alternativeText is the backstop, which is the opposite of what
       mediaAlt does on its own — it prefers alternativeText over whatever it is
       passed, so handing it the authored text would let a filename typed into
       the media library override a sentence written for this page. */
    alt: text(photo.alt) ?? mediaAlt(photo.image, ""),
    title: text(photo.title),
  }));

  return {
    title: text(entry.title),
    description: text(entry.description),
    images: photos.length ? photos : undefined,
  };
}
