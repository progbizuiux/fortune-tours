/* Editorial band above the /search results.
 *
 * The section is dynamic in the sense that matters on a search page: it follows
 * the filters. Pick an experience and the band changes to that theme — eyebrow,
 * heading, copy, call to action and photograph all come from here, none of it
 * hardcoded in the component. With no experience selected the page falls back
 * to DEFAULT_INSPIRATION.
 *
 * Keys are the `experience` values in lib/searchCatalog.js. A theme with no
 * entry falls back rather than rendering a half-empty band, so adding an
 * experience to the catalogue can never break this section.
 *
 * Images are placeholders from the existing public/ sets — same as the cards.
 */

export const DEFAULT_INSPIRATION = {
  theme: "Relax",
  title: "Travel at Your Own Pace",
  body: "No packed schedules. No rushing from one place to another. Just beautiful destinations, thoughtful stays and experiences that leave room to breathe.",
  cta: "Explore Relaxing Journeys",
  image: "/inner-page/innerpage.png",
  imageAlt: "A quiet deck above the sea at sunrise",
};

const INSPIRATIONS = {
  Backwaters: {
    theme: "Backwaters",
    title: "Let the Water Set the Clock",
    body: "Days measured in bends of the river. Villages that wave as you pass, meals cooked on board, and nowhere in particular to be by evening.",
    cta: "Explore Backwater Journeys",
    image: "/home/image-2.jpg",
    imageAlt: "A houseboat drifting through palm-lined backwaters",
  },
  "City Escapes": {
    theme: "City Escapes",
    title: "Cities Worth Slowing Down For",
    body: "Not a checklist of landmarks. A long breakfast, an afternoon in one neighbourhood, and the walk home when the streets finally empty.",
    cta: "Explore City Escapes",
    image: "/home/journal/city-guide.png",
    imageAlt: "A quiet café table on a European side street",
  },
  "Cultural Journeys": {
    theme: "Cultural Journeys",
    title: "Places That Keep Their Stories",
    body: "Temples still in daily use, crafts passed down through families, and hosts who would rather show you than tell you.",
    cta: "Explore Cultural Journeys",
    image: "/destination/japan.png",
    imageAlt: "A temple garden in soft morning light",
  },
  "Mountain Retreats": {
    theme: "Mountain Retreats",
    title: "Air Thin Enough to Hear Yourself",
    body: "Wake to snow on the windowsill and a valley that has not made a sound since midnight. Walk as far as you feel like, then stop.",
    cta: "Explore Mountain Retreats",
    image: "/destination/switzerland.png",
    imageAlt: "An alpine peak above a still valley",
  },
  "Nature & Wildlife": {
    theme: "Nature & Wildlife",
    title: "Mornings That Belong to the Forest",
    body: "Out before the mist lifts, back before the heat. Tea estates, elephant trails and waterfalls you hear long before you reach them.",
    cta: "Explore Wild Journeys",
    image: "/home/image-1.png",
    imageAlt: "Mist rising over tea estates at dawn",
  },
  "Northern Lights": {
    theme: "Northern Lights",
    title: "Nights That Do Not Stay Dark",
    body: "Wait by the fjord with the lamps off. Some nights nothing comes. On the ones that do, no photograph you have seen will have prepared you.",
    cta: "Explore Northern Lights",
    image: "/destination/norway.png",
    imageAlt: "Aurora over an arctic fjord",
  },
};

export function getInspiration({ experience } = {}) {
  return INSPIRATIONS[experience] ?? DEFAULT_INSPIRATION;
}
