import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { COUNTRY_TAGS } from "@/lib/strapi/country";
import { DESTINATION_TAGS } from "@/lib/strapi/destination";
import { EXPERIENCES_TAGS } from "@/lib/strapi/experiences";
import { GALLERY_TAGS } from "@/lib/strapi/gallery";
import { HOME_TAGS } from "@/lib/strapi/home";
import { KERALA_TAGS } from "@/lib/strapi/kerala";
import { PACKAGE_TAGS } from "@/lib/strapi/packages";
import { TRAVEL_STYLE_TAGS } from "@/lib/strapi/travel-styles";

/* On-demand ISR. Strapi calls this on publish so an edit appears immediately
 * instead of waiting out the page's revalidate window.
 *
 * This is the half that makes ISR worth using. Without it the only lever is
 * the timer, and the temptation is to set it very low — which is really just
 * SSR with extra steps. With it, pages can cache for an hour and still update
 * the moment someone hits Publish.
 *
 * Wiring it up in Strapi: Settings -> Webhooks -> Create new webhook
 *   URL     https://<site>/api/revalidate
 *   Headers x-revalidate-secret: <the STRAPI_REVALIDATE_SECRET value>
 *   Events  Entry:  create, update, delete, publish, unpublish
 *           Media:  create, update, delete
 *
 * Manual purge, for verifying the wiring or after a bulk import:
 *   curl -X POST "https://<site>/api/revalidate?secret=<secret>"
 */

/* Never let this endpoint be prerendered or edge-cached — a cached
   revalidation endpoint is a revalidation endpoint that has stopped working. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* Which cache tags each content type invalidates. Tags come from the module
   that owns the fetch, so a page's tags are declared once and cannot drift
   apart from what its query actually tagged. */
const TAGS_BY_MODEL = {
  "kerala-page": KERALA_TAGS,
  /* The region pages behind /africa and its siblings. They share the
     "destinations" tag with Kerala, so publishing either drops both — the
     cheaper mistake, since the two describe the same places. */
  "destination-page": DESTINATION_TAGS,
  /* The collection lib/strapi/destination.js actually reads. */
  continent: DESTINATION_TAGS,
  /* Country pages — /africa/botswana and its siblings. COUNTRY_TAGS carries
     "destinations" too, so publishing a country also drops the region pages
     that link into it. */
  country: COUNTRY_TAGS,
  /* Travel styles render inside the destination pages, so publishing one has
     to drop their cache too — TRAVEL_STYLE_TAGS carries "destinations" for
     exactly that reason. */
  "travel-style": TRAVEL_STYLE_TAGS,
  /* Strapi sends the content type's singular name. Both spellings are mapped
     because the endpoint is /api/homepages and the singular could be generated
     either way. */
  homepage: HOME_TAGS,
  "home-page": HOME_TAGS,
  experience: EXPERIENCES_TAGS,
  /* The gallery stands alone — it shares no tag with the destination pages,
     so publishing a photograph drops only /gallery. */
  "gallery-page": GALLERY_TAGS,
  package: PACKAGE_TAGS,
  packages: PACKAGE_TAGS,
};

/* Every tag the app uses, derived from the mapping so the two cannot drift
   apart — a content type added above is covered here for free. The fallback
   for a payload whose model we cannot place. */
const ALL_TAGS = [...new Set(Object.values(TAGS_BY_MODEL).flat())];

/**
 * The content type a webhook payload refers to.
 *
 * Strapi v5 sends both `model` ("home-page") and `uid`
 * ("api::home-page.home-page"). Reading either means a rename, or a difference
 * in how the singular gets generated, cannot silently break the hook. Media
 * events carry neither — that is what the null return means.
 */
function resolveModel(payload) {
  const model = typeof payload?.model === "string" ? payload.model : null;
  if (model) return model;

  const uid = typeof payload?.uid === "string" ? payload.uid : null;
  // "api::home-page.home-page" -> "home-page"
  return uid ? (uid.split(".").pop() ?? null) : null;
}

/**
 * Tags to drop for a payload, and whether the model was recognised.
 *
 * An unmapped model now revalidates EVERYTHING rather than no-opping. The old
 * behaviour — answer 200, invalidate nothing — is indistinguishable from a
 * working webhook in Strapi's log, so a content type added to the CMS but not
 * to the map above went stale silently until the next deployment. Dropping a
 * few extra tags costs one regeneration per page; getting it wrong costs an
 * editor their trust in the Publish button.
 *
 * The same applies to media events — someone swapping a photo in the library
 * sends no model, but the new file is referenced by pages already rendered.
 */
function resolveTags(payload) {
  const model = resolveModel(payload);

  if (model) {
    const tags = TAGS_BY_MODEL[model] ?? TAGS_BY_MODEL[model.toLowerCase()];
    if (tags) return { model, tags, matched: true };
  }

  return { model, tags: ALL_TAGS, matched: false };
}

/**
 * Drop the tagged Data Cache entries, then the Full Route Cache.
 *
 * Both are needed. revalidateTag() expires the Strapi responses and the
 * prerendered pages that consumed them, but content the browser fetches for
 * itself through /api/* is not covered by any page's tags, and neither is a
 * section whose fetch someone forgets to tag. revalidatePath("/", "layout")
 * forces a fresh render for every route under the root layout — the whole
 * site. It is the belt to the tags' braces, and the reason a publish no longer
 * needs a redeploy behind it.
 */
function purge(tags) {
  for (const tag of tags) revalidateTag(tag);
  revalidatePath("/", "layout");
}

/** null when the request is authorised, otherwise the response to return. */
function unauthorised(request) {
  const secret = process.env.STRAPI_REVALIDATE_SECRET;

  // Refuse rather than run unauthenticated: an unprotected revalidate endpoint
  // is a free cache-buster for anyone who finds the URL.
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, error: "STRAPI_REVALIDATE_SECRET is not set" },
      { status: 500 },
    );
  }

  const provided =
    request.headers.get("x-revalidate-secret") ??
    new URL(request.url).searchParams.get("secret");

  if (provided !== secret) {
    return NextResponse.json(
      { revalidated: false, error: "Invalid secret" },
      { status: 401 },
    );
  }

  return null;
}

export async function POST(request) {
  const denied = unauthorised(request);
  if (denied) return denied;

  /* Strapi always sends JSON, but a manual curl with no body should still
     purge rather than 400 — that is the escape hatch documented above. */
  const payload = await request.json().catch(() => null);
  const { model, tags, matched } = resolveTags(payload);

  purge(tags);

  if (!matched) {
    console.warn(
      `[revalidate] unmapped model ${model ?? "(none)"} for event ` +
        `${payload?.event ?? "(none)"} — purged everything. Add it to ` +
        `TAGS_BY_MODEL to narrow this.`,
    );
  }

  return NextResponse.json({
    revalidated: true,
    model,
    matched,
    tags,
    event: payload?.event ?? null,
  });
}

/* Manual purge, so the wiring can be tested from a browser or curl without
   hand-crafting a Strapi payload. Same secret, same effect as a POST whose
   model is unrecognised: everything goes. */
export async function GET(request) {
  const denied = unauthorised(request);
  if (denied) return denied;

  purge(ALL_TAGS);

  return NextResponse.json({ revalidated: true, tags: ALL_TAGS, manual: true });
}
