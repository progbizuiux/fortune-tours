import { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MegaMenuPanel } from "./MegaMenuPanel";
import { EXPERIENCE_MENU } from "@/lib/navigation";
import { MENU_ROW_ENTER, menuRowDelay } from "@/lib/motion";

/* The Experiences dropdown — one row of five portrait tiles under a heading.
 *
 * Each tile is a photograph with "I want.." at the top and the experience name
 * in a rule-framed label at the bottom. Idle tiles are dimmed and the label is
 * an outline; the hovered tile lifts its dimming and the label fills white,
 * which is the state the design's first card shows. Both are driven off the
 * tile's `group` so hover anywhere on the picture flips them together.
 *
 * Content comes from lib/navigation.js. */
export const ExperiencesMenu = forwardRef(function ExperiencesMenu(
  { id, onNavigate, ...panelProps },
  ref,
) {
  return (
    <MegaMenuPanel
      ref={ref}
      id={id}
      label="Experiences menu"
      onNavigate={onNavigate}
      {...panelProps}
    >
      <h4 id="navbar-experiences-heading" className="text-navy">
        Choose your Experience
      </h4>
      <ul
        aria-labelledby="navbar-experiences-heading"
        className="mt-6 grid grid-cols-5 gap-[18px]"
      >
        {EXPERIENCE_MENU.map((experience, index) => (
          <li
            key={experience.key}
            className={MENU_ROW_ENTER}
            style={menuRowDelay(index, { step: 40 })}
          >
            <Link
              href={experience.href}
              className="group relative block aspect-[343/422] overflow-hidden bg-navy/5"
            >
              <Image
                src={experience.image}
                alt={experience.alt}
                fill
                sizes="(min-width: 1024px) 18vw, 50vw"
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
              {/* Dimming layer, lifted on hover so the hovered picture reads
                  brighter than its neighbours. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/10"
              />
              <span className="absolute inset-0 flex flex-col items-center justify-between px-4 py-9 text-white">
                <span className="text-small leading-none font-light">
                  I want..
                </span>
                {/* Same rule-framed label as the site's chip buttons; white
                    fill on hover rather than the sky sweep because the label
                    sits on a photograph, where the design keeps it monochrome. */}
                {/* min-h rather than h and no nowrap: tiles are ~155px wide
                    at 1024, where "Honeymoon Holidays" has to break onto two
                    lines or be clipped by the tile's overflow-hidden. Below
                    2xl the label steps down as a whole — 12px type, tighter
                    padding and height — so it sits in the smaller tile the
                    way the full-size one sits in the design's. */}
                <span className="group-hover:text-navy inline-flex min-h-8 items-center border-x border-white px-3 py-1 text-center text-xs leading-tight font-normal transition-colors duration-300 group-hover:bg-white 2xl:text-body 2xl:min-h-9 2xl:px-4 2xl:py-1.5">
                  {experience.label}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </MegaMenuPanel>
  );
});
