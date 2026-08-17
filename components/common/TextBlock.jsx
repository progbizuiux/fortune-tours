import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CtaLink } from "@/components/common/CtaLink";

/* The eyebrow → heading → body → arrow-CTA quad the destination sections are
   built from.

   Extracted because HighlightsSection alone wrote it out three times: the
   eyebrow and CTA className strings were byte-identical across all three
   copies, and only the heading/body top margins and the body max-width
   differed. Twelve hand-maintained class strings collapse to four here.

   The defaults are the Kerala Figma values. Each part also takes its own
   className so a call site can retune one value without restating the whole
   string — overrides are passed last, so twMerge lets them win (mt-[32px] +
   md:mt-[27px] resolves to the override, same property, same variant).

   Deliberately NOT responsible for its own outer layout: callers wrap it in
   whatever flex/grid context they need and pass that through `className`. That
   is the part that genuinely differs per instance, so baking it in would just
   force every call site to override it. */
export function TextBlock({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref = "#",
  as: Heading = "h3",
  className,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
  ctaClassName,
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      {eyebrow && (
        <span
          className={cn(
            "font-top text-[12px] md:text-[14px] xl:text-[16px] font-normal leading-[11.7px] text-black",
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </span>
      )}

      {title && (
        <Heading
          className={cn(
            "font-heading text-[25px] md:text-[30px] xl:text-[45px] leading-[41.4px] md:leading-120 xl:leading-[41.4px] tracking-[-0.7px] mt-[9px] md:mt-[20px] text-navy",
            titleClassName,
          )}
        >
          {title}
        </Heading>
      )}

      {description && (
        <p
          className={cn(
            "font-sans text-[13px] md:text-[16px] xl:text-[18px] font-light leading-[21px] md:leading-[24px] xl:leading-[28.9px] text-black/80 mt-[6px] md:mt-[32px] max-w-[668.7px]",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}

      {ctaLabel && (
        <CtaLink
          href={ctaHref}
          underline={false}
          className={cn(
            "inline-flex items-center gap-2 mt-[41px] md:mt-8 font-sans text-[12px] md:text-[14px] font-normal leading-[11px] tracking-[1px] uppercase text-navy hover:opacity-70 transition-opacity",
            ctaClassName,
          )}
        >
          {ctaLabel}
          <ChevronRight className="w-4 h-4" />
        </CtaLink>
      )}
    </div>
  );
}
