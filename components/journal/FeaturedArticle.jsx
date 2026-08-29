import Image from "next/image";
import { AnimateIn } from "@/components/common/AnimateIn";
import { CtaLink } from "@/components/common/CtaLink";
import { cn } from "@/lib/utils";

/* The promoted article above the journal grid.
 *
 * Photograph on the left, and on the right a meta line ruled off from the copy
 * below it — kicker and reading time on one end, the date on the other — then
 * the headline, the standfirst, and the call to action sitting on the column's
 * bottom edge rather than under the paragraph. `justify-between` on a column
 * that matches the picture's height is what puts it there, so the two columns
 * close on the same line however long the standfirst runs.
 *
 * Shape-only. Content comes from lib/journal.js.
 */
export function FeaturedArticle({
  kicker,
  readingTime,
  dateLabel,
  title,
  description,
  href = "#",
  image,
  imageAlt = "",
  readLabel = "Read more",
  className,
}) {
  if (!title) return null;

  return (
    <AnimateIn as="article" className={cn("w-full", className)}>
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-[30px] xl:gap-[45px]">
        {image && (
          <div className="relative aspect-[961/663] w-full shrink-0 overflow-hidden bg-black/5 lg:w-[55%]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              /* The picture is a little over half the Container's content box,
                 which is the full frame less its 80px gutters. */
              sizes="(min-width: 1024px) 53vw, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col">
          {/* Ruled off underneath rather than between the two halves: the frame
              draws one line across the whole column, under both. */}
          {/* Stacked on the narrowest screens. Side by side, the kicker wraps
              onto a second line while the date stays pinned to the right of the
              first, and the two read as one broken line rather than two facts.
              From sm the pair fits and takes the frame's opposed alignment. */}
          <div className="flex flex-col items-start gap-y-1 border-b border-black/15 pb-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-6 lg:pb-[15px]">
            {/* Shared tokens throughout — see the note in JournalIndex. */}
            <p className="font-sans text-small font-light leading-none text-navy">
              {[kicker, readingTime].filter(Boolean).join(" — ")}
            </p>

            {dateLabel && (
              /* A machine-readable date beside the printed one, so the entry is
                 legible to a crawler without the display string having to be
                 parseable. lib/journal.js carries both. */
              <p className="shrink-0 font-sans text-small font-light leading-none text-navy">
                {dateLabel}
              </p>
            )}
          </div>

          {/* text-h2, which is 38px through the 1024–1279 band and 42px through
              1280–1535 — the frame's own 44px, near enough, and reached through
              the scale rather than beside it. */}
          <h2 className="mt-8 font-heading text-h2 max-md:text-[28px] leading-[1.15] text-navy lg:mt-[50px]">
            {title}
          </h2>

          {description && (
            <p className="mt-5 max-w-[680px] font-sans text-body font-light leading-[1.7] text-black/75 lg:mt-[30px]">
              {description}
            </p>
          )}

          {/* mt-auto is what drops this onto the column's bottom edge, level
              with the foot of the photograph. The dividers on both sides are
              CtaLink's, the same pair the hero CTAs draw. */}
          <div className="mt-10 flex items-center lg:mt-auto lg:pt-10">
            <CtaLink
              href={href}
              underline={false}
              withLeftDivider
              withRightDivider
              dividerClassName="h-8 w-px bg-black/15"
              className="px-6 font-sans text-body font-light leading-none text-navy hover:text-sky lg:px-[30px]"
            >
              {readLabel}
            </CtaLink>
          </div>
        </div>
      </div>
    </AnimateIn>
  );
}
