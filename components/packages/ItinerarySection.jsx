"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

/* "Day by Day Plan" — the itinerary on the package detail page.
 *
 * An accordion: one day is open at a time, and its title is the control that
 * opens it. The open day draws the frame's cream band with the photograph
 * beside its copy and its full detail; a closed day keeps its title and its
 * paragraph on the page's own ground, separated by a hairline, and puts away
 * only the photograph, the list and the closing line. That is the same two
 * treatments the design shows — day 01 illustrated and 02 onward as rows, both
 * carrying their copy — except which day gets which now follows the reader
 * rather than the data, so the frame is reproduced by opening the first day.
 *
 * Single-open rather than many: the days are sequential and the section is
 * about the shape of the trip, which is easier to hold with one day expanded
 * and the rest legible as a list. Clicking the open day closes it, so the
 * reader can collapse the section back to its four titles.
 *
 * Client-side, unlike the other sections on this page — the open/closed state
 * is the point. Every day's copy still ships in the served HTML rather than
 * being mounted on open, so a crawler reads the whole itinerary. That is the
 * only thing it buys: a visitor whose JS never runs gets the server's state —
 * day 01 in full, the rest as title and paragraph — and no way to open the
 * others, which the server component this replaced did not have to trade away.
 * Moving to <details name> would give that back without JS; it is not done here
 * because the open day's layout is a three-column row the summary sits inside.
 *
 * Shape-only. All copy comes from the page; see lib/packages.js.
 */
export function ItinerarySection({
  eyebrow = "Itinerary",
  title = "Day by Day Plan",
  description,
  days = [],
  className,
}) {
  /* The frame is drawn with the first day open, and an accordion that starts
     fully closed reads as an empty section rather than a collapsed one. */
  const [openIndex, setOpenIndex] = useState(0);

  // An empty plan under a heading reads as a broken section, not an empty one.
  if (!days.length) return null;

  const isLastOpen = openIndex === days.length - 1;

  return (
    <section
      aria-label={title}
      /* bg-background, like every block that follows the sticky hero, and
         `relative z-10` so that ground paints over the hero rather than losing
         to a positioned sibling — see components/common/ImageIntroSection.jsx
         for the same pairing and why the background alone is not enough. */
      className={cn(
        "bg-background relative z-10 spacing",
        /* No bottom padding while the section ends on a white row: the next
           section's cream then starts straight off this one's last hairline,
           which is the join the frame draws. But the open day's band is cream
           too, and InclusionsSection below is the same #faf7f2 — so when the
           LAST day is the open one, dropping the padding runs the two cream
           fields into one continuous block with no boundary. Keep the padding
           in exactly that case. */
        !isLastOpen && "!pb-0",
        className,
      )}
    >
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </Container>

      <div className="mt-12 md:mt-16 lg:mt-[70px]">
        {days.map((day, i) => (
          <Day
            key={dayKey(day, i)}
            day={day}
            index={i}
            isOpen={i === openIndex}
            isFirst={i === 0}
            /* A closed day draws the hairline above itself, but under an open
               day that rule lands flush on the cream band's own bottom edge —
               two dividers, and the inset one does not even span the same
               width. The day below the open one drops it. */
            prevOpen={i - 1 === openIndex}
            onToggle={() => setOpenIndex(i === openIndex ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}

/* A key that survives the data. `number` alone collides when an operator splits
   a day and reuses one, or when a CMS field arrives as "" — `??` falls back on
   null and undefined but not on an empty string — and React silently keeps the
   wrong node. Pairing it with the title makes a collision take two identical
   fields, and the index closes the last gap. */
function dayKey(day, index) {
  return `${day.number || index}-${day.title || index}`;
}

/* One day, in whichever of the two treatments its state calls for.
 *
 * The open band runs edge to edge in cream while its contents stay on the
 * Container's grid, which is what the frame draws; a closed day sits on the
 * page ground with a hairline above it. The rule is dropped on the first day
 * and under an open band, where it would double against the cream edge. */
function Day({ day, index, isOpen, isFirst, prevOpen, onToggle }) {
  /* Indexed, not numbered. `number` is display copy — two days can share one
     when an operator splits a day, and a CMS field can arrive empty, either of
     which would give two elements the same id. aria-controls and
     aria-labelledby are IDREFs and resolve to the first match, so a collision
     silently points one day's button at another day's panel. The index cannot
     collide. */
  const panelId = `itinerary-panel-${index}`;
  const headingId = `itinerary-day-${index}`;

  return (
    <AnimateIn>
      <div className={cn(isOpen && "bg-cream", isOpen ? "py-10 md:py-14 lg:py-[60px]" : "")}>
        <Container>
          {/* The two gaps differ: the numeral stands 60/80px off the
              photograph — that gap is what puts the photograph's left edge
              140px into the container, where a closed day starts its title —
              while the photograph sits only 42px from its copy. One gap utility
              on a single row cannot hold both. */}
          <div
            className={cn(
              "flex flex-col lg:flex-row lg:gap-[60px] xl:gap-[80px]",
              !isOpen && "py-8 md:py-10 lg:py-[45px]",
              !isOpen && !isFirst && !prevOpen && "border-t border-black/10",
            )}
          >
            {/* One casing for every day. The frame draws a lowercase "day" over
                the open one and "Day" over the closed ones, which reads as a
                slip in a static picture and is untenable once the rows toggle:
                the word would change case under the reader's own click. */}
            <DayNumber label="Day" number={day.number} className="lg:w-[60px] shrink-0" />

            <div className="mt-6 lg:mt-0 flex flex-1 flex-col lg:flex-row lg:gap-[42px]">
              {day.image && (
                /* Only drawn for the open day — a closed row is a title and
                   nothing else. Kept out of the panel below because the frame
                   sets it beside the copy rather than under the title, and a
                   collapsing wrapper around both would take the row's layout
                   with it.

                   Proportional, not a fixed pixel width: the frame gives the
                   photograph ~29% of the container at every desktop width, and
                   this track is the container less the gutter and its gap, so
                   32% of it lands on that 29%. */
                <div
                  className={cn(
                    /* A tinted ground under the picture. `display:none` keeps a
                       lazy image from ever intersecting, so a closed day's
                       photograph is not fetched until the click — good for the
                       bytes, but it means the box is empty for one round trip
                       on first open, and an untinted box is a hole. */
                    "relative aspect-[4/3] w-full lg:w-[32%] shrink-0 overflow-hidden rounded-sm bg-black/5",
                    !isOpen && "hidden",
                  )}
                >
                  <Image
                    src={day.image}
                    /* Empty, not the title: this is a scene-setting photograph
                       carrying nothing the heading beside it does not already
                       say, so falling back to `title` would announce the same
                       string twice. Every day in lib/packages.js sets imageAlt;
                       this is the path a hand-authored one takes. */
                    alt={day.imageAlt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 29vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}

              <div className={cn("flex-1", day.image && isOpen && "mt-6 lg:mt-0")}>
                <h3 id={headingId}>
                  <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    /* The whole title line is the hit area, not just the words,
                       so the control is as wide as the row it opens. */
                    /* One size in both states. Sizing the open day larger meant
                       the text the reader had just clicked resized by 14% under
                       the pointer, and a static frame cannot ask for that — it
                       only ever draws one row in each state, never the same row
                       in both. */
                    className="group flex w-full items-start justify-between gap-x-6 text-left font-heading text-[22px] leading-[1.2] text-navy transition-colors hover:text-navy/70 md:text-[24px] lg:text-[26px] xl:text-[28px]"
                  >
                    <span>{day.title}</span>

                    {/* Not in the frame, which draws the open day and cannot
                        show that the closed ones are controls. The same mark
                        components/common/FaqSection.jsx uses, so the two
                        accordions on this page open the same way. */}
                    <span
                      aria-hidden="true"
                      className="mt-1.5 flex h-[30px] w-[14px] shrink-0 items-center justify-center text-black"
                    >
                      {isOpen ? (
                        <Minus className="h-[14px] w-[14px]" strokeWidth={1.5} />
                      ) : (
                        <Plus className="h-[14px] w-[14px]" strokeWidth={1.5} />
                      )}
                    </span>
                  </button>
                </h3>

                {/* Outside the panel: the day's paragraph stands whether the day
                    is open or shut, which is what the frame draws — its closed
                    days carry their copy and only the detail is put away. It is
                    also what keeps a collapsed list of four days worth reading
                    instead of four bare titles. */}
                {day.description && <DayCopy className="mt-4">{day.description}</DayCopy>}

                {/* Hidden rather than unmounted — see the section's header. The
                    grid-rows trick animates to the content's own height without
                    anyone having to measure it, and matches FaqSection.
                 *
                 * `inert` is what FaqSection is missing. A zero-height
                 * overflow:hidden box with opacity 0 is hidden from the eye and
                 * from nothing else — it is the exact mechanism .sr-only relies
                 * on to stay announced — so without it a screen reader reads
                 * "collapsed" and then reads the collapsed day anyway, and any
                 * link the copy later gains becomes an invisible tab stop.
                 * inert prunes the subtree from the accessibility tree and from
                 * the tab order while leaving the text in the HTML for crawlers,
                 * which is the whole reason the panel is not unmounted. It also
                 * keeps role="region" honest: only the open day is a landmark,
                 * rather than all four sitting in the landmark list at once.
                 *
                 * motion-reduce:transition-none because every other animation
                 * in this section is gated on the preference through
                 * lib/gsap/useReveal.js; a raw CSS transition is the one thing
                 * that would still move. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headingId}
                  inert={!isOpen}
                  className={cn(
                    "grid transition-all duration-300 ease-in-out motion-reduce:transition-none",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    {/* The sentence that introduces the list, kept with the list
                        rather than with the paragraph above. It ends on a colon,
                        so left in the always-visible description it would dangle
                        against a closed day, promising items that are not there. */}
                    {day.itemsLead && <DayCopy className="mt-4">{day.itemsLead}</DayCopy>}

                    {day.items?.length > 0 && (
                      <ul className="mt-5 flex flex-col gap-y-2">
                        {day.items.map((item) => (
                          <li key={item} className="flex items-start gap-x-3">
                            <span
                              aria-hidden="true"
                              className="mt-[9px] h-[4px] w-[4px] shrink-0 rounded-full bg-black/60"
                            />
                            <DayCopy>{item}</DayCopy>
                          </li>
                        ))}
                      </ul>
                    )}

                    {day.footnote && <DayCopy className="mt-5">{day.footnote}</DayCopy>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </AnimateIn>
  );
}

/* The word over the numeral. Every day draws it, so the numerals line up on the
   same left edge whether the day is open or closed. */
function DayNumber({ label, number, className }) {
  return (
    <div className={cn("flex flex-row items-baseline gap-x-3 lg:flex-col lg:gap-x-0", className)}>
      <span className="font-top text-[13px] lg:text-[14px] text-black/50 leading-none">
        {label}
      </span>
      <span className="font-heading text-[32px] lg:text-[40px] xl:text-[44px] leading-none text-black/25 lg:mt-2">
        {number}
      </span>
    </div>
  );
}

/* One body style for every string in the section — the day copy, its list items
   and its closing line are all the same size in the frame. */
function DayCopy({ children, className }) {
  return (
    <p
      className={cn(
        "font-sans font-light text-black/75 text-[14px] lg:text-[15px] xl:text-[16px] leading-[1.7] max-w-[900px]",
        className,
      )}
    >
      {children}
    </p>
  );
}
