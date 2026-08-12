"use client";

import { TabbedCardsSection } from "@/components/common/TabbedCardsSection";

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

export function DeparturesSection() {
  return (
    <TabbedCardsSection
      eyebrow="Chapter 06 — Timetable"
      title="Curated departures."
      description="Small-group journeys with a host. Fixed dates, limited seats."
      tabs={MONTHS}
      cardsData={DEPARTURES}
      sectionAriaLabel="Timetable — curated departures"
    />
  );
}
