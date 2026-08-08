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
        <span className="font-top text-h4 text-sky font-semibold tracking-wider uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-h2 text-navy">{title}</h2>
      {description && (
        <p className="text-body text-navy/70 max-w-2xl">{description}</p>
      )}
    </div>
  );
}
