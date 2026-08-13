"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, RotateCw, Search, X } from "lucide-react";
import { FrameButton } from "@/components/common/FrameButton";
import { FILTER_GROUPS } from "@/lib/searchCatalog";
import { cn } from "@/lib/utils";

/* Filter rail + free-text search for /search.
 *
 * The URL is the only state: every control writes a query param and the page
 * (a server component) re-renders the results from it. That is what makes a
 * filtered view shareable — /search?term=kerala&experience=Backwaters restores
 * exactly what the sender saw — and it keeps back/forward working for free.
 *
 * The text input is the one exception: it holds local state while typing and
 * commits on submit, because pushing a route per keystroke would re-render the
 * results grid on every letter. */
export function SearchToolbar({ className }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Always starts empty, including on a shared /search?term=... link: the box
  // is where the NEXT search is typed, and the one in force is shown as a chip
  // below. It deliberately does not mirror the URL — see submitTerm.
  const [term, setTerm] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const railRef = useRef(null);

  useEffect(() => {
    if (!openKey) return;

    function handlePointerDown(event) {
      if (!railRef.current?.contains(event.target)) setOpenKey(null);
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") setOpenKey(null);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openKey]);

  // scroll: false — the results sit below the fold on a long list, and jumping
  // to the top on every filter change loses the reader's place in the grid.
  function commit(mutate) {
    const next = new URLSearchParams(searchParams.toString());
    mutate(next);
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function selectOption(key, value) {
    commit((params) => (value ? params.set(key, value) : params.delete(key)));
    setOpenKey(null);
  }

  function submitTerm(event) {
    event.preventDefault();
    const trimmed = term.trim();
    commit((params) =>
      trimmed ? params.set("term", trimmed) : params.delete("term"),
    );
    // Emptied on submit so the next search can be typed straight over it
    // instead of having to clear the previous one first. The term is not lost:
    // it becomes a chip below, which is also how it gets removed again.
    setTerm("");
  }

  function resetAll() {
    setTerm("");
    router.push(pathname, { scroll: false });
  }

  // The term leads, then one chip per filter group that holds a value.
  const activeChips = [
    { key: "term", value: searchParams.get("term") },
    ...FILTER_GROUPS.map((group) => ({
      key: group.key,
      value: searchParams.get(group.key),
    })),
  ].filter((chip) => chip.value);

  return (
    <div className={className}>
      {/* items-stretch keeps every cell's divider the full height of the tallest
          one, so the rules read as one continuous rail rather than four bars of
          slightly different lengths. */}
      <div
        ref={railRef}
        className="flex flex-col items-stretch lg:flex-row"
        role="search"
      >
        {/* Nothing here may scroll or clip. The open dropdown is absolutely
            positioned inside this row, so any overflow value other than
            `visible` traps it: the panel is clipped to the row and the row
            grows scrollbars on both axes instead of the menu floating over the
            page. (An overflow-x of auto also computes overflow-y to auto, so
            constraining one axis is enough to break it.) Below lg the cells
            wrap onto a second line rather than scrolling, and the text field
            drops to its own row underneath. */}
        {/* `relative` here and `lg:static` below is what keeps an open menu on
            screen on a phone. Anchored to its own cell, a 220px panel opening
            from a cell that starts 180px into a 375px screen runs 25px past the
            edge and the whole page scrolls sideways. Below lg the panel anchors
            to this row instead and spans its full width; from lg there is room
            to hang it under its own cell. */}
        <div className="relative flex flex-wrap lg:static">
          {FILTER_GROUPS.map((group, index) => {
            const value = searchParams.get(group.key);
            const isOpen = openKey === group.key;

            return (
              <div key={group.key} className="lg:relative">
                <FrameButton
                  variant="filter"
                  active={Boolean(value)}
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                  onClick={() => setOpenKey(isOpen ? null : group.key)}
                  // Closing rule of the rail. On the last cell rather than the
                  // row, so it stays hard against the final label when the
                  // cells wrap instead of stranding itself at the right edge.
                  className={cn(
                    index === FILTER_GROUPS.length - 1 &&
                      "border-navy/20 border-r",
                  )}
                >
                  {value ?? group.label}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-4 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </FrameButton>

                {isOpen && (
                  <ul
                    role="listbox"
                    aria-label={group.label}
                    className="border-navy/15 absolute top-full right-0 left-0 z-30 mt-px border bg-white py-2 shadow-lg lg:right-auto lg:min-w-[220px]"
                  >
                    <li role="option" aria-selected={!value}>
                      <FrameButton
                        variant="filterOption"
                        active={!value}
                        onClick={() => selectOption(group.key, null)}
                      >
                        {group.allLabel}
                      </FrameButton>
                    </li>
                    {group.options.map((option) => (
                      <li
                        key={option}
                        role="option"
                        aria-selected={option === value}
                      >
                        <FrameButton
                          variant="filterOption"
                          active={option === value}
                          onClick={() => selectOption(group.key, option)}
                        >
                          {option}
                        </FrameButton>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <form
          onSubmit={submitTerm}
          // Not pinned to 360px the moment the rail goes horizontal: at 1024
          // the three filter cells need ~522px and the form's 360 demanded 882
          // of the 864 available, so "Popular Packages" wrapped to a second
          // line with ~190px of dead rail beside the other two — the layout was
          // worse at 1024 than at 1023. It flexes into whatever is left until
          // xl, where 360px fits comfortably.
          className="border-navy/20 flex items-center gap-3 border-l px-5 py-3 max-sm:gap-2 max-sm:px-3 max-lg:mt-px max-lg:border-r lg:ml-auto lg:w-auto lg:min-w-[240px] lg:flex-1 xl:w-[360px] xl:flex-none"
        >
          {/* A real submit button, not a decorative glyph. It gives the search
              a control you can click, and it is what makes Enter submit
              dependably — a form whose only field is a lone text input relies
              on implicit submission, which does not fire in every browser.
              -m-2 cancels the variant's padding so the hit area grows to 34px
              for touch without making this row taller than the filter cells. */}
          <FrameButton
            variant="bare"
            type="submit"
            aria-label="Search"
            className="text-navy/50 hover:text-sky -m-2 shrink-0"
          >
            <Search aria-hidden="true" className="size-[18px]" />
          </FrameButton>
          <label htmlFor="search-term" className="sr-only">
            Search destinations and experiences
          </label>
          <input
            id="search-term"
            name="term"
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search destinations, experiences..."
            className="text-body placeholder:text-navy/50 w-full bg-transparent font-light outline-none"
          />
        </form>
      </div>

      {activeChips.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="font-top text-navy text-[13px] font-medium">
            Active Filters:
          </span>

          {activeChips.map((chip) => (
            <FrameButton
              key={chip.key}
              variant="filterChip"
              onClick={() => selectOption(chip.key, null)}
              aria-label={`Remove filter ${chip.value}`}
            >
              {/* The term chip echoes whatever is in the URL, so it can be an
                  arbitrarily long unbroken token. Truncating keeps the chip on
                  one line instead of letting a pasted string blow the row past
                  the viewport at 320px; the full value stays in aria-label. */}
              <span className="max-w-[22ch] truncate">{chip.value}</span>
              <X aria-hidden="true" className="size-3.5 shrink-0" />
            </FrameButton>
          ))}

          <FrameButton variant="textAction" onClick={resetAll}>
            <RotateCw aria-hidden="true" className="size-3.5" />
            Reset filters
          </FrameButton>
        </div>
      )}
    </div>
  );
}
