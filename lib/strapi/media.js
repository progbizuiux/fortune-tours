import { strapiMediaBase } from "./client";

/* The one place a Strapi media field turns into something next/image accepts.
 *
 * Worth keeping to one helper: the equivalent in progbiz-ui is copy-pasted
 * into 24 files, so a change to how uploads are hosted means 24 edits and the
 * copies have already drifted.
 *
 * Handles all four shapes a media field arrives in:
 *   null / undefined            → the caller's fallback
 *   { url: "/uploads/x.jpg" }   → v5, relative to the Strapi origin
 *   { url: "https://cdn/..." }  → already absolute (Cloudinary, Bunny, S3)
 *   { data: { attributes: {} } } → v4 envelope, tolerated so a backend that
 *                                  has not been upgraded does not render blank
 */
export function mediaUrl(media, fallback = null) {
  const node = unwrap(media);
  const url = node?.url;

  if (typeof url !== "string" || url === "") return fallback;
  if (/^https?:\/\//i.test(url)) return url;

  return `${strapiMediaBase()}${url.startsWith("/") ? "" : "/"}${url}`;
}

/* Alt text, preferring what the editor typed in the media library. Falls back
   to the caller's copy — usually the design's original alt, which is better
   than an empty string for an image that carries meaning. */
export function mediaAlt(media, fallback = "") {
  const node = unwrap(media);
  return node?.alternativeText || fallback;
}

/* Intrinsic dimensions, for the few places that size an image by attribute
   rather than with `fill`. Returns null when Strapi has not stored them. */
export function mediaSize(media) {
  const node = unwrap(media);
  if (!node?.width || !node?.height) return null;
  return { width: node.width, height: node.height };
}

/* Strapi v5 returns the media object directly; v4 wraps it in { data: { attributes } }.
   A multiple-media field arrives as an array in both, so take the first. */
function unwrap(media) {
  if (!media) return null;

  const node = Array.isArray(media) ? media[0] : media;
  if (!node) return null;

  if (node.data !== undefined) {
    const inner = Array.isArray(node.data) ? node.data[0] : node.data;
    return inner?.attributes ?? inner ?? null;
  }

  return node.attributes ?? node;
}
