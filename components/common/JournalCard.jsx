import Image from "next/image";
import { CtaLink } from "@/components/common/CtaLink";
import { ArrowUpRight } from "lucide-react";
import { CascadeText } from "@/components/common/CascadeText";
import { cn } from "@/lib/utils";

export function JournalCard({
  meta,
  title,
  description,
  href,
  image,
  alt,
  readLabel = "Read",
  className,
  cascade = false,
  titleClassName,
  imageClassName,
}) {
  return (
    <div className={cn("flex flex-col items-start h-full", className)}>
      <div
        data-cascade-picture={cascade ? "" : undefined}
        className={cn("relative aspect-[431/551] w-full overflow-hidden", imageClassName)}
      >
        <Image
          src={image}
          alt={alt ?? title}
          fill
          sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 254px"
          className="object-cover"
        />
      </div>

      <span className="font-top text-small max-sm:text-[12px] mt-5 max-sm:mt-3 leading-none font-light text-navy dark:text-cream">
        {cascade ? <CascadeText part="title">{meta}</CascadeText> : meta}
      </span>

      <p
        className={cn(
          "mt-4 max-sm:mt-2 max-sm:font-light max-sm:text-[13px] max-sm:leading-[110%] text-black/80 dark:text-cream/80 xl:max-w-[90%]",
          titleClassName
        )}
      >
        {cascade ? <CascadeText part="subtitle">{title}</CascadeText> : title}
      </p>

      {description && (
        <p className="mt-2 text-black/80 font-sans font-light text-[14px] xl:text-[16px] leading-[1.5]">
          {description}
        </p>
      )}

      <CtaLink
        href={href}
        underline={false}
        className="font-top text-small max-sm:text-[12px] hover:text-sky mt-auto inline-flex items-center gap-1.5 pt-4 leading-none font-medium text-navy dark:text-cream"
      >
        {readLabel}
        <ArrowUpRight aria-hidden="true" className="size-3.5 max-sm:size-3" />
      </CtaLink>
    </div>
  );
}
