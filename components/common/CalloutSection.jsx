import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { FrameButton } from "@/components/common/FrameButton";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

/* Centred invitation block on cream: heading, a short lead under it, a couple of
 * paragraphs of body copy, and one call to action.
 *
 * Figma → "Experience - Honeymoon", 1920x701, fill #FAF7F2 -> bg-cream.
 *
 * Built from the two existing primitives rather than fresh markup. The centred
 * SectionHeading already stacks a heading over a description with the design's
 * own gaps, which is exactly the heading + lead pair here — the lead only needs
 * a weight and colour override, since the shared default is the lighter
 * black/80 used for section descriptions. The CTA is FrameButton's `rail`
 * variant, the same bordered control Kerala's "View all Kerala packages" uses.
 *
 * NOTE: `rail` renders a <button> with no destination — matching the Kerala call
 * site. Give it an onClick or swap it for a CtaLink when the target exists.
 *
 * `paragraphs`: array of strings, so a slug can run one paragraph or three.
 */
export function CalloutSection({
  title,
  lead,
  paragraphs = [],
  ctaLabel,
  ctaHref = "/contact",
  ariaLabel,
  className,
}) {
  return (
    <section
      aria-label={ariaLabel}
      /* Cream is the desktop frame's fill; stacked, the design puts this block on
         white so it reads as a break after the cream band that closes the slide
         above it. */
      className={cn("spacing bg-cream max-xl:bg-white", className)}
    >
      <Container>
        <SectionHeading
          align="center"
          title={title}
          /* The design draws this heading at ~46px, not the h2 token's 65px at
             1920 — measured off the Figma frame, where the line is ~559px wide
             against the 790 a 65px setting would need. The mobile 30px treatment
             is left alone. */
          titleClassName="lg:text-[46px] lg:leading-[1.1]"
          description={lead}
          /* The lead reads as a standfirst rather than a section description:
             full black and a step heavier, and released from the shared max-w-xl
             so the one line does not wrap. */
          descriptionClassName="max-w-none max-lg:max-w-none font-heading font-normal text-[20px] leading-[28.9px] text-black max-lg:font-medium"
        />

        {/* 1048px measure, centred — wider than the heading block's max-w-xl, which
            is sized for a one-line description rather than body copy. */}
        <AnimateIn
          stagger={0.12}
          className="mx-auto mt-10 flex max-w-[1048px] 2xl:max-w-[1240px] flex-col gap-7 text-center md:mt-12"
        >
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-body leading-[1.6] font-light text-black/80 max-lg:text-[13px] max-lg:leading-[1.5]"
            >
              {paragraph}
            </p>
          ))}
        </AnimateIn>

        {ctaLabel && (
          <div className="mt-12 flex justify-center md:mt-16">
            <FrameButton
              variant="rail"
              href={ctaHref || "/contact"}
              className="max-md:text-[13px]"
            >
              {ctaLabel}
            </FrameButton>
          </div>
        )}
      </Container>
    </section>
  );
}
