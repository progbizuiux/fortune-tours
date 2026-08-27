import { cn } from "@/lib/utils";
import { AnimateIn } from "@/components/common/AnimateIn";

/* Chapter header used above the numbered home-page sections (Figma "final"):
   a "Chapter NN — Label" eyebrow over the section heading.

   align="left" (default): note right/bottom-aligns to the heading from md up.
   align="center": stacked and centered — black eyebrow, description under the
   heading at black/80 (Figma → Chapter 06 — Timetable).

   The h2 and p pick up their full typography (family/size/weight/leading/
   tracking) from the design-system tag defaults; the eyebrow reuses the
   text-h4 token. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  eyebrowClassName,
  // For sections whose heading is drawn at a size the h2 token does not reach.
  // `text-h2` is generated from an `@theme inline` token, so it compiles to the
  // literal clamp and always resolves to 65px at 1920 — the 1024-1535 downscale
  // in globals.css only reaches bare tags. Left unset, nothing changes.
  titleClassName,
  descriptionClassName,
}) {
  const centered = align === "center";

  return (
    <AnimateIn
      stagger={0.12}
      className={cn(
        "flex flex-col gap-5 md:gap-7 lg:max-xl:gap-2 xl:max-2xl:gap-3 2xl:gap-5",
        centered && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "font-top max-lg:text-[12px] max-lg:leading-none lg:max-xl:text-[13.5px] xl:max-2xl:text-[15px] 2xl:text-h4",
            centered
              ? "text-black dark:text-cream"
              : "text-navy/70 dark:text-cream/70",
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </span>
      )}

      <div
        className={cn(
          "flex flex-col gap-4",
          centered
            ? "items-center lg:max-xl:gap-2 xl:max-2xl:gap-3 2xl:gap-[30px]"
            : "md:flex-row md:items-center md:justify-between md:gap-8 lg:max-xl:gap-3 xl:max-2xl:gap-4 2xl:gap-8",
        )}
      >
        {/* Guarded: a heading block whose frame draws only an eyebrow over a
            paragraph — /about-us "Behind The Journey" — would otherwise render
            an empty h2, which is both a stray gap and a heading with no text
            in the outline. Every existing caller passes a title, so nothing
            they render changes. */}
        {title && (
        <h2
          className={cn(
            // lg-to-xl steps down from the token's 46px: at those widths the
            // heading shares its row with the description and runs long.
            // Below lg and from xl up are unchanged.
            "max-lg:text-[30px] max-lg:leading-none max-lg:tracking-[-0.01em] text-navy lg:max-xl:text-[34px] xl:max-2xl:text-[38px] dark:text-cream",
            !centered && "max-w-[730px]",
            titleClassName,
          )}
        >
          {title}
        </h2>
        )}
        {description && (
          <p
            className={cn(
              "max-lg:text-[13px] max-lg:font-light max-lg:leading-[21px] lg:max-xl:text-[13.5px] xl:max-2xl:text-[14.5px] 2xl:text-body",
              centered
                ? "max-lg:max-w-[340px] max-w-xl text-black/80 dark:text-cream/80"
                : // xl and up gets a slightly wider measure — the copy runs to
                  // four or five cramped lines against the heading otherwise.
                  // Below xl stays on max-w-xl, unchanged.
                  "max-w-xl text-navy/70 xl:max-w-2xl dark:text-cream/70 md:text-right",
              descriptionClassName,
            )}
          >
            {description}
          </p>
        )}
      </div>
    </AnimateIn>
  );
}
