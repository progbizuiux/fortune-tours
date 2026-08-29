"use client";

import { cn } from "@/lib/utils";

/* The category row under the journal's heading.
 *
 * A hairline follows every control, the last one included — the frame closes
 * the row off on its right as well as splitting the labels, the same way
 * components/packages/InclusionsSection.jsx draws its two tabs.
 *
 * "All" keeps its sentence case while the categories are set in caps. That is
 * the frame, and it is also the distinction it is drawing: "All" is the
 * unfiltered state rather than one of the categories beside it.
 *
 * Shape-only — the list comes from lib/journal.js, so adding a category is one
 * line there and nothing here changes.
 */
export function JournalFilters({ categories = [], active, onChange, className }) {
  if (!categories.length) return null;

  return (
    <div
      role="tablist"
      aria-label="Filter journal by category"
      /* One line that scrolls, never a wrapped one. Five categories do not fit
         a phone, and wrapping left the last of them alone on a second row with
         a hairline hanging off its right — a divider between nothing and
         nothing. Scrolling keeps the row reading as one control.

         The negative margin runs the track to the screen edge on a phone and
         its padding puts the first chip back on the Container's gutter, so the
         cut-off chip at the right reads as "there is more" rather than as a
         layout that overflowed. Both are dropped from md, where the row fits
         and the track should sit on the grid like everything else. */
      className={cn(
        "-mx-4 flex items-stretch overflow-x-auto px-4 md:mx-0 md:px-0",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {categories.map((category) => {
        const isActive = category.key === active;

        return (
          <button
            key={category.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(category.key)}
            className={cn(
              /* shrink-0 so the labels keep their own width inside the
                 scroller instead of being squeezed until they wrap mid-word. */
              "shrink-0 border-r border-black/15 px-6 py-3 leading-none transition-colors md:px-8 lg:px-[34px] lg:py-[15px]",
              "font-top text-h4 whitespace-nowrap",
              isActive
                ? "bg-black font-normal text-white"
                : "font-light uppercase tracking-[0.06em] text-navy hover:text-navy/60",
            )}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
