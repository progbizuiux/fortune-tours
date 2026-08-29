import Image from "next/image";
import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

/* "What you need to send us" — the permit documents, set over a photograph.
 *
 * The frame splits the band in two: the heading block sits top-left with its
 * description opposite it on the right, and the numbered documents run along
 * the bottom. The picture fills the whole band behind both.
 *
 * SectionHeading is deliberately not used here. Its two alignments put the
 * description under a centred heading or right-aligned against a left one at a
 * shared baseline; this frame sets the description hard against the top-right
 * corner while the heading takes two lines below it, which is neither. The
 * type tokens are the same ones SectionHeading draws from, so the two stay
 * consistent without one bending to fit the other.
 *
 * Shape-only. All copy comes from the page; see lib/packages.js.
 */
export function DocumentsSection({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  items = [],
  className,
}) {
  if (!items.length) return null;

  return (
    <section
      aria-label={title}
      className={cn("relative z-10 overflow-hidden bg-navy", className)}
    >
      {image && (
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* The frame's wash: a flat teal-navy at most of its weight, so the white
          copy clears AA over the bright water in the middle of the photograph,
          with the picture still reading through it. */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#0C3547]/85" />

      <Container className="relative spacing">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <AnimateIn className="lg:max-w-[520px]">
            {eyebrow && (
              <h4 className="font-top text-[14px] lg:text-[16px] xl:text-[18px] text-white/70 font-normal">
                {eyebrow}
              </h4>
            )}
            <h2 className="mt-4 lg:mt-6 font-heading whitespace-pre-line text-[32px] md:text-[38px] lg:text-[42px] xl:text-[48px] leading-[1.1] tracking-[-0.02em] text-white">
              {title}
            </h2>
          </AnimateIn>

          {description && (
            <AnimateIn className="lg:max-w-[420px] lg:pt-2">
              <p className="font-sans font-light text-[13px] lg:text-[14px] xl:text-[15px] leading-[1.7] text-white/80 lg:text-right">
                {description}
              </p>
            </AnimateIn>
          )}
        </div>

        {/* The frame leaves the picture's middle band clear between the heading
            and the numbered items — that gap is the photograph, not padding. */}
        <ul className="mt-16 md:mt-24 lg:mt-[180px] xl:mt-[210px] grid gap-10 md:gap-12 lg:gap-16 md:grid-cols-2">
          {items.map((item, index) => {
            /* The pair reads as one spread across the frame rather than two
               stacked columns, so every second item mirrors the one beside it:
               rule and text pushed to the outer edge of its column. Keying it
               off the index rather than the count keeps a third and fourth
               document alternating the same way.

               Only from md, where the grid is two columns and there is an outer
               edge to hang from. In the single column below it a right-aligned
               block has nothing to mirror and reads as a mistake, so every item
               keeps the left treatment there. */
            const mirrored = index % 2 === 1;

            return (
              <AnimateIn
                as="li"
                key={item.number ?? item.title}
                className={cn(
                  "border-white/25",
                  mirrored
                    ? "border-l pl-6 md:border-l-0 md:border-r md:pl-0 md:pr-6 md:text-right lg:pr-8"
                    : "border-l pl-6 lg:pl-8"
                )}
              >
                <p className="font-heading text-[36px] lg:text-[44px] xl:text-[52px] leading-none text-white">
                  {item.number}
                </p>
                <h3 className="mt-5 lg:mt-7 font-sans text-[16px] lg:text-[17px] xl:text-[18px] font-normal leading-[1.3] text-white">
                  {item.title}
                </h3>
                {/* Capped measure. Each item owns half the Container, which is
                    ~600px on a laptop — a fine line length — but ~810px on a
                    1920 monitor, where the paragraph runs to well over a
                    hundred characters and the eye loses the line on the way
                    back. The cap is set at the laptop measure, so it does
                    nothing until the frame grows past it and only ever trims
                    the widest screens. `ml-auto` on the mirrored item keeps the
                    narrowed block against the column's outer edge instead of
                    letting it drift inward from the rule. */}
                <p
                  className={cn(
                    "mt-3 max-w-[600px] font-sans font-light text-[13px] lg:text-[14px] leading-[1.7] text-white/75",
                    mirrored && "md:ml-auto",
                  )}
                >
                  {item.description}
                </p>
              </AnimateIn>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
