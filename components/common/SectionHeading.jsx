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
}) {
  const centered = align === "center";

  return (
    <AnimateIn
      stagger={0.12}
      className={cn(
        "flex flex-col gap-5 md:gap-7",
        centered && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "font-top text-h4",
            centered
              ? "text-black dark:text-cream"
              : "text-navy/70 dark:text-cream/70",
          )}
        >
          {eyebrow}
        </span>
      )}

      <div
        className={cn(
          "flex flex-col gap-4",
          centered
            ? "items-center"
            : "md:flex-row md:items-end md:justify-between md:gap-8",
        )}
      >
        <h2 className="text-navy dark:text-cream">{title}</h2>
        {description && (
          <p
            className={cn(
              !centered && "max-w-lg",
              centered
                ? "text-black/80 dark:text-cream/80"
                : "text-navy/70 dark:text-cream/70 md:text-right",
            )}
          >
            {description}
          </p>
        )}
      </div>
    </AnimateIn>
  );
}
