import { forwardRef } from "react";
import Link from "next/link";
import { MegaMenuPanel } from "./MegaMenuPanel";
import { SITE_MENU } from "@/lib/navigation";
import { MENU_ROW_ENTER, menuRowDelay } from "@/lib/motion";

/* The sheet behind the bar's menu button — the site-wide pages.
 *
 * Two tiers, as the design draws them: the primary pages large (at the h4
 * token in the heading face), then the smaller service links. Both come from
 * lib/navigation.js. */
export const SiteMenu = forwardRef(function SiteMenu(
  { id, onNavigate, ...panelProps },
  ref,
) {
  return (
    <MegaMenuPanel
      ref={ref}
      id={id}
      label="Site menu"
      onNavigate={onNavigate}
      {...panelProps}
    >
      <nav
        aria-label="Site"
        className="flex flex-col gap-14 lg:flex-row lg:gap-20 2xl:gap-28"
      >
        <ul className="flex flex-col gap-3">
          {SITE_MENU.primary.map((item, index) => (
            <li
              key={item.href}
              className={MENU_ROW_ENTER}
              style={menuRowDelay(index)}
            >
              {/* Drawn at the h4 token (size, weight, leading) in the heading
                  face — a list of links, so the token classes rather than
                  seven <h4> elements in the outline. */}
              <Link
                href={item.href}
                className="text-h4 font-top text-navy hover:text-sky inline-flex min-h-11 items-center transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-1 lg:self-end">
          {SITE_MENU.secondary.map((item, index) => (
            <li
              key={item.href}
              className={MENU_ROW_ENTER}
              // Continues the count from the primary list, so the two tiers
              // read as one cascade.
              style={menuRowDelay(SITE_MENU.primary.length + index)}
            >
              <Link
                href={item.href}
                className="text-small text-navy/80 hover:text-sky flex min-h-9 items-center font-light transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </MegaMenuPanel>
  );
});
