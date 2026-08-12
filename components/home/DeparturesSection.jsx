"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { Container } from "@/components/common/Container";
import { FrameButton } from "@/components/common/FrameButton";
import { SectionHeading } from "@/components/common/SectionHeading";
import { useReveal } from "@/lib/useReveal";

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

export function DeparturesSection() {
  const [activeKey, setActiveKey] = useState(MONTHS[0].key);
  const activeMonth = MONTHS.find((month) => month.key === activeKey);
  const sectionRef = useRef(null);
  const isFirstRender = useRef(true);
  const tabsRef = useReveal({ delay: 0.1, stagger: 0.05, y: 16 });
  const cardsRef = useReveal({ stagger: 0.15, y: 40 });

  // Rise-in for the freshly mounted cards on each month switch. The initial
  // scroll entrance stays owned by useReveal (cardsRef), so the first render
  // is skipped; reduced-motion users get an instant swap.
  useGSAP(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".departure-card", {
          y: 24,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
      });
    },
    { scope: sectionRef, dependencies: [activeKey] },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Timetable — curated departures"
      className="spacing"
    >
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Chapter 06 — Timetable"
          title="Curated departures."
          description="Small-group journeys with a host. Fixed dates, limited seats."
        />

        {/* Inactive months carry hairline left/right borders (Figma); the
            active chip keeps transparent ones so the row never shifts */}
        <div
          ref={tabsRef}
          className="mt-16 flex max-xl:flex-nowrap max-xl:overflow-x-auto max-xl:[scrollbar-width:none] max-xl:[&::-webkit-scrollbar]:hidden flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-6 xl:gap-8"
        >
          {MONTHS.map((month) => (
            <FrameButton
              key={month.key}
              variant="month"
              active={activeKey === month.key}
              aria-pressed={activeKey === month.key}
              onClick={() => setActiveKey(month.key)}
            >
              {month.label}
            </FrameButton>
          ))}
        </div>
      </Container>

      {/* Full-bleed departure cards: 6px outer margin + 6px gap (Figma) */}
      <ul ref={cardsRef} className="max-sm:mt-8 mt-20 grid gap-1.5 px-1.5 md:grid-cols-2">
        {DEPARTURES[activeKey].map((trip) => (
          <li
            key={trip.title}
            className="departure-card relative max-sm:aspect-[432/273] aspect-[951/696] overflow-hidden"
          >
            <Image
              src={trip.image}
              alt={trip.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            {/* Figma image overlay: linear gradient darkening to #000 at the
                base so the white copy stays legible */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
              aria-hidden="true"
            />

            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8 md:pt-11 md:pb-16">
              <span className="text-body max-sm:text-[12px] max-sm:font-light text-white/80">
                {activeMonth.name}.
              </span>
              <div>
                <h3 className="text-white max-sm:text-[18px] max-sm:leading-none max-sm:tracking-[-0.01em]">{trip.title}</h3>
                <p className="mt-3 max-sm:mt-1 max-sm:text-[12px] max-sm:leading-6 max-sm:font-normal text-white/80">{trip.meta}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
