import Image from "next/image";
import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { HERO_BODY, HERO_HEADING } from "@/lib/typography";
import { cn } from "@/lib/utils";

/* The opening of a journal article: kicker, headline, standfirst, byline, and
 * the lead photograph across the column.
 *
 * No PageHero here. That one is a full-bleed picture with the copy centred over
 * it and the bar going transparent above it; this frame sets the copy on the
 * page's own ground with the photograph underneath, so the two share a name and
 * nothing else. The article page marks itself for a solid navbar for the same
 * reason the index does — see app/journal/page.js.
 *
 * Shape-only. Content comes from lib/journal.js.
 */
export function ArticleHero({
  kicker,
  readingTime,
  title,
  standfirst,
  dateLabel,
  date,
  author,
  image,
  imageAlt = "",
  className,
}) {
  const meta = [kicker, readingTime].filter(Boolean).join(" — ");

  return (
    /* A <div>, not the <header> this masthead semantically is. app/globals.css
       narrows --text-body and --text-small on `header` to tune the navbar, and
       that override is inherited by any header on the page — so the shared type
       tokens below would silently render a size smaller here than everywhere
       else on the site. The <article> around this already carries the
       semantics. */
    <div className={cn("bg-cream relative z-10", className)}>
      <Container className="pt-28 pb-10 md:pt-36 md:pb-14 lg:pt-[170px] lg:pb-[60px]">
        <AnimateIn className="max-w-[880px]">
          {/* The shared tokens, not literals — text-small, text-h1 and
              text-body carry the whole scale including the two laptop-band
              step-downs in app/globals.css, so this page ramps with every other
              one instead of drifting its own way. */}
          {meta && (
            <p className="font-sans text-small font-light leading-none text-black/60">
              {meta}
            </p>
          )}

          {/* HERO_HEADING, not a bare `text-h1`. The token is generated from an
              `@theme inline` block, so it compiles to the literal clamp and
              never sees the 1024–1535 step-downs app/globals.css sets on
              :root — a bare text-h1 renders 85px on a 1280 laptop where the
              scale says 58. The shared constant carries those bands, which is
              the whole reason lib/typography.js exists. */}
          <h1 className={cn(HERO_HEADING, "mt-5 leading-[1.15] text-navy lg:mt-[26px]")}>
            {title}
          </h1>

          {standfirst && (
            <p className={cn(HERO_BODY, "mt-6 max-w-[620px] font-light leading-[1.7] text-black/70 lg:mt-[38px]")}>
              {standfirst}
            </p>
          )}

          {/* Date and byline on one line, split by a hairline. Wraps rather than
              overflows on a narrow phone, where the author's name and the date
              together are wider than the column. */}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 lg:mt-[26px]">
            {dateLabel && (
              /* <time> with the machine-readable value beside the printed one,
                 so the publication date is legible to a crawler without the
                 display string having to be parseable. */
              <time
                dateTime={date}
                className="font-sans text-small font-light leading-none text-black/60"
              >
                {dateLabel}
              </time>
            )}

            {dateLabel && author?.name && (
              <span aria-hidden="true" className="h-4 w-px bg-black/20" />
            )}

            {author?.name && (
              <span className="flex items-center gap-x-2">
                {author.avatar && (
                  <Image
                    src={author.avatar}
                    /* Empty on purpose: the name sits immediately beside it, so
                       a description here would announce the byline twice. */
                    alt=""
                    width={22}
                    height={22}
                    className="h-[22px] w-[22px] shrink-0 rounded-full object-cover"
                  />
                )}
                <span className="font-sans text-small font-light leading-none text-navy">
                  {author.name}
                </span>
              </span>
            )}
          </div>
        </AnimateIn>

        {image && (
          <AnimateIn className="mt-8 md:mt-10 lg:mt-[38px]">
            {/* Taller on a phone, where a 2:1 band of landscape is a letterbox
                strip a few centimetres deep, and the frame's own ratio from md. */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5 md:aspect-[904/448]">
              <Image
                src={image}
                alt={imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) calc(100vw - 160px), (min-width: 768px) calc(100vw - 64px), calc(100vw - 32px)"
                className="object-cover"
              />
            </div>
          </AnimateIn>
        )}
      </Container>
    </div>
  );
}
