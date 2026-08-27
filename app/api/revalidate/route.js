import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { DESTINATION_TAGS } from "@/lib/strapi/destination";
import { EXPERIENCES_TAGS } from "@/lib/strapi/experiences";
import { HOME_TAGS } from "@/lib/strapi/home";
import { KERALA_TAGS } from "@/lib/strapi/kerala";
import { TRAVEL_STYLE_TAGS } from "@/lib/strapi/travel-styles";

/* On-demand ISR. Strapi calls this on publish so an edit appears immediately
 * instead of waiting out the page's revalidate window.
 *
 * This is the half that makes ISR worth using. Without it the only lever is
 * the timer, and the temptation is to set it very low — which is really just
 * SSR with extra steps. With it, pages can cache for an hour and still update
 * the moment someone hits Publish.
 *
 * Wiring it up in Strapi: Settings → Webhooks → Create new webhook
 *   URL     https://<site>/api/revalidate
 *   Headers x-revalidate-secret: <the STRAPI_REVALIDATE_SECRET value>
 *   Events  Entry publish, unpublish, update, delete
 */

/* Which cache tags each content type invalidates. Tags come from the module
   that owns the fetch, so a page's tags are declared once and cannot drift
   apart from what its query actually tagged. */
const TAGS_BY_MODEL = {
  "kerala-page": KERALA_TAGS,
  /* The region pages behind /africa and its siblings. They share the
     "destinations" tag with Kerala, so publishing either drops both — the
     cheaper mistake, since the two describe the same places. */
  "destination-page": DESTINATION_TAGS,
  /* Travel styles render inside the destination pages, so publishing one has
     to drop their cache too — TRAVEL_STYLE_TAGS carries "destinations" for
     exactly that reason. */
  "travel-style": TRAVEL_STYLE_TAGS,
  /* Strapi sends the content type's singular name. Both spellings are mapped
     because the endpoint is /api/homepages and the singular could be generated
     either way — an unmapped model would silently no-op. */
  homepage: HOME_TAGS,
  "home-page": HOME_TAGS,
  /* Experience pages were missing here, so publishing one no-opped and the
     page kept serving its cached copy until the hour ran out. */
  experience: EXPERIENCES_TAGS,
};

/* Every tag the app uses, derived from the mapping so it cannot drift out of
   sync with it. The fallback for unmapped models. */
const ALL_TAGS = [...new Set(Object.values(TAGS_BY_MODEL).flat())];

export async function POST(request) {
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

  const payload = await request.json().catch(() => null);
  const model = payload?.model;
  const mapped = model ? TAGS_BY_MODEL[model] : undefined;

  /* An unmapped model drops EVERY tag rather than doing nothing.
   *
   * The mapping above is hand-maintained, so it drifts: add a content type in
   * Strapi, forget to add it here, and that content silently serves stale for
   * the whole revalidate window with no error anywhere to notice. That already
   * happened once with experiences. Guessing wrong in this direction costs one
   * extra background regeneration on the next visit; guessing wrong in the
   * other direction costs an hour of stale content and a support question.
   *
   * `fellThrough` in the response is the signal to add the model above — the
   * site is correct either way, this just keeps invalidation targeted. */
  const tags = mapped ?? ALL_TAGS;

  for (const tag of tags) revalidateTag(tag);

  return NextResponse.json({
    revalidated: true,
    model: model ?? null,
    tags,
    fellThrough: !mapped,
    event: payload?.event ?? null,
  });
}
