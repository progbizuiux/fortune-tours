"use client";

import { useMemo, useState } from "react";
import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { JournalCard } from "@/components/common/JournalCard";
import { FeaturedArticle } from "@/components/journal/FeaturedArticle";
import { JournalFilters } from "@/components/journal/JournalFilters";
import { JournalPagination } from "@/components/journal/JournalPagination";
import { JOURNAL_PAGE_SIZE } from "@/lib/journal";
import { HERO_BODY, HERO_HEADING } from "@/lib/typography";
import { cn } from "@/lib/utils";

/* The journal index: masthead, category row, promoted article, card grid, pages.
 *
 * One client component holds both pieces of state because they are coupled —
 * changing the category has to send the reader back to page one, or a filter
 * with two pages of results leaves them stranded on a page three that no longer
 * exists. Everything below is props-only and server-renderable; this is the
 * only file that needs the browser.
 *
 * Filtering and paging happen here rather than over the network because the
 * whole archive is a local module today (see lib/journal.js). When it moves to
 * Strapi this becomes the place that reads ?category= and ?page= off the URL
 * instead — the components it composes do not change either way.
 */
export function JournalIndex({
  title,
  description,
  categories = [],
  featured,
  articles = [],
  className,
}) {
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const matching = useMemo(
    () =>
      category === "all"
        ? articles
        : articles.filter((article) => article.category === category),
    [articles, category],
  );

  const pageCount = Math.max(1, Math.ceil(matching.length / JOURNAL_PAGE_SIZE));

  /* Clamped rather than trusted. `page` is state and `pageCount` is derived, so
     a filter that shrinks the set could otherwise leave the slice empty for a
     render before the reset below lands. */
  const current = Math.min(page, pageCount);
  const visible = matching.slice(
    (current - 1) * JOURNAL_PAGE_SIZE,
    current * JOURNAL_PAGE_SIZE,
  );

  /* The promoted article belongs to a category like any other, so it stands
     only in the unfiltered view or under its own — and only on the first page,
     where the design puts it. */
  const showFeatured =
    featured &&
    current === 1 &&
    (category === "all" || featured.category === category);

  const changeCategory = (next) => {
    setCategory(next);
    setPage(1);
  };

  return (
    <div className={cn("bg-background relative z-10", className)}>
      <Container className="pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-[190px] lg:pb-[100px]">
        <AnimateIn>
          {/* The shared stacks from lib/typography.js, the same pair every hero
              band on the site draws. A bare `text-h1` would not do: it is
              generated from `@theme inline`, so it compiles to the literal clamp
              and misses the 1024–1535 step-downs app/globals.css sets — 85px on
              a 1280 laptop where the scale says 58. */}
          <h1 className={cn(HERO_HEADING, "max-w-[1000px] leading-[1.1] whitespace-pre-line text-navy")}>
            {title}
          </h1>

          {description && (
            <p className={cn(HERO_BODY, "mt-6 max-w-[680px] font-light leading-[1.6] whitespace-pre-line text-black/70 lg:mt-[45px]")}>
              {description}
            </p>
          )}
        </AnimateIn>

        <AnimateIn className="mt-10 lg:mt-[55px]">
          <JournalFilters
            categories={categories}
            active={category}
            onChange={changeCategory}
          />
        </AnimateIn>

        {showFeatured && (
          <FeaturedArticle
            {...featured}
            className="mt-14 md:mt-20 lg:mt-[100px]"
          />
        )}

        {visible.length > 0 ? (
          <ul
            className={cn(
              "grid grid-cols-1 gap-x-[31px] gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-[90px]",
              showFeatured ? "mt-14 md:mt-20 lg:mt-[110px]" : "mt-14 md:mt-20 lg:mt-[100px]",
            )}
          >
            {visible.map((article) => (
              <AnimateIn as="li" key={article.slug}>
                <JournalCard
                  meta={[article.kicker, article.readingTime].filter(Boolean).join(" — ")}
                  title={article.title}
                  href={article.href}
                  image={article.image}
                  alt={article.imageAlt}
                  /* The shared card is drawn for the home page's portrait
                     strip; the journal grid's frame is a wider crop and sets
                     its headline in the display face rather than body copy. */
                  imageClassName="aspect-[566/495]"
                  titleClassName="font-heading text-navy text-h4 leading-[1.25] xl:max-w-full"
                />
              </AnimateIn>
            ))}
          </ul>
        ) : (
          /* A filter with nothing behind it is a real state once the archive is
             editorial — better a sentence than a silent gap under the row. */
          <p className="mt-14 font-sans text-body font-light text-black/60 lg:mt-[100px]">
            Nothing filed under this yet. Try another category.
          </p>
        )}

        <JournalPagination
          page={current}
          pageCount={pageCount}
          onChange={setPage}
          className="mt-16 md:mt-20 lg:mt-[100px]"
        />
      </Container>
    </div>
  );
}
