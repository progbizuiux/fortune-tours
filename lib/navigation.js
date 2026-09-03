/* Content behind the navbar's mega menus.
 *
 * Everything the Destinations and Experiences dropdowns render — region names,
 * the countries under each region, the "Curated For You" cards, the concierge
 * promo and the experience tiles — comes from here. The menu components in
 * components/layout/navbar/ are shape-only, so this is the seam the CMS
 * replaces: swap these exports for a fetch and nothing above them changes.
 *
 * Only Africa's country list is in the design frame; the other regions are
 * filled in with sensible entries so every row has something to show until the
 * backend supplies the real mapping. Photographs are placeholders drawn from
 * the existing public/ sets — the design's Peru, Lakshadweep and family shots
 * are not in the repo yet. Update the `image` fields; nothing else depends on
 * them.
 */

// Keys the navbar uses to know which panel a link opens. Kept as constants so
// the trigger config and the panel components can never drift on a typo.
export const MENU_KEYS = Object.freeze({
  DESTINATIONS: "destinations",
  EXPERIENCES: "experiences",
  // The site-wide list behind the bar's menu button (About, Travel tips …).
  SITE: "site",
});

// The destinations that have a page of their own under /destinations/[slug],
// keyed by the name the menus print. The slug has to match what
// destinationSlug() in lib/strapi/kerala.js derives from the CMS entry,
// because that route sets dynamicParams = false — a slug with no entry behind
// it 404s instead of rendering. Add a line here when a page goes live.
const DESTINATION_PAGES = {
  India: "/destinations/india",
  Kerala: "/destinations/kerala",
};

// /search is the one live route that takes any place name, so it stays the
// landing place for everything without a page of its own.
const searchHref = (term) => `/search?term=${encodeURIComponent(term)}`;

// A destination's link: its own page when it has one, a search when it does
// not. The region grids and the curated cards both go through this, so a
// destination added above starts pointing at its page in every menu at once.
const destinationHref = (name) => DESTINATION_PAGES[name] ?? searchHref(name);

/* The /destinations/[slug] page for a name, or undefined. Exported so the
   resolvers here and in lib/destinationsAZ.js can prefer it over a region
   fallback: India has no `countries` entry yet but does have
   /destinations/india, and that is the page a reader wants. */
export const destinationPageHref = (name) => DESTINATION_PAGES[name];

const country = (name, tagline, href = destinationHref(name)) => ({
  name,
  tagline,
  href,
});

/* ── Site menu (the bar's menu button; "More" in the mobile drill-down) ────── */

// Two tiers, drawn at two sizes: the primary pages, then the smaller service
// links beneath them. Order is the design's.
export const SITE_MENU = {
  primary: [
    { label: "About", href: "/about-us" },
    /* Tips and guides are categories of the journal (lib/journal.js), not
       pages of their own; the archive opens on the matching filter. */
    { label: "Travel tips", href: "/journal?category=travel-tips" },
    { label: "Travel guides", href: "/journal?category=guides" },
    { label: "Custom trip planner", href: "/plan-my-trip" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/journal" },
  ],
  secondary: [
    /* No /services/* routes exist, so each service opens the contact page
       with the service named in the query for the form to pick up. Point
       these at their own pages the moment they are built. */
    { label: "Visa assistance", href: "/contact?service=visa-assistance" },
    { label: "Hotel bookings", href: "/contact?service=hotel-bookings" },
    { label: "Flight booking", href: "/contact?service=flight-booking" },
    { label: "Travel insurance", href: "/contact?service=travel-insurance" },
    {
      label: "Passport assistance",
      href: "/contact?service=passport-assistance",
    },
  ],
};

/* ── Destinations ─────────────────────────────────────────────────────────── */

// Order is the order the left-hand list renders in. The places under each
// region are blacktomato.com's destination lists, verbatim and in their order
// (a country can sit under several regions there, and so it does here). The
// menu lays them out column-major (down, then across) — see DestinationsMenu.
// Taglines are ours: the design draws one under every name.
const RAW_DESTINATION_REGIONS = [
  {
    key: "africa",
    label: "Africa",
    href: "/africa",
    countries: [
      country("Botswana", "Delta • Safari"),
      country("Congo", "Rainforest • River"),
      country("Egypt", "Pyramids • Nile"),
      country("Ethiopia", "Lalibela • Highlands"),
      country("Kenya", "Safari • Nairobi"),
      country("Madagascar", "Lemurs • Baobabs"),
      country("Malawi", "Lake • Mountains"),
      country("Mauritius", "Beaches • Lagoons"),
      country("Morocco", "Marrakech • Atlas"),
      country("Mozambique", "Beaches • Islands"),
      country("Namibia", "Dunes • Skeleton Coast"),
      country("Rwanda", "Gorillas • Kigali"),
      country("The Seychelles", "Islands • Beaches"),
      country("South Africa", "Cape Town • Winelands"),
      country("Tanzania & Zanzibar", "Serengeti • Spice Islands"),
      country("Uganda", "Gorillas • Nile source"),
      country("Zambia", "Victoria Falls • Walking safaris"),
      country("Zimbabwe", "Victoria Falls • Hwange"),
    ],
  },
  {
    key: "arctic-circle",
    label: "Arctic Circle",
    href: "/arctic-circle",
    countries: [
      country("Antarctica", "Ice • Penguins"),
      country("Canada", "Yukon • Northern lights"),
      country("Finland", "Lapland • Saunas"),
      country("Greenland", "Icebergs • Inuit culture"),
      country("Iceland", "Glaciers • Geysers"),
      country("Norway", "Fjords • Aurora"),
      country("Sweden", "Ice hotel • Kiruna"),
    ],
  },
  {
    key: "asia",
    label: "Asia",
    href: "/asia",
    countries: [
      country("Bhutan", "Monasteries • Himalaya"),
      country("Borneo", "Orangutans • Rainforest"),
      country("Cambodia", "Angkor • Siem Reap"),
      country("China", "Great Wall • Shanghai"),
      country("India", "Taj Mahal • Rajasthan"),
      country("Indonesia", "Bali • Komodo"),
      country("Israel", "Jerusalem • Dead Sea"),
      country("Japan", "Temples • Cherry blossom"),
      country("Jordan", "Petra • Wadi Rum"),
      country("Laos", "Luang Prabang • Mekong"),
      country("Macau", "Heritage • Skyline"),
      country("Malaysia", "Kuala Lumpur • Borneo"),
      country("The Maldives", "Atolls • Overwater villas"),
      country("Mauritius", "Beaches • Lagoons"),
      country("Mongolia", "Steppe • Gobi"),
      country("Myanmar", "Bagan • Inle Lake"),
      country("Nepal", "Everest • Kathmandu"),
      country("Oman", "Wadis • Muscat"),
      country("Papua New Guinea", "Tribes • Diving"),
      country("The Philippines", "Palawan • Cebu"),
      country("Qatar", "Doha • Desert"),
      country("The Seychelles", "Islands • Beaches"),
      country("Singapore", "Gardens • Skyline"),
      country("South Korea", "Seoul • Jeju"),
      country("Sri Lanka", "Tea country • Beaches"),
      country("Taiwan", "Taipei • Night markets"),
      country("Thailand", "Bangkok • Islands"),
      country("The United Arab Emirates", "Dubai • Abu Dhabi"),
      country("Vietnam", "Ha Long Bay • Hanoi"),
    ],
  },
  {
    key: "australasia-oceania",
    label: "Australasia & Oceania",
    href: "/australasia-oceania",
    countries: [
      country("Australia", "Reef • Outback"),
      country("The Cook Islands", "Rarotonga • Aitutaki"),
      country("Fiji", "Islands • Reefs"),
      country("French Polynesia", "Bora Bora • Tahiti"),
      country("New Zealand", "Fjords • Glaciers"),
    ],
  },
  {
    key: "caribbean",
    label: "Caribbean",
    href: "/caribbean",
    countries: [
      country("Anguilla", "Beaches • Quiet coves"),
      country("Antigua", "365 beaches • Sailing"),
      country("Bahamas", "Islands • Reefs"),
      country("Barbados", "Beaches • Rum"),
      country("The British Virgin Islands", "Sailing • Islands"),
      country("Grenada", "Spice • Beaches"),
      country("Jamaica", "Reggae • Blue Mountains"),
      country("Mustique", "Private island • Villas"),
      country("St Barths", "Chic • Beaches"),
      country("St Lucia", "Pitons • Rainforest"),
      country("St Vincent and the Grenadines", "Islands • Sailing"),
      country("Turks and Caicos", "Grace Bay • Reefs"),
    ],
  },
  {
    key: "europe",
    label: "Europe",
    href: "/europe",
    countries: [
      country("Austria", "Vienna • Alps"),
      country("Belgium", "Bruges • Brussels"),
      country("Croatia", "Dubrovnik • Islands"),
      country("Czech Republic", "Prague • Castles"),
      country("Denmark", "Copenhagen • Design"),
      country("England", "London • Cotswolds"),
      country("Finland", "Lapland • Saunas"),
      country("France", "Paris • Provence"),
      country("Georgia", "Tbilisi • Caucasus"),
      country("Germany", "Berlin • Bavaria"),
      country("Greece", "Islands • Athens"),
      country("Greenland", "Icebergs • Inuit culture"),
      country("Hungary", "Budapest • Thermal baths"),
      country("Iceland", "Glaciers • Geysers"),
      country("Ireland & Northern Ireland", "Dublin • Wild Atlantic Way"),
      country("Italy", "Rome • Amalfi"),
      country("Lithuania", "Vilnius • Baltic coast"),
      country("Montenegro", "Kotor • Adriatic"),
      country("Netherlands", "Amsterdam • Tulips"),
      country("Norway", "Fjords • Aurora"),
      country("Portugal", "Lisbon • Algarve"),
      country("Romania", "Transylvania • Carpathians"),
      country("Scotland", "Highlands • Edinburgh"),
      country("Slovenia", "Lake Bled • Alps"),
      country("Spain", "Barcelona • Andalusia"),
      country("Sweden", "Stockholm • Archipelago"),
      country("Switzerland", "Alps • Lakes"),
      country("Turkey", "Istanbul • Cappadocia"),
      country("UK", "London • Highlands"),
    ],
  },
  {
    key: "indian-ocean",
    label: "Indian Ocean",
    href: "/indian-ocean",
    countries: [
      country("Madagascar", "Lemurs • Baobabs"),
      country("Mauritius", "Beaches • Lagoons"),
      country("The Maldives", "Atolls • Overwater villas"),
      country("Réunion Island", "Volcano • Trails"),
      country("The Seychelles", "Islands • Beaches"),
      country("Sri Lanka", "Tea country • Beaches"),
    ],
  },
  {
    key: "indian-subcontinent",
    label: "Indian Subcontinent",
    href: "/indian-subcontinent",
    countries: [
      country("Bhutan", "Monasteries • Himalaya"),
      country("India", "Taj Mahal • Rajasthan"),
      country("Nepal", "Everest • Kathmandu"),
      country("Sri Lanka", "Tea country • Beaches"),
    ],
  },
  {
    key: "latin-america",
    label: "Latin America",
    href: "/latin-america",
    countries: [
      country("Argentina", "Patagonia • Buenos Aires"),
      country("Belize", "Reef • Rainforest"),
      country("Bolivia", "Salt flats • La Paz"),
      country("Brazil", "Rio • Amazon"),
      country("Chile", "Atacama • Torres del Paine"),
      country("Colombia", "Cartagena • Coffee"),
      country("Costa Rica", "Rainforest • Wildlife"),
      country("Cuba", "Havana • Vintage cars"),
      country("Ecuador & the Galapagos", "Galápagos • Andes"),
      country("Guatemala", "Tikal • Lake Atitlán"),
      country("Mexico", "Yucatán • Oaxaca"),
      country("Nicaragua", "Volcanoes • Colonial towns"),
      country("Panama", "Canal • Islands"),
      country("Peru", "Machu Picchu • Cusco"),
      country("Uruguay", "Montevideo • Coast"),
    ],
  },
  {
    key: "middle-east",
    label: "Middle East",
    href: "/middle-east",
    countries: [
      country("Egypt", "Pyramids • Nile"),
      country("Israel", "Jerusalem • Dead Sea"),
      country("Jordan", "Petra • Wadi Rum"),
      country("Oman", "Wadis • Muscat"),
      country("Qatar", "Doha • Desert"),
      country("Turkey", "Istanbul • Cappadocia"),
      country("The United Arab Emirates", "Dubai • Abu Dhabi"),
    ],
  },
  {
    key: "north-america",
    label: "North America",
    href: "/north-america",
    countries: [
      country("Canada", "Rockies • Vancouver"),
      country("Mexico", "Yucatán • Oaxaca"),
      country("The USA", "National parks • Cities"),
    ],
  },
  {
    key: "south-east-asia",
    label: "South East Asia",
    href: "/south-east-asia",
    countries: [
      country("Borneo", "Orangutans • Rainforest"),
      country("Cambodia", "Angkor • Siem Reap"),
      country("Indonesia", "Bali • Komodo"),
      country("Laos", "Luang Prabang • Mekong"),
      country("Malaysia", "Kuala Lumpur • Borneo"),
      country("Myanmar", "Bagan • Inle Lake"),
      country("Papua New Guinea", "Tribes • Diving"),
      country("The Philippines", "Palawan • Cebu"),
      country("Singapore", "Gardens • Skyline"),
      country("Thailand", "Bangkok • Islands"),
      country("Vietnam", "Ha Long Bay • Hanoi"),
    ],
  },
  {
    key: "south-pacific",
    label: "South Pacific",
    href: "/south-pacific",
    countries: [
      country("The Cook Islands", "Rarotonga • Aitutaki"),
      country("Fiji", "Islands • Reefs"),
      country("French Polynesia", "Bora Bora • Tahiti"),
    ],
  },
];

/* Accents are folded before the non-alphanumerics are dropped, so "Réunion
   Island" becomes `reunion-island` — the slug an editor would type — rather
   than `r-union-island`. */
const slugify = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const DESTINATION_REGIONS = RAW_DESTINATION_REGIONS.map((region) => ({
  ...region,
  countries: region.countries.map((c) => ({
    ...c,
    slug: slugify(c.name),
    href: `/${region.key}/${slugify(c.name)}`,
  })),
}));

/* Every region a name is listed under, by name — Mauritius sits under Africa,
   Asia and the Indian Ocean. resolveCountryHref() walks this when the region
   a reader is looking at has no page for the country but another one does. */
const REGIONS_BY_COUNTRY = new Map();
for (const region of DESTINATION_REGIONS) {
  for (const place of region.countries) {
    const entries = REGIONS_BY_COUNTRY.get(place.name) ?? [];
    entries.push({ key: region.key, href: place.href, regionHref: region.href });
    REGIONS_BY_COUNTRY.set(place.name, entries);
  }
}

/**
 * Where a country row in the Destinations menu should link.
 *
 * A country page exists only where a Strapi `countries` entry names BOTH the
 * region and the country — app/[slug]/[country]/page.js 404s on anything
 * else — and 42 of the 149 rows have one today. So the published set decides,
 * the same way /destinations/a-z resolves its names:
 *   1. the page under the region the reader is looking at, if published;
 *   2. else the page under any other region the country is listed in
 *      (Asia → Mauritius lands on /africa/mauritius, the one that exists);
 *   3. else its /destinations/[slug] page where DESTINATION_PAGES has one
 *      (Asia → India lands on /destinations/india);
 *   4. else the region's own page, which always renders.
 *
 * @param {object} place        a country from DESTINATION_REGIONS[n].countries
 * @param {object} region       the region it is being shown under
 * @param {Set<string>} published  "<regionKey>/<countrySlug>" for every
 *   published country — see getCountryParams() in lib/strapi/country.js.
 *   Empty or missing (Strapi unreachable) degrades every row to its region.
 */
export function resolveCountryHref(place, region, published) {
  if (published?.has(`${region.key}/${place.slug}`)) return place.href;

  const elsewhere = (REGIONS_BY_COUNTRY.get(place.name) ?? []).find((entry) =>
    published?.has(`${entry.key}/${place.slug}`),
  );

  return elsewhere?.href ?? destinationPageHref(place.name) ?? region.href;
}

/* The same rule for a name on its own, with no region in view — the curated
   cards. First region with a page wins; otherwise the first region's page. */
export function resolveCountryHrefByName(name, published) {
  const entries = REGIONS_BY_COUNTRY.get(name) ?? [];
  const slug = slugify(name);
  const live = entries.find((entry) => published?.has(`${entry.key}/${slug}`));

  return (
    live?.href ??
    destinationPageHref(name) ??
    entries[0]?.regionHref ??
    searchHref(name)
  );
}

/* The published set as the menus want it, from getCountryParams()'s
   [{ slug: region, country }] rows. Tolerates undefined so a menu can render
   before the layout has anything to give it. */
export function publishedCountrySet(params) {
  return new Set(
    (params ?? []).map((entry) => `${entry.slug}/${entry.country}`),
  );
}

// Closes the region list. A plain link rather than a region: it has no country
// panel of its own, which is why the design draws it without a chevron.
//
// Points at /destinations/a-z, the index that lists every name in this file
// alphabetically and by region. It used to land on /search, which was a
// stand-in until that page existed — and a poor one, since /search carries
// `robots: { index: false }`, so the site's one "browse everything" entry sent
// readers and crawlers to a page it had asked Google to ignore.
export const ALL_DESTINATIONS_LINK = {
  label: "A to Z Destination",
  href: "/destinations/a-z",
};

// The default right-hand column of the Destinations menu, shown until a region
// is hovered.
//
// A card either carries a fixed `href` (a destination page or a package page
// that exists in this app) or a `country` name, which the menu resolves
// against the published country set at render time — see
// resolveCuratedHref(). Peru and the Maldives have no page of their own yet,
// so they land on their region page until an editor publishes them, at which
// point they start pointing at /latin-america/peru and /asia/the-maldives
// with no edit here.
export const CURATED_DESTINATIONS = [
  {
    key: "india",
    title: "India",
    tagline: "Rich heritage & diverse landscapes",
    image: "/destination/india.avif",
    alt: "The Taj Mahal reflected in its long pool at dawn",
    href: "/destinations/india",
  },
  {
    key: "kerala",
    title: "Kerala",
    tagline: "Backwaters & bliss",
    image: "/destinations/kerala/house-boat.avif",
    alt: "A houseboat drifting down a palm-lined Kerala backwater",
    href: destinationHref("Kerala"),
  },
  {
    key: "lakshadweep",
    title: "Lakshadweep",
    tagline: "Tropical island paradise",
    image: "/experiance/bali.png",
    alt: "Turquoise lagoon meeting a palm-fringed beach from above",
    // Lakshadweep is not a country in the region lists and has no destination
    // page; the Agatti & Kalpitti package is the one page about it.
    href: "/destinations/kerala/lakshadweep-agatti-kalpitti",
  },
  {
    key: "peru",
    title: "Peru",
    tagline: "Ancient ruins & culture",
    image: "/destination/switzerland.avif",
    alt: "Stone ruins on a green ridge beneath cloud-wrapped peaks",
    country: "Peru",
  },
  {
    key: "maldives",
    title: "Maldives",
    tagline: "Crystal waters & calm",
    image: "/experiance/maldives.png",
    alt: "Overwater villas on a boardwalk above a clear lagoon",
    country: "The Maldives",
  },
];

/* A curated card's link: its fixed href, or its country resolved against what
   is published. */
export function resolveCuratedHref(place, published) {
  return place.href ?? resolveCountryHrefByName(place.country, published);
}

// The card beside the country grid once a region is hovered.
export const CONCIERGE_PROMO = {
  lead: "For more queries,",
  phoneLabel: "Call +1 (800) 555-0146",
  phoneHref: "tel:+18005550146",
  hours: "Mon–Fri, 9:00 AM – 6:00 PM EST",
  note: "Call us to book, ask a question, or get help with your trip.",
  // house-boat.avif is 2878×2800 — the same shape as the 414×400 card, so the
  // whole photograph shows. The 16:9 and 12MB alternatives in public/ were
  // either cropped to a sliver by the card or left it blank while optimising.
  image: "/destinations/kerala/house-boat.avif",
  alt: "A houseboat drifting down a palm-lined Kerala backwater",
};

/* ── Experiences ──────────────────────────────────────────────────────────── */

// Each tile links to /experiences/[slug], and the slug has to be the one
// lib/strapi/experiences.js derives for the CMS entry: its own `slug` when an
// editor has set one, otherwise its `name` slugified. That is why two of these
// does not match the label printed on the tile: the entry is named "Families",
// so /families is the live URL while the design calls it Family Holidays. A
// slug with no entry behind it reaches the page's notFound() and renders a 404,
// which is what /experiences/family and /experiences/pilgrimage did.
export const EXPERIENCE_MENU = [
  {
    key: "family",
    label: "Family Holidays",
    href: "/experiences/families",
    image: "/experiance/city-escape.png",
    alt: "A family walking down a sunlit old-town street together",
  },
  {
    key: "honeymoon",
    label: "Honeymoon Holidays",
    href: "/experiences/honeymoon",
    image: "/experiance/honey-moon.jpg",
    alt: "A couple looking out over a calm sea at sunset",
  },
  {
    key: "luxury",
    label: "Luxury Holidays",
    href: "/experiences/luxury",
    image: "/home/image-1.png",
    alt: "A luxury river yacht catching the last light on open water",
  },
  {
    key: "adventure",
    label: "Adventure Holidays",
    href: "/experiences/adventure",
    image: "/destinations/kerala/adventure-nature.avif",
    alt: "Hikers looking out over mist-covered forested hills",
  },
  {
    key: "spiritual",
    label: "Spiritual",
    href: "/experiences/spiritual",
    image: "/destinations/kerala/culture-heritage.jpg",
    alt: "A colonnade of carved sandstone arches in soft light",
  },
];
