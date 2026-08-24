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

/* Region rows link to their own page at /[slug] and the curated cards to
   /destinations/[slug] — in both cases the entry's `key` IS the slug, so the
   two stay in step by construction. Individual COUNTRY links still go to
   /search: there is no per-country page yet. */
const searchHref = (term) => `/search?term=${encodeURIComponent(term)}`;

const country = (name, tagline, href = searchHref(name)) => ({
  name,
  tagline,
  href,
});

/* ── Site menu (the bar's menu button; "More" in the mobile drill-down) ────── */

// Two tiers, drawn at two sizes: the primary pages, then the smaller service
// links beneath them. Order is the design's.
export const SITE_MENU = {
  primary: [
    { label: "About", href: "/about" },
    { label: "Travel tips", href: "/travel-tips" },
    { label: "Travel guides", href: "/travel-guides" },
    { label: "Custom trip planner", href: "/custom-trip-planner" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
  secondary: [
    { label: "Visa assistance", href: "/services/visa-assistance" },
    { label: "Hotel bookings", href: "/services/hotel-bookings" },
    { label: "Flight booking", href: "/services/flight-booking" },
    { label: "Travel insurance", href: "/services/travel-insurance" },
    { label: "Passport assistance", href: "/services/passport-assistance" },
  ],
};

/* ── Destinations ─────────────────────────────────────────────────────────── */

// Order is the order the left-hand list renders in. The places under each
// region are blacktomato.com's destination lists, verbatim and in their order
// (a country can sit under several regions there, and so it does here). The
// menu lays them out column-major (down, then across) — see DestinationsMenu.
// Taglines are ours: the design draws one under every name.
export const DESTINATION_REGIONS = [
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
    label: "Arctic circle",
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
    label: "Indian subcontinent",
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
    label: "Latin america",
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
    label: "Middle east",
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
    label: "South east asia",
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
    label: "South pacific",
    href: "/south-pacific",
    countries: [
      country("The Cook Islands", "Rarotonga • Aitutaki"),
      country("Fiji", "Islands • Reefs"),
      country("French Polynesia", "Bora Bora • Tahiti"),
    ],
  },
];

// Closes the region list. A plain link rather than a region: it has no country
// panel of its own, which is why the design draws it without a chevron.
export const ALL_DESTINATIONS_LINK = {
  label: "A to Z Destination",
  href: "/search",
};

// The default right-hand column of the Destinations menu, shown until a region
// is hovered.
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
    href: "/destinations/kerala",
  },
  {
    key: "lakshadweep",
    title: "Lakshadweep",
    tagline: "Tropical island paradise",
    image: "/experiance/bali.png",
    alt: "Turquoise lagoon meeting a palm-fringed beach from above",
    href: "/destinations/lakshadweep",
  },
  {
    key: "peru",
    title: "Peru",
    tagline: "Ancient ruins & culture",
    image: "/destination/switzerland.avif",
    alt: "Stone ruins on a green ridge beneath cloud-wrapped peaks",
    href: "/destinations/peru",
  },
  {
    key: "maldives",
    title: "Maldives",
    tagline: "Crystal waters & calm",
    image: "/experiance/maldives.png",
    alt: "Overwater villas on a boardwalk above a clear lagoon",
    href: "/destinations/maldives",
  },
];

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

// Each tile links to /experiences/[slug]. Only "honeymoon" has content in
// lib/experiences.js today; the others resolve to that page's notFound() until
// their entries land, which is where the CMS will put them.
export const EXPERIENCE_MENU = [
  {
    key: "family",
    label: "Family Holidays",
    href: "/experiences/family",
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
    key: "pilgrimage",
    label: "Pilgrimage",
    href: "/experiences/pilgrimage",
    image: "/destinations/kerala/culture-heritage.jpg",
    alt: "A colonnade of carved sandstone arches in soft light",
  },
];
