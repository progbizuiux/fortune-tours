/* Catalogue behind /search.
 *
 * Hard-coded until Strapi lands. The filtering below is deliberately pure and
 * synchronous so the page can stay a server component: swapping this module for
 * a fetch means changing `filterJourneys` into an async call and awaiting it in
 * app/search/page.js — no component touched.
 *
 * Images are placeholders drawn from the existing public/ sets (there is no
 * Kerala or Austria photography in the repo yet). Drop the real files in and
 * update the `image` fields; nothing else depends on them.
 */

// Filter groups render left to right in the toolbar in this order, and each
// `key` is also its URL param — /search?destination=India&experience=Backwaters.
// Options are listed rather than derived from JOURNEYS so a group can offer a
// value the catalogue does not cover yet without the option silently vanishing.
export const FILTER_GROUPS = [
  {
    key: "destination",
    label: "Destinations",
    allLabel: "All destinations",
    options: ["India", "Austria", "Japan", "Switzerland", "Norway"],
  },
  {
    key: "experience",
    label: "Experiences",
    allLabel: "All experiences",
    options: [
      "Backwaters",
      "City Escapes",
      "Cultural Journeys",
      "Mountain Retreats",
      "Nature & Wildlife",
      "Northern Lights",
    ],
  },
  {
    key: "package",
    label: "Popular Packages",
    allLabel: "All packages",
    options: [
      "Kerala Serenity",
      "Alpine Discovery",
      "Nordic Lights",
      "Japan Classics",
      "European Cities",
    ],
  },
];

export const JOURNEYS = [
  {
    slug: "munnar",
    name: "Munnar",
    description: "Rolling tea estates, misty hills, and scenic waterfalls.",
    image: "/inner-page/Rectangle 37.png",
    country: "India",
    region: "Kerala",
    experience: "Nature & Wildlife",
    packages: ["Kerala Serenity"],
  },
  {
    slug: "alleppey",
    name: "Alleppey",
    description: "Peaceful backwaters, houseboat cruises, and village charm.",
    image: "/inner-page/Rectangle 38.png",
    country: "India",
    region: "Kerala",
    experience: "Backwaters",
    packages: ["Kerala Serenity"],
  },
  {
    slug: "wayanad",
    name: "Wayanad",
    description: "Lush forests, waterfalls, caves, and nature trails.",
    image: "/inner-page/Rectangle 39.png",
    country: "India",
    region: "Kerala",
    experience: "Nature & Wildlife",
    packages: ["Kerala Serenity"],
  },
  {
    slug: "thekkady",
    name: "Thekkady",
    description: "Wildlife safaris, spice plantations, and bamboo rafting.",
    image: "/inner-page/Rectangle 40.png",
    country: "India",
    region: "Kerala",
    experience: "Nature & Wildlife",
    packages: ["Kerala Serenity"],
  },
  {
    slug: "kochi",
    name: "Kochi",
    description: "Colonial streets, harbour sunsets, and Kathakali nights.",
    image: "/inner-page/innerpage.png",
    country: "India",
    region: "Kerala",
    experience: "City Escapes",
    packages: ["Kerala Serenity", "European Cities"],
  },
  {
    slug: "vienna",
    name: "Vienna",
    description: "Imperial palaces, coffee houses, and concert halls.",
    image: "/inner-page/Rectangle 37.png",
    country: "Austria",
    region: "Vienna",
    experience: "City Escapes",
    packages: ["European Cities"],
  },
  {
    slug: "hallstatt",
    name: "Hallstatt",
    description: "Lakeside cottages under sheer alpine walls.",
    image: "/inner-page/Rectangle 38.png",
    country: "Austria",
    region: "Salzkammergut",
    experience: "Mountain Retreats",
    packages: ["Alpine Discovery"],
  },
  {
    slug: "kyoto",
    name: "Kyoto",
    description: "Temple gardens, tea houses, and blossom-lined canals.",
    image: "/inner-page/Rectangle 39.png",
    country: "Japan",
    region: "Kansai",
    experience: "Cultural Journeys",
    packages: ["Japan Classics"],
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    description: "Neon avenues, quiet shrines, and midnight ramen.",
    image: "/inner-page/Rectangle 40.png",
    country: "Japan",
    region: "Kanto",
    experience: "City Escapes",
    packages: ["Japan Classics"],
  },
  {
    slug: "zermatt",
    name: "Zermatt",
    description: "Car-free lanes beneath the shadow of the Matterhorn.",
    image: "/inner-page/innerpage.png",
    country: "Switzerland",
    region: "Valais",
    experience: "Mountain Retreats",
    packages: ["Alpine Discovery"],
  },
  {
    slug: "lucerne",
    name: "Lucerne",
    description: "A covered bridge, a still lake, and mountains all around.",
    image: "/inner-page/Rectangle 37.png",
    country: "Switzerland",
    region: "Central Switzerland",
    experience: "City Escapes",
    packages: ["Alpine Discovery", "European Cities"],
  },
  {
    slug: "tromso",
    name: "Tromsø",
    description: "Aurora skies, fjord crossings, and arctic silence.",
    image: "/inner-page/Rectangle 38.png",
    country: "Norway",
    region: "Troms",
    experience: "Northern Lights",
    packages: ["Nordic Lights"],
  },
  {
    slug: "bergen",
    name: "Bergen",
    description: "Wooden wharves, rain-washed streets, and fjord ferries.",
    image: "/inner-page/Rectangle 39.png",
    country: "Norway",
    region: "Vestland",
    experience: "City Escapes",
    packages: ["Nordic Lights", "European Cities"],
  },
];

// Region is in here so ?term=kerala returns the Kerala towns even though no
// card carries the word — that is the search the URL scheme is built around.
function haystack(journey) {
  return [
    journey.name,
    journey.region,
    journey.country,
    journey.experience,
    journey.description,
    ...journey.packages,
  ]
    .join(" ")
    .toLowerCase();
}

/* Every filter is optional and they AND together. `term` matches each
   whitespace-separated word independently, so "kerala backwaters" narrows
   rather than looking for that exact phrase. */
export function filterJourneys({ term, destination, experience, pkg } = {}) {
  const words = (term ?? "").trim().toLowerCase().split(/\s+/).filter(Boolean);

  return JOURNEYS.filter((journey) => {
    if (destination && journey.country !== destination) return false;
    if (experience && journey.experience !== experience) return false;
    if (pkg && !journey.packages.includes(pkg)) return false;
    if (!words.length) return true;

    const text = haystack(journey);
    return words.every((word) => text.includes(word));
  });
}
