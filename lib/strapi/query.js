/* Serialiser for Strapi's bracket query syntax.
 *
 * Strapi returns ONLY flat scalar fields by default — components, media and
 * relations come back missing unless you ask for them by name. Asking is done
 * through `populate[a][populate][b]=*`-style keys, which is why CMS-backed
 * codebases drift toward 700-character query strings pasted between files.
 *
 * Writing the query as a nested object and serialising it here keeps it
 * readable and diffable, and lets each page compose its populate rules from
 * smaller named pieces (see lib/strapi/kerala.js).
 *
 *   buildQuery({ populate: { introSection: { populate: "*" } } })
 *     → "populate[introSection][populate]=*"
 *
 *   buildQuery({ filters: { slug: { $eq: "kerala" } }, fields: ["title"] })
 *     → "filters[slug][$eq]=kerala&fields[0]=title"
 *
 * `undefined` values are dropped so optional rules can be spread in
 * conditionally; `null` is kept, because Strapi treats it as a real filter
 * value.
 */
export function buildQuery(input) {
  return serialise(input).join("&");
}

function serialise(value, path = "") {
  if (value === undefined) return [];

  // Leaf: encode against the accumulated bracket path.
  if (value === null || typeof value !== "object") {
    return [`${path}=${encodeURIComponent(String(value))}`];
  }

  // Arrays use numeric keys — `fields[0]=a&fields[1]=b`. Strapi rejects the
  // repeated-key form (`fields=a&fields=b`) for most operators.
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => serialise(item, `${path}[${i}]`));
  }

  return Object.entries(value).flatMap(([key, child]) =>
    serialise(child, path ? `${path}[${encodeKey(key)}]` : encodeKey(key)),
  );
}

/* Field names are encoded, but Strapi's operator keys stay readable:
   encodeURIComponent turns `$eq` into `%24eq`, which the server decodes fine
   but which makes a logged URL much harder to scan. */
function encodeKey(key) {
  return encodeURIComponent(key).replace(/%24/g, "$");
}
