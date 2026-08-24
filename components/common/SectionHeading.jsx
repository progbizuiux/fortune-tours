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
        "flex flex-col gap-5 md:gap-7 lg:gap-6 2xl:gap-[35px]",
        centered && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "font-top max-lg:text-[12px] max-lg:leading-none text-h4",
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
            ? "items-center lg:gap-5 2xl:gap-[30px]"
            : "md:flex-row md:items-center md:justify-between md:gap-8 lg:gap-6 2xl:gap-8",
        )}
      >
        <h2
          className={cn(
            "max-lg:text-[30px] max-lg:leading-none max-lg:tracking-[-0.01em] text-navy dark:text-cream",
            !centered && "max-w-[730px]",
            titleClassName,
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "max-lg:text-[13px] max-lg:font-light max-lg:leading-[21px]",
              centered
                ? "max-lg:max-w-[340px] max-w-xl text-black/80 dark:text-cream/80"
                : "max-w-xl text-navy/70 dark:text-cream/70 md:text-right",
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
