import { TabbedCardsSection } from "@/components/common/TabbedCardsSection";

/* Curated departures (Figma "final" → Chapter 06 — Timetable).
   Tabs are Poppins Light 18/24; the active month is white on a black chip
   (≈91×49). Cards run nearly full-bleed — 6px outer margin and 6px gap at a
   951:696 ratio — with a bottom scrim; the title is Neiko 32/100%/-1% via the
   h3 tag default and the meta line Poppins Light 18/24 at white 80%.
   Each month has its own departures so the cards change with the active tab;
   September carries the Figma copy, the rest are placeholder entries (images
   reused from public/home) until real timetable data (CMS) lands. */

const MONTHS = [
  { key: "sep", label: "Sep.", name: "September" },
  { key: "oct", label: "Oct.", name: "October" },
  { key: "nov", label: "Nov.", name: "November" },
  { key: "dec", label: "Dec.", name: "December" },
  { key: "jan", label: "Jan.", name: "January" },
  { key: "feb", label: "Feb.", name: "February" },
];

const DEPARTURES = {
  sep: [
    {
      title: "Grand USA tour.",
      meta: "12 Days - 6 seats left - Travel host included.",
      image: "/home/grand-usa.png",
    },
    {
      title: "Swiss Alpine escape.",
      meta: "09 Days - 04 seats left - Private guide.",
      image: "/home/swiss-alpine.png",
    },
  ],
  oct: [
    {
      title: "Autumn in Kyoto.",
      meta: "09 Days - 12 seats left - Tea ceremonies included.",
      image: "/home/image-2.jpg",
    },
    {
      title: "Tuscany harvest trail.",
      meta: "07 Days - 8 seats left - Wine tastings included.",
      image: "/home/image-5.png",
    },
  ],
  nov: [
    {
      title: "Central Europe by rail.",
      meta: "08 Days - 10 seats left - First-class rail included.",
      image: "/home/journal/city-guide.png",
    },
    {
      title: "Backwater river retreat.",
      meta: "10 Days - 6 seats left - River suite included.",
      image: "/home/image-4.png",
    },
  ],
  dec: [
    {
      title: "Winter fjords voyage.",
      meta: "11 Days - 8 seats left - Aurora nights included.",
      image: "/home/image-2.jpg",
    },
    {
      title: "Christmas in the Alps.",
      meta: "06 Days - 04 seats left - Mountain chalet stay.",
      image: "/home/journal/field-notes.png",
    },
  ],
  jan: [
    {
      title: "Kerala backwaters escape.",
      meta: "08 Days - 14 seats left - Houseboat included.",
      image: "/home/image-4.png",
    },
    {
      title: "Family magic getaway.",
      meta: "05 Days - 10 seats left - Park passes included.",
      image: "/home/image-2.jpg",
    },
  ],
  feb: [
    {
      title: "Cherry blossom preview.",
      meta: "09 Days - 16 seats left - Guided temple walks.",
      image: "/home/image-2.jpg",
    },
    {
      title: "Amalfi in quiet season.",
      meta: "07 Days - 9 seats left - Coastal drives included.",
      image: "/home/journal/coastal-escape.png",
    },
  ],
};

/* Heading comes from the `sections.timetable` block via lib/strapi/home.js.
   Its months carry no departures yet, so MONTHS/DEPARTURES above stand in —
   taking CMS months without their sailings would render empty tabs. */
export function DeparturesSection({
  eyebrow = "Chapter 06 — Timetable",
  title = "Curated departures.",
  description = "Small-group journeys with a host. Fixed dates, limited seats.",
  tabs = MONTHS,
  cardsData = DEPARTURES,
}) {
  return (
    <TabbedCardsSection
      eyebrow={eyebrow}
      title={title}
      description={description}
      tabs={tabs}
      cardsData={cardsData}
      sectionAriaLabel="Timetable — curated departures"
    />
  );
}
