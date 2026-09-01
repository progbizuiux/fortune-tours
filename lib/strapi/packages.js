import { StrapiError, strapiFindOne } from "./client";
import { mediaAlt, mediaUrl } from "./media";
import { cta, list, slugify, text } from "./normalise";

/* Package detail pages (/destinations/kerala/lakshadweep-agatti-kalpitti and
 * its siblings) — query, cache tags and the CMS→props normaliser.
 *
 * WHICH PACKAGE a URL means is answered by the entry itself, the same way
 * lib/strapi/country.js does it: `slug` is the last segment and
 * `destinationSlug` the one before it, so /destinations/kerala/… resolves and
 * the same package under another destination does not.
 *
 * EVERY SECTION on the page comes from here now. lib/packages.js merges what
 * this returns over its own copy, key by key: a field the CMS has empty
 * normalises to undefined and is dropped by that merge, which leaves the
 * design's own line standing rather than blanking it. That is what lets this
 * run against a Strapi whose entry is only half filled in.
 *
 * Add a section to the content type and it lands here as another normaliser,
 * with no change to the route or to any component.
 */

export const PACKAGE_TAGS = ["package", "packages", "destinations"];

const PACKAGE_QUERY = (destinationSlug, slug) => ({
  filters: {
    slug: { $eq: slug },
    destinationSlug: { $eq: destinationSlug },
  },
  /* One rule per section. Each repeatable list inside a section needs its own
     rule, because `populate: "*"` reaches one level only — the same shape
     lib/strapi/country.js uses. */
  populate: {
    heroSection: { populate: "*" },
    introSection: { populate: { image: true, stats: true } },
    itinerarySection: { populate: { days: { populate: "*" } } },
    inclusionsSection: { populate: "*" },
    documentsSection: { populate: { image: true, items: true } },
    whyUsSection: { populate: { reasons: true } },
    cancellationSection: { populate: { rows: true } },
    faqSection: { populate: { faqs: true } },
    ctaSection: { populate: "*" },
  },
});

/* ── reads ─────────────────────────────────────────────────────────────── */

/**
 * The entry for a package, or null when there is none.
 *
 * A 404 is treated as "no content" rather than an error, exactly as the
 * country and destination readers do: it means the collection has not reached
 * this Strapi yet, which is a real state and not something a retry fixes.
 *
 * SO IS a 400 naming a populate key the server does not know. The sections
 * above land on a given Strapi only when its schema is deployed, and the
 * panels are not all on the same commit — a query for a field one of them has
 * not seen answers "Invalid key introSection" rather than ignoring it. Letting
 * that throw would take the whole page down over a section, when the honest
 * outcome is the one below: no CMS entry, so lib/packages.js keeps the design's
 * own copy. Every other failure still throws, which is what keeps ISR honest —
 * see lib/strapi/client.js.
 */
async function fetchPackage(destinationSlug, slug) {
  try {
    return await strapiFindOne("packages", {
      query: PACKAGE_QUERY(destinationSlug, slug),
      tags: PACKAGE_TAGS,
    });
  } catch (error) {
    if (!(error instanceof StrapiError)) throw error;
    if (error.status === 404) return null;
    if (error.status === 400 && /Invalid key/i.test(error.body ?? "")) {
      return null;
    }
    throw error;
  }
}

/**
 * Fetch and normalise one package.
 * @returns the props tree, or null when no published entry matches.
 */
export async function getPackageEntry(destinationSlug, slug) {
  if (!destinationSlug || !slug) return null;

  const entry = await fetchPackage(destinationSlug, slug);
  return entry ? normalisePackage(entry) : null;
}

/* ── normalisers ───────────────────────────────────────────────────────── */

export function normalisePackage(entry) {
  return {
    hero: normaliseHero(entry?.heroSection),
    intro: normaliseIntro(entry?.introSection),
    itinerary: normaliseItinerary(entry?.itinerarySection),
    inclusions: normaliseInclusions(entry?.inclusionsSection),
    documents: normaliseDocuments(entry?.documentsSection),
    whyUs: normaliseWhyUs(entry?.whyUsSection ?? entry?.healthSection ?? entry?.healthNoteSection),
    cancellation: normaliseCancellation(entry?.cancellationSection),
    faq: normaliseFaq(entry?.faqSection),
    /* The closing booking band. Same component shape as a hero, because the
       CMS stores it in the shared Hero Section component. */
    cta: bookingBand(normaliseHero(entry?.ctaSection)),
    meta: {
      title: text(entry?.metaTitle),
      description: text(entry?.metaDescription),
    },
  };
}

/* The hero's `description` is the one richtext field on this content type, and
   the design puts two lines in it: the inclusions sentence, then the from-price
   in bold beneath it. PageHero takes those as two props, so the paragraphs are
   split apart here — the first becomes `description`, the second `note`. */
function normaliseHero(section) {
  if (!section) return {};

  const [description, note] = htmlParagraphs(section.description);
  const ctas = [
    cta(section.primaryCtaLabel, section.primaryCtaLink),
    cta(section.secondaryCtaLabel, section.secondaryCtaLink),
  ].filter(Boolean);

  return {
    eyebrow: text(section.eyebrow),
    title: text(section.title),
    description,
    note,
    image: mediaUrl(section.backgroundImage) ?? undefined,
    imageAlt: mediaAlt(section.backgroundImage) || undefined,
    /* undefined rather than [], so a hero whose CMS links are still empty
       keeps the two buttons the design shipped with. */
    ctas: ctas.length ? ctas : undefined,
  };
}

/* The band's first call to action opens the enquiry dialog rather than
 * navigating — "Book Your Seat" asks for five details, which is a form and not
 * a page. BookingCtaSection keys on `opensForm`; see its note.
 *
 * Marked here rather than in the CMS: which control opens a dialog is a
 * property of the section, not something an editor should be able to retype.
 * It is set only on this band, so the identical pair at the top of the page
 * keeps navigating as it always has. The href stays underneath, so the button
 * degrades to a link without JavaScript.
 */
function bookingBand(section) {
  if (!section?.ctas?.length) return section;

  return {
    ...section,
    ctas: section.ctas.map((link, index) =>
      index === 0 ? { ...link, opensForm: true } : link,
    ),
  };
}

/* The three fields every section heading carries. */
const heading = (section) => ({
  eyebrow: text(section?.eyebrow),
  title: text(section?.title),
  description: text(section?.description),
});

/* undefined for an empty list, so the component keeps its own fallback rather
   than rendering an empty strip. */
const cards = (items, map) => (items.length ? items.map(map) : undefined);

function normaliseIntro(section) {
  if (!section) return {};

  return {
    ...heading(section),
    image: mediaUrl(section.image) ?? undefined,
    imageAlt: mediaAlt(section.image) || undefined,
    stats: cards(list(section.stats), (stat) => ({
      label: text(stat.label, ""),
      value: text(stat.value, ""),
    })),
  };
}

function normaliseItinerary(section) {
  if (!section) return {};

  return {
    ...heading(section),
    days: cards(list(section.days), (day) => ({
      number: text(day.number),
      title: text(day.title, ""),
      description: text(day.description),
      itemsLead: text(day.itemsLead),
      /* [] rather than undefined: the section checks `items?.length` before
         drawing the list, so an empty array is what hides it. */
      items: splitLines(day.items),
      footnote: text(day.footnote),
      image: mediaUrl(day.image) ?? undefined,
      imageAlt: mediaAlt(day.image, text(day.title, "")),
    })),
  };
}

/* Two tabs, stored flat on the CMS side because the toggle draws exactly two
   and a third would have nowhere to go. The `key` is set here rather than in
   the CMS: it is what the component keys its buttons and panels on, so it
   belongs to the code and not to something an editor can retype. */
function normaliseInclusions(section) {
  if (!section) return {};

  const tabs = [
    {
      key: "covered",
      label: text(section.coveredLabel),
      title: text(section.coveredTitle),
      items: splitLines(section.coveredItems),
    },
    {
      key: "not-covered",
      label: text(section.notCoveredLabel),
      title: text(section.notCoveredTitle),
      items: splitLines(section.notCoveredItems),
    },
    /* A tab with no label cannot be pressed — drop it rather than render a
       nameless button. */
  ].filter((tab) => tab.label);

  return {
    ...heading(section),
    tabs: tabs.length ? tabs : undefined,
  };
}

function normaliseDocuments(section) {
  if (!section) return {};

  return {
    ...heading(section),
    image: mediaUrl(section.image) ?? undefined,
    imageAlt: mediaAlt(section.image) || undefined,
    items: cards(list(section.items), (item) => ({
      number: text(item.number),
      title: text(item.title, ""),
      description: text(item.description),
    })),
  };
}

function normaliseWhyUs(section) {
  if (!section) return undefined;

  const rawFeatures = list(
    section.reasons ?? section.features ?? section.items ?? section.notes,
  );

  return {
    eyebrow: text(section.eyebrow),
    title: text(section.title),
    description: text(section.description),
    features: rawFeatures.length
      ? rawFeatures.map((item, i) => ({
          key: slugify(item.title) || `reason-${item.id ?? i}`,
          title: text(
            item.title ??
              item.heading ??
              item.name ??
              (typeof item === "string" ? item : item.text ?? item.note),
            "",
          ),
          body: text(item.description ?? item.body ?? item.subtitle),
        }))
      : undefined,
  };
}

const normaliseHealth = normaliseWhyUs;

function normaliseCancellation(section) {
  if (!section) return {};

  return {
    ...heading(section),
    rows: cards(list(section.rows), (row) => ({
      label: text(row.label, ""),
      value: text(row.value, ""),
    })),
    note: text(section.note),
  };
}

function normaliseFaq(section) {
  if (!section) return {};

  return {
    eyebrow: text(section.eyebrow),
    title: text(section.title),
    contactInfo: text(section.contactInfo),
    faqs: cards(list(section.faqs), (faq) => ({
      question: text(faq.question, ""),
      answer: text(faq.answer, ""),
    })),
  };
}

/* One entry per line. Blank lines are dropped so a trailing newline in the
   textarea does not become an empty bullet — the same conversion
   lib/strapi/country.js does for the wizard's option lists. */
function splitLines(value) {
  return text(value, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/* Paragraph text out of a Strapi richtext field.
 *
 * Kept local rather than put in normalise.js because this is the only richtext
 * field the CMS serves as HTML — everything else arrives as plain text or
 * markdown, which splitMarkdown already covers.
 *
 * Tags are stripped rather than rendered: the hero styles these two lines
 * itself, and passing CMS HTML through to the page would mean trusting it as
 * markup. Entities are decoded for the handful that survive that.
 */
function htmlParagraphs(value) {
  return text(value, "")
    .split(/<\/p>|<br\s*\/?>/i)
    .map((block) =>
      block
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&(?:quot|#34);/gi, '"')
        .replace(/&(?:apos|#39);/gi, "'")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}
