/* Trip types behind the /search "Trip Type" filter — /search?style=adventure.
 *
 * The `key` of each entry is the slug of a `travel-styles` entry in Strapi,
 * which is what the "choose your journey" carousel links to and what the
 * banner at the top of /search is themed from. The CMS holds no relation
 * between a travel style and the countries it suits, so that mapping lives
 * here until one is modelled: a country name listed under a type matches that
 * filter, and a country under none of them only appears when no type is set.
 *
 * Names must match `name` in lib/navigation.js exactly (the same strings the
 * Countries dropdown shows). A misspelt name matches nothing rather than
 * throwing, so a quick check after editing is to filter by the type and count.
 */
export const TRIP_TYPES = [
  {
    key: "relax",
    label: "Relax",
    countries: [
      "Anguilla", "Antigua", "Bahamas", "Barbados", "Fiji", "French Polynesia",
      "Grenada", "Jamaica", "The Maldives", "Mauritius", "Mozambique",
      "Mustique", "The Seychelles", "Sri Lanka", "St Barths", "St Lucia",
      "Thailand", "Turks and Caicos", "The Cook Islands", "Greece", "Croatia",
      "Portugal", "The Philippines", "Indonesia", "Malaysia", "Panama",
    ],
  },
  {
    key: "explore",
    label: "Explore",
    countries: [
      "Argentina", "Austria", "Belgium", "Bolivia", "Cambodia", "China",
      "Colombia", "Cuba", "Czech Republic", "Denmark", "England", "France",
      "Georgia", "Germany", "Guatemala", "Hungary", "India", "Israel", "Italy",
      "Japan", "Jordan", "Laos", "Lithuania", "Macau", "Mexico", "Montenegro",
      "Morocco", "Myanmar", "Netherlands", "Nicaragua", "Peru", "Portugal",
      "Romania", "Scotland", "Singapore", "South Korea", "Spain", "Taiwan",
      "Turkey", "UK", "The USA", "Uruguay", "Vietnam", "Egypt",
      "Ireland & Northern Ireland", "Greece", "Croatia", "Slovenia",
    ],
  },
  {
    key: "celebrate",
    label: "Celebrate",
    countries: [
      "Antigua", "Bahamas", "Barbados", "The British Virgin Islands",
      "French Polynesia", "Greece", "Italy", "Jamaica", "The Maldives",
      "Mauritius", "Mustique", "The Seychelles", "St Barths", "St Lucia",
      "St Vincent and the Grenadines", "Thailand", "Indonesia", "France",
      "Spain", "The United Arab Emirates", "Fiji", "Turks and Caicos",
    ],
  },
  {
    key: "adventure",
    label: "Adventure",
    countries: [
      "Antarctica", "Argentina", "Australia", "Belize", "Bhutan", "Bolivia",
      "Borneo", "Canada", "Chile", "Costa Rica", "Ecuador & the Galapagos",
      "Ethiopia", "Greenland", "Iceland", "Jordan", "Mongolia", "Namibia",
      "Nepal", "New Zealand", "Nicaragua", "Norway", "Oman", "Papua New Guinea",
      "Peru", "Réunion Island", "Scotland", "Slovenia", "Switzerland",
      "Zambia", "Zimbabwe", "Finland", "Sweden", "Congo", "Madagascar",
      "Malawi", "Guatemala", "Vietnam", "Laos",
    ],
  },
  {
    key: "spiritual",
    label: "Spiritual",
    countries: [
      "Bhutan", "Cambodia", "Ethiopia", "India", "Israel", "Japan", "Jordan",
      "Laos", "Myanmar", "Nepal", "Sri Lanka", "Thailand", "Indonesia",
      "Turkey", "Egypt", "Peru", "Mongolia", "Georgia", "Vietnam",
    ],
  },
  {
    key: "luxury",
    label: "Luxury",
    countries: [
      "Anguilla", "The British Virgin Islands", "French Polynesia", "Italy",
      "The Maldives", "Mauritius", "Mustique", "Qatar", "The Seychelles",
      "St Barths", "Switzerland", "The United Arab Emirates", "Turks and Caicos",
      "France", "Japan", "Singapore", "Botswana", "South Africa", "Kenya",
      "Tanzania & Zanzibar", "Oman", "Greece", "Fiji", "Antigua",
    ],
  },
  {
    key: "wildlife",
    label: "Wildlife",
    countries: [
      "Antarctica", "Australia", "Borneo", "Botswana", "Brazil", "Congo",
      "Costa Rica", "Ecuador & the Galapagos", "India", "Kenya", "Madagascar",
      "Malawi", "Namibia", "Nepal", "Rwanda", "South Africa", "Sri Lanka",
      "Tanzania & Zanzibar", "Uganda", "Zambia", "Zimbabwe", "Canada",
      "Greenland", "Belize", "Indonesia", "Papua New Guinea", "Mozambique",
    ],
  },
  {
    key: "cruise",
    label: "Cruise",
    countries: [
      "Antarctica", "Antigua", "Bahamas", "The British Virgin Islands",
      "Croatia", "Ecuador & the Galapagos", "Egypt", "Fiji", "French Polynesia",
      "Greece", "Greenland", "Iceland", "Indonesia", "Italy", "Norway",
      "St Vincent and the Grenadines", "Thailand", "Turkey", "Vietnam",
      "Myanmar", "Laos", "Cambodia", "Panama", "Montenegro", "Turks and Caicos",
    ],
  },
];

/* Lookup by URL value. Undefined for an unknown key, so a stale link
   (/search?style=removed) shows everything rather than nothing. */
export function getTripType(key) {
  if (!key) return undefined;
  return TRIP_TYPES.find((type) => type.key === key);
}
