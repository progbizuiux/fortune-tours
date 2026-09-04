/* Content for the /experiences/[slug] pages.
 *
 * One entry per experience, keyed by its slug. Every word, picture and CTA a
 * page renders comes from here — the page file and the section components are
 * shape-only, so the whole page is driven by one object. That is the seam the
 * CMS replaces: swap the body of getExperience/getExperienceSlugs for the fetch
 * and nothing above them has to change.
 *
 * Pictures are sourced from public/experiance/.
 */

const EXPERIENCES = {
  honeymoon: {
    slug: "honeymoon",

    // ── Hero ──────────────────────────────────────────────────────────────
    crumbs: [{ label: "Experience" }, { label: "Honeymoon" }],
    title: "Honeymoon escapes",
    description:
      "From quiet moments to unforgettable adventures, find an escape made for the two of you.",
    ctaLabel: "Make It Yours",
    ctaHref: "/concierge",
    image: "/experiance/honey-moon.jpg",
    imageAlt:
      "Couple in sun hats looking out over a calm tropical sea at sunset",

    // ── Most loved destinations carousel ──────────────────────────────────
    destinationsEyebrow: "Choose Your Journey",
    destinationsTitle: "Couples' most loved destinations",
    destinations: [
      {
        key: "maldives",
        title: "Maldives",
        description:
          "Private islands, turquoise waters, and uninterrupted days together.",
        image: "/experiance/maldives.png",
        alt: "Boardwalk winding between turquoise lagoons and limestone islands",
      },
      {
        key: "bali",
        title: "Bali.",
        description:
          "Tropical beauty, intimate stays, culture, and unforgettable experiences.",
        image: "/experiance/bali.png",
        alt: "Clear turquoise water meeting a palm-fringed Bali beach from above",
      },
      {
        key: "switzerland",
        title: "Switzerland",
        description:
          "Snow-covered mountains, scenic journeys, and cosy escapes.",
        image: "/experiance/switzerland.png",
        alt: "Couple sitting on a hillside looking out at snow-capped peaks",
      },
      {
        key: "mauritius",
        title: "Mauritius",
        description: "Beautiful beaches, relaxed days, and romantic sunsets.",
        image: "/experiance/mauritius.png",
        alt: "Loungers on a white sand Mauritius beach framed by pink blossom",
      },
    ],

    // ── Alternating escape rows ───────────────────────────────────────────
    /* NOTE: these three pictures are not in public/experiance yet — the folder
       has honey-moon.jpg and the four carousel images only. The paths are what
       the section expects; until the files land the rows render an empty box. */
    escapesLabel: "Ways to escape together",
    escapes: [
      {
        key: "mountain",
        eyebrow: "Mountain Escape",
        title: "Getting away into the mountains?",
        description:
          "Fresh mountain air, beautiful views, and cosy stays set the scene for quiet moments together. Spend your days exploring scenic landscapes and discovering new places at your own pace.",
        image: "/experiance/mountain-escape.png",
        alt: "Couple sitting together in a sunlit mountain meadow",
      },
      {
        key: "beach",
        eyebrow: "Beach Escape",
        title: "Waking up by the Sea?",
        description:
          "Slow mornings, private beaches, ocean-view stays, and sunsets made for two. Spend your days by the water, enjoy intimate moments away from the crowds, and let the rhythm of the sea set the pace.",
        image: "/experiance/beach-escape.png",
        alt: "Couple walking hand in hand along a turquoise shoreline",
      },
      {
        key: "city",
        eyebrow: "City Escape",
        title: "Getting lost somewhere new?",
        description:
          "Wander through romantic streets, discover local flavours, and uncover hidden corners together. Experience a new city at your own pace, with something memorable around every corner.",
        image: "/experiance/city-escape.png",
        alt: "Couple with backpacks walking down a narrow old town street",
      },
    ],

    // ── Handpicked packages carousel ───────────────────────────────────────
    /* NOTE: these three pictures are not in public/experiance yet either. */
    packagesEyebrow: "Find Your Package",
    packagesTitle: "Handpicked honeymoon escapes",
    packagesSubheading: "Journeys Made for Two",
    packagesDescription:
      "Discover thoughtfully planned honeymoon packages across beautiful destinations, with stays, experiences, and memorable moments brought together in one journey.",
    packagesCtaLabel: "Make it yours",
    packagesCtaHref: "/concierge",
    packages: [
      {
        key: "seychelles",
        title: "Seychelles Island Retreat",
        meta: "6 Nights · Seychelles",
        experiences:
          "Private beach stay · Island exploration · Sunset cruise · Ocean experiences",
        image: "/experiance/seychelles.png",
        alt: "Infinity pool above a turquoise bay on a Seychelles hillside",
      },
      {
        key: "paris-swiss",
        title: "Paris & Swiss Escape",
        meta: "8 Nights · France · Switzerland",
        experiences:
          "Paris city stay · Scenic train journey · Alpine retreat · Fine dining",
        image: "/experiance/paris.png",
        alt: "Cyclist on a sunlit cobbled lane lined with shuttered houses",
      },
      {
        key: "greece",
        title: "Greece Island Escape",
        meta: "7 Nights · Greece",
        experiences:
          "Santorini sunsets · Island hopping · Cliffside stay · Sunset sailing",
        image: "/experiance/greece.png",
        alt: "Whitewashed Greek village with blue doors above the sea",
      },
    ],

    // ── Closing invitation ─────────────────────────────────────────────────
    calloutTitle: "Start with what you Imagine",
    calloutLead: "Forget the usual honeymoon checklist.",
    calloutParagraphs: [
      "A destination is only the beginning. Think about how you want your honeymoon to feel, what you want to experience together, and the moments you'll want to remember. Whether you picture quiet days by the sea, exploring a new culture, enjoying beautiful stays, or discovering something completely unexpected, your journey can be shaped around the way you want to travel.",
      "Share your ideas with us, from the destinations that inspire you to the experiences you want to include, and we'll bring them together into a thoughtful journey planned around the two of you. From the first idea to the final detail, we'll help create a honeymoon that feels personal, effortless, and worth remembering.",
    ],
    calloutCtaLabel: "Tell Us Your Ideas",
    calloutCtaHref: "/contact",

    // ── Month picker (TabbedCardsSection) ──────────────────────────────────
    monthsEyebrow: "Choose Your Journey",
    monthsTitle: "Pick your month, find your escape.",
    monthsDescription:
      "Planning your honeymoon? Choose your travel month and discover handpicked destinations perfect for a romantic escape.",
    monthsLabel: "Honeymoon destinations by travel month",
    monthTabs: [
      { key: "jan_mar", label: "JAN – MAR", name: "Jan – Mar" },
      { key: "apr_may", label: "APR – MAY", name: "Apr – May" },
      { key: "jun_aug", label: "JUNE – AUGUST", name: "June – Aug" },
      { key: "sep_oct", label: "SEP – OCT", name: "Sep – Oct" },
      { key: "nov_dec", label: "NOV – DEC", name: "Nov – Dec" },
    ],
    /* Only the first group is in the design frame — Maldives and Thailand. The
       other four are grouped from the destinations this page already carries so
       every tab has something to show; they are placeholders until the backend
       supplies the real month-to-destination mapping.
       thailand.png is also not in public/experiance yet. */
    monthCards: {
      jan_mar: [
        {
          title: "Maldives",
          meta: "Overwater villas, calm blue seas, and private honeymoon days.",
          image: "/experiance/maldives.png",
        },
        {
          title: "Thailand",
          meta: "Beautiful beaches, islands, and cultural escapes.",
          image: "/experiance/beach-escape.png",
        },
      ],
      apr_may: [
        {
          title: "Bali",
          meta: "Tropical beauty, intimate stays, and unforgettable experiences.",
          image: "/experiance/bali.png",
        },
        {
          title: "Mauritius",
          meta: "Beautiful beaches, relaxed days, and romantic sunsets.",
          image: "/experiance/mauritius.png",
        },
      ],
      jun_aug: [
        {
          title: "Switzerland",
          meta: "Snow-covered mountains, scenic journeys, and cosy escapes.",
          image: "/experiance/switzerland.png",
        },
        {
          title: "Greece",
          meta: "Santorini sunsets, island hopping, and cliffside stays.",
          image: "/experiance/greece.png",
        },
      ],
      sep_oct: [
        {
          title: "Seychelles",
          meta: "Private beach stays, island exploration, and sunset cruises.",
          image: "/experiance/seychelles.png",
        },
        {
          title: "Paris",
          meta: "City stays, scenic train journeys, and fine dining.",
          image: "/experiance/paris.png",
        },
      ],
      nov_dec: [
        {
          title: "Maldives",
          meta: "Private islands, turquoise waters, and uninterrupted days.",
          image: "/experiance/maldives.png",
        },
        {
          title: "Bali",
          meta: "Quiet mornings, culture, and warm tropical evenings.",
          image: "/experiance/bali.png",
        },
      ],
    },
  },
};

/* Returns undefined for an unknown slug rather than a partial object, so the
   page can send it straight to notFound() instead of rendering a half-empty
   frame. */
export function getExperience(slug) {
  return EXPERIENCES[slug];
}

export function getExperienceSlugs() {
  return Object.keys(EXPERIENCES);
}
