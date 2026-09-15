import { NextResponse } from "next/server";

import { getDestinationSlugs } from "@/lib/strapi/kerala";
import { getExperienceSlugs } from "@/lib/strapi/experiences";

/* The slugs that have a page behind them, for middleware.js.
 *
 * Middleware runs before the router and cannot reach Strapi itself — it has no
 * access to the server's data cache, and the API token has no business being
 * in the edge bundle. So it asks this route instead, and this route answers
 * from the same tagged fetches the pages use: publishing in Strapi purges the
 * tag through /api/revalidate, and the next call here sees the new slug. That
 * is what keeps the route list open — a destination published at 11am is
 * reachable at 11am, with no redeploy.
 *
 * Read-only and public by design: these slugs are already visible in the
 * navigation, the A to Z and the sitemap. Nothing here is not already a link.
 */

/* Must not be prerendered: a snapshot of the slug list taken at build time is
   exactly the staleness this route exists to avoid. The underlying Strapi
   fetches are still cached and tag-purged, so this is a cache read, not a
   round trip to the CMS on every call. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  /* Settled, not all-or-nothing: if experiences are unreachable we can still
     answer for destinations, and middleware treats a missing list as "do not
     filter this path" rather than 404ing everything under it. */
  const [destinations, experiences] = await Promise.all([
    getDestinationSlugs().catch(() => null),
    getExperienceSlugs().catch(() => null),
  ]);

  return NextResponse.json(
    {
      destinations: destinations ?? null,
      experiences: experiences ?? null,
    },
    /* Held briefly at the edge as well as in middleware's own memory. Sixty
       seconds is the longest a newly published page can 404, and it only
       applies to the very first request that misses both caches. */
    { headers: { "cache-control": "public, max-age=0, s-maxage=60" } },
  );
}
