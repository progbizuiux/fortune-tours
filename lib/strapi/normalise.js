/* Shared primitives for turning Strapi values into component props.
 *
 * Extracted the moment a second page needed them. The equivalent helpers in
 * progbiz-ui were copy-pasted per page and drifted apart — same name, three
 * behaviours — so these live in one place from the start.
 */

/**
 * A trimmed string, or the fallback.
 *
 * Strapi returns "" both for a field an editor cleared and for one they never
 * filled, so empty string has to collapse to the fallback exactly as null does
 * — otherwise a blank CMS field would wipe the design's own copy.
 */
export function text(value, fallback = undefined) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed === "" ? fallback : trimmed;
}

/** A dense array, or []. Guards against null repeatable components. */
export function list(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

/**
 * A { label, href } pair, or null when there is no label.
 *
 * Link fields in this CMS are routinely left empty while the copy is written,
 * so the href falls back to wherever the design already pointed.
 */
export function cta(label, href, fallbackHref) {
  const resolved = text(label);
  if (!resolved) return null;
  return { label: resolved, href: text(href, fallbackHref) };
}

/* Hosts that are this site. Editors paste links out of the address bar of
   whichever deployment they were looking at, so a CMS "link" field routinely
   holds a fully-qualified URL to a page this app already serves. Left alone
   those become <Link>s to an external origin: a full page load out of the app,
   and on localhost a jump to the live site altogether.

   NEXT_PUBLIC_SITE_URL is honoured first so a new domain needs no code change;
   the deployment hosts are listed because it is not set anywhere yet. */
const SITE_HOSTS = [
  (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname;
    } catch {
      return null;
    }
  })(),
  "fortunedev.progbiz.in",
].filter(Boolean);

/**
 * A CMS link as an in-app path: an absolute URL pointing at this site loses its
 * origin, anything else (a relative path, a genuinely external link) is left
 * exactly as the editor wrote it.
 */
export function internalHref(value, fallback = undefined) {
  const href = text(value, fallback);
  if (!href || !/^https?:\/\//i.test(href)) return href;

  try {
    const url = new URL(href);
    if (!SITE_HOSTS.includes(url.hostname)) return href;
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return href;
  }
}

/** "a, b, c" → ["a", "b", "c"] */
export function splitList(value) {
  return text(value, "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

/** ["5 Days", "Kochi"] → "5 Days · Kochi" */
export function joinParts(parts) {
  return parts.filter(Boolean).join(" · ");
}

/**
 * Split a markdown text field into a standfirst plus body paragraphs.
 *
 * There is no markdown renderer in this project and the CMS copy only uses two
 * constructs, so both are handled directly: blank-line paragraph breaks, and a
 * leading all-bold line, which maps onto the standfirst these designs already
 * carry above the body copy.
 */
export function splitMarkdown(value) {
  const source = text(value, "");
  if (!source) return { lead: undefined, paragraphs: [] };

  const blocks = source
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const boldOnly = blocks[0]?.match(/^\*\*([\s\S]+)\*\*$/);

  return {
    lead: boldOnly ? stripEmphasis(boldOnly[1]) : undefined,
    paragraphs: (boldOnly ? blocks.slice(1) : blocks).map(stripEmphasis),
  };
}

/* Inline emphasis markers are dropped rather than rendered as <strong>/<em>:
   the body copy is styled as one weight by design, and turning CMS text into
   markup here would mean trusting it as HTML. */
export function stripEmphasis(value) {
  return value
    .replace(/\*{1,2}/g, "")
    .replace(/\s*\n\s*/g, " ")
    .trim();
}

/** A React key / id derived from a title, stable across reorders. */
export function slugify(value) {
  /* Accents fold before the non-alphanumerics drop, so "Réunion Island" is
     `reunion-island` — the same rule as slugify() in lib/navigation.js, which
     builds the country hrefs this is matched against. */
  return text(value, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
