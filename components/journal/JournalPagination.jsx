"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* The page control under the journal grid: a bordered arrow at each end with
 * the page numbers between them, the current one filled.
 *
 * A <nav> with buttons rather than links because the list is filtered and paged
 * in the browser — there is no per-page URL to point at yet. When the journal
 * moves to the CMS and the index becomes /journal?page=2, these become <Link>s
 * and nothing else here changes.
 *
 * Shape-only. The caller owns the state.
 */
export function JournalPagination({ page = 1, pageCount = 1, onChange, className }) {
  // One page of results is not a set to page through.
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const go = (next) => onChange?.(Math.min(Math.max(next, 1), pageCount));

  return (
    <nav
      aria-label="Journal pages"
      className={cn("flex items-center justify-center gap-3 lg:gap-5", className)}
    >
      <Arrow
        direction="previous"
        disabled={page === 1}
        onClick={() => go(page - 1)}
      />

      <ol className="flex items-center gap-2 lg:gap-3">
        {pages.map((n) => {
          const isCurrent = n === page;

          return (
            <li key={n}>
              <button
                type="button"
                onClick={() => go(n)}
                /* aria-current is what tells a screen reader which page it is
                   on; the filled panel says it to everyone else. */
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Page ${n}`}
                className={cn(
                  "flex h-[38px] w-[38px] items-center justify-center font-sans text-small leading-none transition-colors",
                  isCurrent
                    ? "bg-black font-normal text-white"
                    : "font-light text-navy hover:text-sky",
                )}
              >
                {n}
              </button>
            </li>
          );
        })}
      </ol>

      <Arrow
        direction="next"
        disabled={page === pageCount}
        onClick={() => go(page + 1)}
      />
    </nav>
  );
}

/* The two end controls. Kept as one component so the box, the disabled state
   and the icon stay in step; only the direction differs. */
function Arrow({ direction, disabled, onClick }) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "previous" ? "Previous page" : "Next page"}
      className={cn(
        "flex h-[54px] w-[54px] items-center justify-center border border-black/15 transition-colors lg:h-[60px] lg:w-[60px]",
        /* Disabled rather than hidden at the ends: the row keeps its width, so
           the numbers do not shift sideways when the reader reaches page one or
           the last page. */
        disabled ? "cursor-not-allowed text-black/20" : "text-navy hover:border-black/40",
      )}
    >
      <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.25} />
    </button>
  );
}
