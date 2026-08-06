import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="font-top text-eyebrow text-sky font-semibold tracking-wider uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-h2 text-navy dark:text-cream">
        {title}
      </h2>
      {description && (
        <p className="text-lead text-navy/70 dark:text-cream/70 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
