import { getPackageEntry } from "./strapi/packages";

/* Content for the package detail pages — /destinations/[slug]/[package].
 *
 * The `packages` collection carries every section on the page now, so this
 * module is no longer where the page reads from — it is the fallback beneath
 * it. `getPackage()` merges the CMS over the copy below, key by key, and only
 * where the CMS has something: a field an editor never filled normalises to
 * undefined in lib/strapi/packages.js and is dropped by that merge.
 *
 * That matters more than it sounds. The panels are not all on the same commit,
 * and an entry can be half filled in, so the design's copy here is what stands
 * in until the CMS has each field. Deleting it would leave holes in the page
 * rather than the line the design shipped with.
 *
 * That merge is the single seam, exactly as this file was shaped for. Every
 * section is props-only and reads exactly the keys below, so a new section
 * needs a normaliser in lib/strapi/packages.js and a key in the merge — no
 * component and no route has to change. That is the same split
 * lib/strapi/destination.js already uses for its own defaults.
 *
 * Keyed by `${destination}/${slug}` — the two route params — so one flat map
 * serves every destination without a nested lookup.
 */

const PACKAGES = {
  "kerala/lakshadweep-agatti-kalpitti": {
    destination: "kerala",
    slug: "lakshadweep-agatti-kalpitti",

    hero: {
      eyebrow: "4 Days, 3 Nights  ·  Ex Cochin",
      title: "Lakshadweep Package\nAgatti & Kalpitti",
      description:
        "Flights, stay, all meals, permit, and every boat ride included.",
      note: "From INR 44,900 per person",
      image: "/experiance/maldives.png",
      imageAlt:
        "Aerial view of an island resort in Lakshadweep at sunset, with overwater villas along a turquoise lagoon",
      ctas: [
        { label: "Book Your Seat", href: "/itinerary" },
        { label: "Call 9656 211 888", href: "tel:+919656211888" },
      ],
    },

    intro: {
      title: "More than a beach escape.\nThis is Lakshadweep.",
      description:
        "Agatti is one of the most striking islands in Lakshadweep, known for its clear lagoons, white sand, and reefs teeming with life. Its lagoon spreads over 17.5 square kilometres, which makes it ideal for water activities and slow days. The island is well connected by flight from Kochi, about an hour and a half in the air. As you come in to land, turquoise water and coral show up on both sides of the runway.\nThis package stays with Agatti and nearby Kalpitti Island. Four days, three nights, and a plan that mixes water time with room to do nothing.",
      image: "/experiance/beach-escape.png",
      imageAlt:
        "A lighthouse surrounded by palm trees on a headland above clear blue water",
      /* Label/value pairs, not the plain place labels the region pages pass —
         see the `stats` prop on ImageIntroSection. */
      stats: [
        { label: "Duration", value: "4 Days, 3 Nights" },
        { label: "Route", value: "Cochin to Agatti to Cochin" },
        { label: "Islands", value: "Agatti and Kalpitti Islands" },
        { label: "Flights", value: "Flights Included" },
        { label: "Meals", value: "All Meals" },
        { label: "Permit", value: "Permit Handled" },
      ],
    },

    itinerary: {
      eyebrow: "Itinerary",
      title: "Day by Day Plan",
      description:
        "Begin your island escape with turquoise waters, a warm welcome and your first taste of Agatti's quiet beauty.",
      days: [
        {
          number: "01",
          title: "Cochin to Agatti Island",
          image: "/experiance/seychelles.png",
          imageAlt: "Agatti island at sunrise, seen from the air",
          description:
            "You land at Agatti Airport, where our representative meets you and helps with the transfer to the resort. A welcome drink, a quick check-in, and a short briefing about the days ahead. After lunch, the beach is yours for a while.",
          /* The line that introduces the list below. Split out of the
             description because a closed day still shows its paragraph, and a
             sentence ending on a colon would dangle there. */
          itemsLead: "In the evening, a short sightseeing round of Agatti covers:",
          items: [
            "Jetty area",
            "Ship Embarkation Jetty",
            "NIOT Desalination Plant",
            "Village surroundings",
            "Nearby beaches",
          ],
          footnote: "Back to the resort for dinner and an overnight stay.",
        },
        /* PLACEHOLDER from here down. Days 02-04 had only a paragraph, which
           left nothing behind the accordion to open. The photographs are stock
           files already in public/ and the bullet lists are invented, so replace
           all three with the operator's real day plans before this page ships.
           Day 01 above is the real copy. */
        {
          number: "02",
          title: "Water Activities Day",
          image: "/experiance/mauritius.png",
          imageAlt: "Snorkellers over a shallow reef in clear water",
          description:
            "After breakfast, the day belongs to the lagoon. Guided snorkelling takes you over the reef and the coral formations. Kayaking follows, easy going in calm water. Scuba diving is available for those who want to go deeper, as an optional add-on.",
          itemsLead: "The day covers:",
          items: [
            "Guided snorkelling over the house reef",
            "Kayaking inside the lagoon",
            "Optional scuba dive with a certified instructor",
            "Afternoon at leisure on the beach",
          ],
          footnote: "Dinner and overnight at the resort.",
        },
        {
          number: "03",
          title: "Kalpitti Island & Cultural Evening",
          image: "/experiance/honey-moon.jpg",
          imageAlt: "An empty white-sand beach fringed with palms",
          description:
            "After breakfast, a boat trip to Kalpitti Island. On the way, the glass-bottom boat gives you a clear view of coral reefs, bright fish, and the occasional turtle in open water.",
          itemsLead: "The day covers:",
          items: [
            "Glass-bottom boat crossing to Kalpitti",
            "Time on the island's untouched beaches",
            "Shallow-water swimming and snorkelling",
            "Cultural programme back on Agatti",
          ],
          footnote: "Dinner and overnight at the resort.",
        },
        {
          number: "04",
          title: "Agatti to Cochin",
          image: "/destinations/kerala/beaches.avif",
          imageAlt: "A quiet stretch of coastline in the morning light",
          description:
            "A last morning by the lagoon before check-out. Our representative sees you to Agatti Airport for the flight back to Cochin, and the tour ends there.",
          itemsLead: "The morning covers:",
          items: [
            "Breakfast at the resort",
            "Free time by the lagoon before check-out",
            "Assisted transfer to Agatti Airport",
          ],
          footnote: "The tour ends on arrival at Cochin.",
        },
      ],
    },

    inclusions: {
      eyebrow: "All you need",
      title: "What's Covered & What's Not",
      tabs: [
        {
          key: "covered",
          label: "Covered",
          title: "What's Included",
          items: [
            "Meet and assist at Cochin airport",
            "Return flight tickets, Cochin to Agatti to Cochin",
            "Kalpitti island excursion",
            "All meals — breakfast, lunch, dinner — plus tea, coffee, and snacks",
            "Accommodation in air-conditioned rooms",
            "Agatti sightseeing and beach visits",
            "Guided snorkelling",
            "Boat transfers for activities",
            "Glass-bottom boat ride for coral and turtle viewing",
            "A local island representative",
            "A Fortune tour manager with the group",
            "Permit documentation and heritage fees",
            "Cultural programme on the final evening",
            "Kayaking",
          ],
        },
        {
          key: "not-covered",
          label: "Not Covered",
          title: "What's Not Included",
          items: [
            "Scuba diving and any other optional add-on activity",
            "Travel insurance",
            "Personal expenses — laundry, telephone, minibar",
            "Anything not named under what's included",
            "Costs arising from flight delays, cancellations or weather",
            "Tips and porterage",
            "Camera and video fees at monuments",
          ],
        },
      ],
    },

    documents: {
      eyebrow: "Before we begin",
      title: "What you need to\nsend us",
      description:
        "To arrange your Lakshadweep permit smoothly, please share the required documents in advance. Our team will start the process before your journey.",
      image: "/experiance/bali.png",
      imageAlt: "A small forested island with a sandbar and a boat offshore",
      items: [
        {
          number: "01",
          title: "Government-issued ID",
          description:
            "Please provide a clear copy of your Aadhaar card or passport as proof of identity. This document is required to verify your personal details and ensure secure processing of your application.",
        },
        {
          number: "02",
          title: "Passport-size photo",
          description:
            "Please provide a recent photo by sending it to us via email or WhatsApp. Make sure the image is clear, sharp, and up-to-date to help us process your request efficiently and quickly.",
        },
      ],
    },

    cancellation: {
      eyebrow: "Cancellation Policy",
      title: "Cancellation Policy",
      rows: [
        { label: "More than 15 days before departure", value: "50% of tour cost" },
        { label: "15 days to 7 days before departure", value: "75% of tour cost" },
        { label: "Less than 7 days before departure", value: "100% — no refund" },
      ],
      note: "Flight tickets and booking deposits are non-refundable, and all cancellations must be submitted by email from the registered email ID; cancellations made over the phone will not be accepted.",
    },

    /* The closing booking band, between the cancellation table and the FAQ.
       Same two calls to action as the hero — a reader who has scrolled the
       whole itinerary should not have to scroll back up to act. */
    bookingCta: {
      eyebrow: "Small Aircraft, Limited Seats",
      title: "Hold Your Seat for\nLakshadweep",
      description:
        "Half the tour cost confirms your place. Send us your ID copy and photo, and we start the permit right away.",
      image: "/experiance/maldives.png",
      imageAlt:
        "Aerial view of traditional boats on the turquoise shallows off a Lakshadweep beach",
      ctas: [
        { label: "Book Your Seat", href: "/itinerary" },
        { label: "Call 9656 211 888", href: "tel:+919656211888" },
      ],
    },

    faq: {
      eyebrow: "Good To Know",
      title: "Questions with useful\nanswers",
      contactInfo:
        "Still have a question?\nCall 9656 211 888 or write to hello@fortunetours.in",
      faqs: [
        {
          question: "Do I need a permit to visit Lakshadweep?",
          answer:
            "Yes. Every visitor needs an entry permit issued by the Lakshadweep administration. We handle the paperwork for you — send us your ID and a passport-size photo, and the application goes in well ahead of your travel date.",
        },
        {
          question: "How do I reach Agatti?",
          answer:
            "By flight from Cochin. It is about an hour and a half in the air, and the return tickets are part of the package. Our representative meets you at Agatti Airport and handles the transfer to the resort.",
        },
        {
          question: "Is scuba diving included?",
          answer:
            "No. Scuba diving is an optional add-on, arranged on the island and paid for there. Snorkelling, kayaking and the glass-bottom boat ride are all included.",
        },
        {
          question: "What is the best time to go?",
          answer:
            "October to May. The sea is calm, the lagoon is clear, and boat transfers run to schedule. The monsoon months are best avoided — crossings get cancelled at short notice.",
        },
        {
          question: "Is alcohol available on the islands?",
          answer:
            "No. Lakshadweep is a dry destination and alcohol is not served or sold on Agatti.",
        },
      ],
    },
  },
};

/**
 * One package, or null — which the route turns into a 404.
 *
 * Every section comes from Strapi, falling back to the map above field by
 * field: the CMS wins only where it has something, so a field an editor never
 * filled leaves the design's own line rather than a hole.
 *
 * A package absent from the map above is still a 404 even when the CMS has it,
 * since none of the sections below the hero could be drawn for it.
 */
export async function getPackage(destination, slug) {
  const local = PACKAGES[`${destination}/${slug}`] ?? null;
  if (!local) return null;

  const entry = await getPackageEntry(destination, slug);
  if (!entry) return local;

  return {
    ...local,
    hero: merge(local.hero, entry.hero),
    intro: merge(local.intro, entry.intro),
    itinerary: merge(local.itinerary, entry.itinerary),
    inclusions: merge(local.inclusions, entry.inclusions),
    documents: merge(local.documents, entry.documents),
    cancellation: merge(local.cancellation, entry.cancellation),
    faq: merge(local.faq, entry.faq),
    /* No section on the route draws this yet — carried so it is there the day
       one does. */
    cta: entry.cta,
  };
}

/* The CMS over the design, key by key, ignoring the keys it left empty. */
function merge(local, fromCms) {
  return { ...local, ...defined(fromCms) };
}

/* The keys the CMS actually filled in. */
function defined(source) {
  return Object.fromEntries(
    Object.entries(source ?? {}).filter(([, value]) => value !== undefined),
  );
}

/** Every package as route params, for generateStaticParams. */
export function getPackageParams() {
  return Object.values(PACKAGES).map((entry) => ({
    slug: entry.destination,
    package: entry.slug,
  }));
}
