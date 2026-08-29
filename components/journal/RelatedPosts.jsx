"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { JournalCard } from "@/components/common/JournalCard";
import { cn } from "@/lib/utils";

/* "Related Post" — the row of further reading under an article.
 *
 * Deliberately NOT components/common/CardCarouselSection: that one centres its
 * heading and owns a fixed card geometry it documents as not-a-prop, and its
 * cards are pictures with copy over them. This frame is left-aligned, uses the
 * journal's own card, and hangs a round arrow off the right edge. The only
 * thing the two share is "a row that scrolls".
 *
 * A native scroller rather than a transform track: the row then behaves like a
 * scroller everywhere it should — trackpad, touch, shift-wheel, and the
 * keyboard once it is focused — and the arrow is a convenience on top rather
 * than the only way through. `snap` keeps a card edge against the gutter.
 *
 * Shape-only. Content comes from lib/journal.js.
 */
export function RelatedPosts({ title = "Related Post", articles = [], className }) {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft <= 4);
    /* Rounded before comparing: sub-pixel widths otherwise leave the end state
       a fraction short and the arrow never disables. */
    setAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    sync();

    /* Also on resize: a viewport change alters clientWidth, so a row that
       needed scrolling at one width may not at the next. */
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    el.addEventListener("scroll", sync, { passive: true });

    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", sync);
    };
  }, [sync, articles.length]);

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el) return;

    // One card plus its gap, measured off the first child rather than assumed.
    const card = el.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 14 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  if (!articles.length) return null;

  return (
    <section
      aria-labelledby="related-posts-heading"
      className={cn("bg-background relative z-10 spacing", className)}
    >
      <Container>
        <AnimateIn>
          <h2
            id="related-posts-heading"
            className="font-heading text-h2 leading-[1.15] text-navy"
          >
            {title}
          </h2>
        </AnimateIn>
      </Container>

      <div className="relative mt-8 md:mt-10 lg:mt-[42px]">
        <ul
          ref={trackRef}
          /* The track runs to the viewport edge rather than stopping at the
             Container, so the next card is half-visible and the row reads as
             continuing. Its padding restores the Container's gutter for the
             first card, and scroll-padding keeps snapping to that same line. */
          className="flex snap-x snap-mandatory gap-[14px] overflow-x-auto px-4 pb-2 scroll-pl-4 md:px-8 md:scroll-pl-8 lg:px-20 lg:scroll-pl-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {articles.map((article) => (
            <li
              key={article.slug}
              /* Fixed widths, not a fraction: a fraction of the viewport would
                 make the last card land flush at some sizes and the row would
                 stop reading as scrollable. */
              className="w-[240px] shrink-0 snap-start sm:w-[260px] lg:w-[287px]"
            >
              <JournalCard
                meta={[article.kicker, article.readingTime].filter(Boolean).join(" — ")}
                title={article.title}
                href={article.href}
                image={article.image}
                alt={article.imageAlt}
                imageClassName="aspect-[287/250]"
                titleClassName="font-heading text-navy text-small leading-[1.35] xl:max-w-full"
              />
            </li>
          ))}
        </ul>

        {/* Pointer affordance only — the row is already reachable and scrollable
            without it, so the arrows are hidden from assistive tech rather than
            duplicating the scroller as two more tab stops. Hidden entirely on
            touch-sized screens, where swiping is the gesture. */}
        <div aria-hidden="true" className="pointer-events-none hidden lg:block">
          <Arrow
            direction="prev"
            disabled={atStart}
            onClick={() => scrollByCard(-1)}
            className="left-6"
          />
          <Arrow
            direction="next"
            disabled={atEnd}
            onClick={() => scrollByCard(1)}
            className="right-6"
          />
        </div>
      </div>
    </section>
  );
}

/* The round white arrow the frame floats over the row's edge, vertically
   centred on the picture rather than on the whole card — the copy below the
   picture is not what it is paging through. */
function Arrow({ direction, disabled, onClick, className }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "pointer-events-auto absolute top-[125px] z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-[0_2px_12px_rgba(0,0,0,0.14)] transition-opacity",
        disabled ? "pointer-events-none opacity-0" : "opacity-100 hover:bg-white/90",
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}
