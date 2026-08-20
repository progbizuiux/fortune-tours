/* Helpers for Strapi dynamic zones.
 *
 * A dynamic zone is an ordered list where the editor picks each entry's type;
 * every item carries a `__component` tag naming it ("sections.hero"). That tag
 * is the discriminator everything here keys off.
 *
 * The homepage uses one; the Kerala page does not — its content type has fixed
 * named slots instead. Both models are in play, so these stay generic rather
 * than living inside lib/strapi/home.js.
 */

/**
 * Build the `populate` rule for a dynamic zone from a per-block map.
 *
 * Dynamic zones ignore `populate: "*"` past the first level, and each block
 * type needs its own rule. Keeping those rules in one map next to the block
 * list means adding a block is a single edit here rather than a hunt through a
 * long query string.
 *
 *   zonePopulate({ "sections.hero": { backgroundImage: true } })
 *     → { on: { "sections.hero": { populate: { backgroundImage: true } } } }
 */
export function zonePopulate(byComponent) {
  return {
    on: Object.fromEntries(
      Object.entries(byComponent).map(([uid, populate]) => [uid, { populate }]),
    ),
  };
}

/**
 * Index a zone by `__component`, keeping the FIRST entry of each type.
 *
 * Used by pages that render a fixed arrangement and only want the CMS to
 * supply each section's content — the page's own JSX decides the order. A page
 * that wants the editor to control order should map over the zone directly
 * instead, dispatching on `__component`.
 */
export function indexBlocks(zone) {
  const index = {};

  for (const block of Array.isArray(zone) ? zone : []) {
    const uid = block?.__component;
    if (uid && !(uid in index)) index[uid] = block;
  }

  return index;
}

/** Every entry of one type, in zone order — for zones that repeat a block. */
export function blocksOf(zone, uid) {
  return (Array.isArray(zone) ? zone : []).filter(
    (block) => block?.__component === uid,
  );
}
