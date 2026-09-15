import { buildQuery } from "./query";

/* The single door onto Strapi. Every read in the app goes through here.
 *
 * Deliberately native `fetch`, not the axios instance in lib/axios.js. Next
 * only caches through its patched global fetch, so axios reads would get:
 *   - no Data Cache, so no ISR at the data layer
 *   - no request memoisation, so generateMetadata and the page body each pay
 *     for the same call
 *   - no cache tags, so no way to invalidate on publish
 * axios stays for form POSTs, which are uncached by nature.
 */

const RAW_BASE = process.env.STRAPI_API_URL;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

/* An hour, not the 5s seen in older projects here. Tag invalidation is the
   real freshness mechanism (see app/api/revalidate/route.js) — this window is
   only the backstop for when a webhook is missed. */
export const DEFAULT_REVALIDATE = 3600;

const TIMEOUT_MS = 15000;

export class StrapiError extends Error {
  constructor(message, { status, url, body } = {}) {
    super(message);
    this.name = "StrapiError";
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

export function strapiBaseUrl() {
  if (!RAW_BASE) {
    throw new StrapiError(
      "STRAPI_API_URL is not set. Copy .env.example to .env.local and fill it in.",
    );
  }
  return RAW_BASE.replace(/\/+$/, "");
}

/* The origin without the /api suffix — where uploaded media is served from. */
export function strapiMediaBase() {
  return strapiBaseUrl().replace(/\/api$/, "");
}

/**
 * Fetch a Strapi endpoint and return the parsed envelope ({ data, meta }).
 *
 * THROWS on a transport error, a non-2xx status, or an unparseable body. That
 * is deliberate and it is what makes ISR safe: when a regeneration throws,
 * Next keeps serving the last good render. Swallowing the error and returning
 * an empty object instead would bake a blank page into the cache for the whole
 * revalidate window — the failure mode worth avoiding here.
 *
 * @param {string} path   Endpoint path, e.g. "kerala-pages"
 * @param {object} [opts]
 * @param {object} [opts.query]       Nested query object — see buildQuery
 * @param {string[]} [opts.tags]      Cache tags for revalidateTag()
 * @param {number|false} [opts.revalidate]  Seconds, or false to opt out
 */
export async function strapiFetch(path, opts = {}) {
  const { query, tags = [], revalidate = DEFAULT_REVALIDATE } = opts;

  const search = query ? `?${buildQuery(query)}` : "";
  const url = `${strapiBaseUrl()}/${String(path).replace(/^\/+/, "")}${search}`;

  let res;
  try {
    res = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { tags, revalidate },
    });
  } catch (cause) {
    // DNS failure, connection refused, or the timeout above.
    throw new StrapiError(`Strapi request failed: ${cause.message}`, { url });
  }

  if (!res.ok) {
    // Strapi puts a useful message in the body on 4xx — a malformed populate
    // rule reads as a 400 with the offending key named, so it is worth keeping.
    const body = await res.text().catch(() => "");
    throw new StrapiError(`Strapi responded ${res.status}`, {
      status: res.status,
      url,
      body: body.slice(0, 500),
    });
  }

  try {
    return await res.json();
  } catch (cause) {
    throw new StrapiError(`Strapi returned invalid JSON: ${cause.message}`, {
      status: res.status,
      url,
    });
  }
}

/**
 * Every row of a collection, across as many requests as it takes.
 *
 * Strapi caps the page it actually returns at 100 rows regardless of the
 * `pagination.pageSize` asked for — `{ pageSize: 200 }` silently comes back as
 * page 1 of 100 with a `pageCount` of 2, not the 200 rows requested. A caller
 * that reads `json.data` straight off a single strapiFetch() call is quietly
 * missing every row from page 2 on, which is exactly how the `countries`
 * collection lost 33 published entries to /europe, /asia and friends once it
 * grew past 100 (BUG-032): getCountryParams() and fetchPublishedCountries()
 * both asked for 200 in one page and only ever got the first 100 back, so
 * every country beyond that silently read as unpublished.
 *
 * Loops on `meta.pagination.pageCount` instead of assuming one page is
 * enough, so this keeps working however large the collection grows. Tags and
 * revalidate are the same across every page — pass them once, not per call.
 */
export async function strapiFetchAll(path, opts = {}) {
  const { query = {}, ...rest } = opts;
  const pageSize = query.pagination?.pageSize ?? 100;

  const data = [];
  let page = 1;
  let pageCount = 1;

  do {
    const json = await strapiFetch(path, {
      ...rest,
      query: { ...query, pagination: { ...query.pagination, page, pageSize } },
    });
    data.push(...(json?.data ?? []));
    pageCount = json?.meta?.pagination?.pageCount ?? 1;
    page += 1;
  } while (page <= pageCount);

  return { data };
}

/**
 * First entry of a collection, or null when the collection is empty.
 *
 * Strapi models some genuinely single pages as collection types holding one
 * entry — `kerala-pages` is one — so "no entry" is a real, expected state that
 * should drive notFound(), not an error. Distinguishing it from a transport
 * failure (which throws, above) is the whole point of this split.
 */
export async function strapiFindOne(path, opts = {}) {
  const json = await strapiFetch(path, opts);
  const data = json?.data;

  if (Array.isArray(data)) return data[0] ?? null;
  return data ?? null;
}
