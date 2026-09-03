/* The places inside each country that the plan-my-trip wizard offers on that
 * country's page — /africa/botswana asks "Where would you like to go?" with
 * Chobe, Kasane, the Okavango Delta and so on, rather than a list of other
 * countries.
 *
 * Kept in code because the CMS holds nothing usable for it: a country entry's
 * regionsSection carries editorial titles ("Morning on the water"), not place
 * names. destinationOptionsFor() in lib/planMyTrip.js reads this map; an
 * editor's own list in the entry's `destinationOptions` field still wins over
 * it, and a country with no row here falls back to its region's countries.
 *
 * Keys are the names in lib/navigation.js DESTINATION_REGIONS, exactly. One
 * row per published country page (42 today); add a row when a country is
 * published. Six or so places each — the chips wrap, and the design's list
 * was six.
 */
export const COUNTRY_PLACES = {
  /* ── Destination pages (/destinations/[slug]) ──────────────────────── */
  /* Not countries in the region lists, but the same wizard runs on their
     pages — keyed by the name lib/navigation.js DESTINATION_PAGES uses. */
  India: ["Kerala", "Rajasthan", "Agra", "Goa", "Varanasi", "Ladakh"],
  Kerala: ["Munnar", "Alleppey", "Kochi", "Wayanad", "Thekkady", "Kovalam"],

  /* ── Africa ────────────────────────────────────────────────────────── */
  Botswana: [
    "Chobe",
    "Kasane",
    "Okavango Delta",
    "Moremi",
    "Makgadikgadi Pans",
    "Savuti",
  ],
  Congo: [
    "Brazzaville",
    "Odzala-Kokoua",
    "Nouabalé-Ndoki",
    "Lésio-Louna",
    "Pointe-Noire",
  ],
  Egypt: ["Cairo", "Giza", "Luxor", "Aswan", "Nile Cruise", "Red Sea"],
  Ethiopia: [
    "Addis Ababa",
    "Lalibela",
    "Simien Mountains",
    "Gondar",
    "Danakil Depression",
    "Omo Valley",
  ],
  Kenya: [
    "Nairobi",
    "Masai Mara",
    "Amboseli",
    "Laikipia",
    "Samburu",
    "Diani Beach",
  ],
  Madagascar: [
    "Antananarivo",
    "Andasibe",
    "Nosy Be",
    "Avenue of the Baobabs",
    "Isalo",
    "Île Sainte-Marie",
  ],
  Malawi: [
    "Lake Malawi",
    "Liwonde",
    "Majete",
    "Nyika Plateau",
    "Likoma Island",
    "Lilongwe",
  ],
  Mauritius: [
    "Grand Baie",
    "Le Morne",
    "Belle Mare",
    "Flic en Flac",
    "Port Louis",
    "Chamarel",
  ],
  Morocco: [
    "Marrakech",
    "Fes",
    "Sahara Desert",
    "Atlas Mountains",
    "Essaouira",
    "Chefchaouen",
  ],
  Mozambique: [
    "Bazaruto Archipelago",
    "Quirimbas Archipelago",
    "Vilanculos",
    "Maputo",
    "Gorongosa",
    "Ilha de Moçambique",
  ],
  Namibia: [
    "Sossusvlei",
    "Etosha",
    "Skeleton Coast",
    "Swakopmund",
    "Damaraland",
    "Windhoek",
  ],
  Rwanda: [
    "Volcanoes National Park",
    "Kigali",
    "Lake Kivu",
    "Nyungwe Forest",
    "Akagera",
  ],
  "The Seychelles": [
    "Mahé",
    "Praslin",
    "La Digue",
    "Silhouette Island",
    "Denis Island",
    "Desroches",
  ],
  "South Africa": [
    "Cape Town",
    "Kruger",
    "Winelands",
    "Garden Route",
    "Johannesburg",
    "Durban",
  ],
  "Tanzania & Zanzibar": [
    "Serengeti",
    "Ngorongoro",
    "Zanzibar",
    "Tarangire",
    "Kilimanjaro",
    "Selous / Nyerere",
  ],
  Uganda: [
    "Bwindi",
    "Queen Elizabeth",
    "Murchison Falls",
    "Kibale",
    "Jinja",
    "Kampala",
  ],
  Zambia: [
    "Victoria Falls",
    "Livingstone",
    "South Luangwa",
    "Lower Zambezi",
    "Kafue",
    "Lusaka",
  ],
  Zimbabwe: [
    "Victoria Falls",
    "Hwange",
    "Mana Pools",
    "Lake Kariba",
    "Matobo Hills",
    "Harare",
  ],

  /* ── Arctic Circle ─────────────────────────────────────────────────── */
  Antarctica: [
    "Antarctic Peninsula",
    "South Shetland Islands",
    "Drake Passage",
    "South Georgia",
    "Falkland Islands",
    "Weddell Sea",
  ],
  Canada: [
    "Yukon",
    "Churchill",
    "Banff",
    "Vancouver",
    "Toronto",
    "Québec City",
  ],
  Finland: [
    "Rovaniemi",
    "Lapland",
    "Helsinki",
    "Saariselkä",
    "Levi",
    "Kemi",
  ],
  Greenland: [
    "Ilulissat",
    "Nuuk",
    "Disko Bay",
    "Kangerlussuaq",
    "Tasiilaq",
    "Scoresby Sund",
  ],
  Iceland: [
    "Reykjavík",
    "Golden Circle",
    "Blue Lagoon",
    "Jökulsárlón",
    "Snæfellsnes",
    "Akureyri",
  ],
  Norway: [
    "Tromsø",
    "Lofoten",
    "Bergen",
    "Oslo",
    "Geirangerfjord",
    "Svalbard",
  ],
  Sweden: [
    "Stockholm",
    "Kiruna",
    "Abisko",
    "Icehotel, Jukkasjärvi",
    "Gothenburg",
    "Swedish Lapland",
  ],

  /* ── Australasia & Oceania ─────────────────────────────────────────── */
  Australia: [
    "Sydney",
    "Great Barrier Reef",
    "Uluru",
    "Melbourne",
    "Great Ocean Road",
    "Tasmania",
  ],
  Fiji: [
    "Nadi",
    "Mamanuca Islands",
    "Yasawa Islands",
    "Coral Coast",
    "Taveuni",
    "Vanua Levu",
  ],
  "French Polynesia": [
    "Bora Bora",
    "Tahiti",
    "Moorea",
    "Rangiroa",
    "Huahine",
    "Tetiaroa",
  ],
  "New Zealand": [
    "Queenstown",
    "Milford Sound",
    "Auckland",
    "Rotorua",
    "Franz Josef Glacier",
    "Bay of Islands",
  ],
  "The Cook Islands": ["Rarotonga", "Aitutaki", "Muri Lagoon", "Atiu"],

  /* ── Caribbean ─────────────────────────────────────────────────────── */
  Anguilla: [
    "Shoal Bay",
    "Meads Bay",
    "Rendezvous Bay",
    "Sandy Ground",
    "Island Harbour",
  ],
  Antigua: [
    "English Harbour",
    "Dickenson Bay",
    "Jolly Harbour",
    "Half Moon Bay",
    "Barbuda",
    "St John's",
  ],
  Bahamas: [
    "Nassau",
    "Exuma",
    "Harbour Island",
    "Eleuthera",
    "Abaco",
    "Andros",
  ],
  Barbados: [
    "Bridgetown",
    "West Coast",
    "Bathsheba",
    "Carlisle Bay",
    "Holetown",
    "Crane Beach",
  ],
  Grenada: [
    "St George's",
    "Grand Anse",
    "Carriacou",
    "Grand Etang",
    "Petite Martinique",
  ],
  Jamaica: [
    "Montego Bay",
    "Negril",
    "Ocho Rios",
    "Blue Mountains",
    "Kingston",
    "Port Antonio",
  ],
  Mustique: ["Mustique", "Macaroni Beach", "Britannia Bay", "Endeavour Bay"],
  "St Barths": [
    "Gustavia",
    "St Jean",
    "Flamands",
    "Colombier",
    "Grand Cul-de-Sac",
  ],
  "St Lucia": [
    "Soufrière",
    "The Pitons",
    "Rodney Bay",
    "Marigot Bay",
    "Castries",
    "Anse Chastanet",
  ],
  "St Vincent and the Grenadines": [
    "Bequia",
    "Canouan",
    "Tobago Cays",
    "Union Island",
    "Mayreau",
    "Kingstown",
  ],
  "The British Virgin Islands": [
    "Tortola",
    "Virgin Gorda",
    "Jost Van Dyke",
    "Anegada",
    "Necker Island",
  ],
  "Turks and Caicos": [
    "Grace Bay",
    "Providenciales",
    "Grand Turk",
    "Parrot Cay",
    "North Caicos",
    "Salt Cay",
  ],
};

/* The places for a country, or undefined when no row exists. */
export function getCountryPlaces(name) {
  const places = COUNTRY_PLACES[name];
  return places?.length ? places : undefined;
}
