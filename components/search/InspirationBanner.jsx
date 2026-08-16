import Image from "next/image";
import { Triangle } from "lucide-react";
import { AnimateIn } from "@/components/common/AnimateIn";
import { CtaLink } from "@/components/common/CtaLink";

/* Editorial band at the top of /search — cream copy panel on the left, a
   photograph bleeding off the right edge.

   Every word and the image are passed in (see lib/inspirations.js): the band
   re-themes itself around the active experience filter, so nothing here may be
   hardcoded.

   Full-bleed by construction, so it cannot use Container — the picture has to
   reach the viewport edge. The copy column repeats Container's padding by hand
   (1rem / 2rem / 80px) so the eyebrow still lines up with the heading of the
   results section below it. */
export function InspirationBanner({ inspiration, ctaHref }) {
  return (
    <section className="bg-cream pt-20" aria-label="Inspiration">
      {/* The design's own numbers: a 1233px picture beside a 687px copy column
          on a 1920 frame. Expressed as those figures rather than 36/64 so the
          split is traceable back to the file. At lg it widens to 44/56 — 36% of
          a 1024 screen leaves the copy 235px once the padding is off, which
          wraps the body to a column of two or three words. Single column below
          lg. lg:pt-12 is the band of cream between the navbar and the photo.

          The 563px floor on the copy track stops the column going BACKWARDS at
          the breakpoint: 44% of 1279 is 563px but the design's 35.78% of 1280
          is only 458, so crossing into xl cost the copy 105px for one pixel of
          viewport and reflowed the heading onto an extra line all the way to
          1573. Floored, the column only ever grows, and the design ratio takes
          over on its own once 35.78% overtakes the floor. */}
      <div className="grid lg:grid-cols-2 lg:pt-12 2xl:grid-cols-[minmax(563px,687fr)_1233fr]">
        {/* The small lg:pt-3 is deliberate: it sets the eyebrow a dozen pixels
            below the top edge of the photograph, which is where the design
            lines the two up. The panel's height comes from the picture. */}
        <div className="flex flex-col px-4 pt-10 pb-14 md:px-8 lg:pt-3 lg:pr-12 lg:pb-6 lg:pl-20 xl:pb-20">
          <span className="font-top text-h4 text-navy/70">
            Inspirations — {inspiration.theme}
          </span>

          {/* 250px from the eyebrow to the title, per the spec — but as a
              proportion of the design's own 1920 frame (250/1920 = 13.02vw)
              rather than a flat 250px, so it lands on exactly 250 at the design
              width and eases below it.
              Held flat it was the tallest single item in the column, and since
              the column sets the row height once it outgrows the picture, it
              dragged the whole band to 837px at 1280 — the photograph stretched
              to 709px when its own rule asked for 497. Scaled back further
              while stacked, where 250px of empty cream is most of a phone. */}
          <AnimateIn
            className="mt-16 flex flex-col items-start lg:mt-[clamp(3rem,20.76vw_-_148.6px,250px)]"
            stagger={0.12}
          >
            {/* Spec: Neiko 400, 85px, line-height 94.5px (111.176%). The ratio
                is used rather than the flat 94.5px so leading tracks the size
                below the design width.
                85px is right on the 1920 frame but far too big once the copy is
                in a column rather than the full width — at 1024 it put this
                four-word title on FOUR lines. So the tag default stands while
                the band is stacked, and from lg a clamp tracks the column: 42px
                at 1024, 62px at 1440, and exactly the spec's 85px from 1920 up,
                holding "Travel at Your" on one line throughout. */}
            <h1 className="text-navy leading-[1.1118] lg:text-h2 xl:text-[clamp(2.5rem,4.8vw_-_7.16px,5.3125rem)]">
              {inspiration.title}
            </h1>

            {/* The shared body token, not a fixed 18px: the token is the same
                Poppins 300 and reaches the spec's 18px at the design width,
                but scales down to 16px on small screens instead of holding
                phone copy at desktop size.
                Only the leading is overridden. The spec is 150% (27px at
                18px); the token hardcodes 1.5rem, which is 150% at the 16px
                floor but stays 24px once the size ramps up. Expressing it as a
                ratio hits the spec at every width. */}
            <p className="text-body mt-8 max-w-[470px] leading-[1.5] text-black/80 max-lg:mt-6">
              {inspiration.body}
            </p>

            {/* py-3/min-h-11 give the band's only call to action a 44px touch
                target — as a bare 13px line it was a 19.5px strip on the first
                screen of the page. The top margin comes back by the same amount
                so the copy block keeps its spacing. */}
            <CtaLink
              href={ctaHref}
              className="font-top text-navy hover:text-sky mt-7 inline-flex min-h-11 items-center gap-2.5 py-3 text-[13px] font-medium tracking-[0.12em] whitespace-nowrap uppercase max-lg:mt-5"
            >
              {inspiration.cta}
              {/* lucide ships no filled caret, so the outline triangle is
                  flipped and filled to match the solid marker in the design.
                  shrink-0 with the whitespace-nowrap above keeps the caret on
                  the label's line: the two are flex items, and without it a
                  squeezed label wraps and leaves the caret stranded beside a
                  two-line block. The margin is thin — the longest label is
                  247px against the 316px the column gives at lg. */}
              <Triangle
                aria-hidden="true"
                strokeWidth={0}
                className="size-2.5 shrink-0 rotate-180 fill-current"
              />
            </CtaLink>
          </AnimateIn>
        </div>

        {/* Stacked, the shape has to change with the width or the picture stops
            being a picture — 5:2 reads well across a tablet but is a 150px
            letterbox strip on a 375px phone. Two fixed ratios did that, but
            they snapped: crossing 639 to 640px the photo lost 104px of height
            in a single pixel of resize. A height that interpolates instead
            gives the same shapes at the ends — ~16:9 at 375, ~5:2 at 768 — and
            no step between them.
            From lg this height leads the band, and the numbers are chosen so it
            actually does. The picture and the copy share a grid row, so the
            taller of the two wins: a rule the copy can outgrow is fiction, and
            that is what the previous one was — it asked for 420px at 1024 and
            rendered 556 because the text was taller.
            The floor is the copy's height at 1024 and the slope keeps the
            picture at or above it from there, so the height tracks the viewport
            rather than the length of the paragraph. It reaches the design's
            746px at 1700 and holds, which is the spec value at the 1920 frame
            the design was drawn on.
            NOTE: 746px is the design file's height, so it undoes the two rounds
            of shrinking that came before the spec arrived. */}
        <div className="relative h-[clamp(180px,24.4vw_+_119.4px,400px)] w-full lg:h-auto lg:min-h-[clamp(460px,43.9vw,746px)]">
          <Image
            src={inspiration.image}
            alt={inspiration.imageAlt}
            fill
            sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
