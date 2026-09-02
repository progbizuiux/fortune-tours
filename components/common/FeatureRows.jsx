import Image from "next/image";
import { StickyStack } from "@/components/common/StickyStack";
import { TextBlock } from "@/components/common/TextBlock";
import { cn } from "@/lib/utils";

/* Alternating full-bleed picture rows, each with the eyebrow → heading → body →
 * arrow-CTA quad beside it. Row 1 has its picture on the left, row 2 mirrors,
 * and so on down the list.
 *
 * The copy is TextBlock, unchanged: its defaults are already this design's
 * redlines to the pixel — Spartan 400 16/11.7 #000 eyebrow, Neiko 400 45/41.4
 * at -0.7px tracking in #0C2233, Poppins 300 18/28.9 at #000 80%, and the
 * Poppins 400 14/11 uppercase CTA at 1px tracking. Only the two gaps this frame
 * measures differently (heading → body 25, body → CTA 49) and the narrower
 * 492px body measure are passed in below.
 *
 * Figma → "Experience - Honeymoon", 1920 frame:
 *   picture   1027 x 585, flush to the frame edge on its own side
 *             (1027/1920 = 53.4896% wide, so it holds that edge at any width)
 *   gutter    60.3 between the picture and the copy
 *   copy      668.7 measure, body wrapping at 492, vertically centred on the
 *             picture (the quad is 285 tall in a 585 picture, and the design
 *             sets it 150 down — dead centre)
 *   rows      130 apart
 *
 * No section heading: this frame runs straight into the first row.
 *
 * `stacked` gives the rows the reference's scroll effect: each one parks in
 * the middle of the screen and the next slides up over it. It is lib/
 * useStickyStack.js, which pins the rows themselves rather than wrapping them
 * in panels — so the section keeps every gap, padding and margin below exactly
 * as it has them flowing, at every width, and the rows need nothing from this
 * file but a background to hide the row they cover.
 *
 * `items`: { key, eyebrow, title, description, ctaLabel, ctaHref, image, alt }.
 * The split is at xl for the same reason as the hero — below it the copy column
 * is too narrow for a 45px heading, so the rows stack.
 */
export function FeatureRows({ items, className, ariaLabel, stacked = false }) {
  return (
    <StickyStack
      as="section"
      enabled={stacked}
      /* The fixed site header, and xl — the width the design stops stacking a
         row under its picture and lays it out in two columns instead. Narrower
         than that a row is barely half the screen tall, so centring it parked
         it a long way down with an empty band under the header; below xl it
         parks one row-gap under the header instead. From xl the rows centre,
         which is the spacing already signed off there. */
      headroom="header"
      capBelow={1280}
      ariaLabel={ariaLabel}
      /* Row rhythm: 64px between blocks on a phone (Kerala's HighlightsSection),
         and the frame's own 130 from xl.

         72 through the md-to-xl band rather than Kerala's 96. The rows are
         stacked there, so each one is a full-width picture with its copy beneath
         and the blocks are already tall — 96 on top of that left the section
         reading as three separate pages rather than one set of rows.

         The section keeps the shared `spacing` rhythm below xl — 60 on a phone,
         90 from md — and only drops it from xl, where the desktop frame runs its
         rows flush into the sections either side. It used to be zeroed at every
         width, so on a phone the first picture butted straight against whatever
         came before it.

         The zeroing needs `!` because `.spacing` is an unlayered rule in
         design-system.css and outranks plain padding utilities — the same reason
         Kerala's packages section writes pt-0!. And it has to be expressed as
         "spacing everywhere, off at xl" rather than a responsive `spacing`,
         since that class is not a Tailwind utility and takes no variant. */
      className={cn(
        "spacing flex flex-col gap-16 md:gap-18 xl:gap-[130px] xl:pt-0! xl:pb-0!",
        className,
      )}
    >
      {items.map((item, index) => {
        // Odd rows mirror: picture to the right, copy to the left.
        const pictureRight = index % 2 === 1;

        return (
          <div
            key={item.key}
            className={cn(
              "flex flex-col xl:flex-row xl:items-center",
              pictureRight && "xl:flex-row-reverse",
              /* The only thing the scroll effect asks of the row: something
                 to hide the row it slides over, instead of the two showing
                 through each other. These rows sit on the page's white ground,
                 so it is bg-background. Everything else about the effect — that
                 the row pins, and where it parks — is lib/useStickyStack.js,
                 which sets it on the element and leaves the box and the flow
                 alone. So there is nothing here to gate by width: the row is
                 laid out at every size exactly as it always was, and the stack
                 rides along on top of whichever layout that is. */
              stacked && "bg-background",
              /* And the row carries its top margin with it as it slides.

                 The row's box starts where its content starts, so on the way up
                 its leading edge landed straight in the middle of the row it was
                 covering — an image edge cutting a line of copy in half. The
                 rows are meant to be 130px apart; that gap should still be there
                 while one is passing over the other, not just when they are both
                 at rest.

                 A shadow, because it has to be paint and not layout: the gap
                 between the rows is the section's already, and padding or a
                 margin here would add a second one and move everything. No blur,
                 no spread, offset up by exactly the gap at that width — an
                 opaque band the height of the gap, sitting on the row's leading
                 edge and travelling with it, and painting over the row below for
                 the same reason the row itself does (later in source order).

                 Not on the first row. Its band has nothing to cover and would
                 reach up out of the section onto the section above it. */
              stacked &&
                index > 0 &&
                "shadow-[0_-64px_0_var(--background)] md:shadow-[0_-72px_0_var(--background)] xl:shadow-[0_-130px_0_var(--background)]",
            )}
          >
            {/* shrink-0 is load-bearing: the copy beside it is a flex-1 box, and
                without it a long unbroken heading would squeeze the picture off
                its own percentage and away from the frame edge.

                Stacked, the picture is treated the way Kerala's HighlightsSection
                treats its own: it runs off one screen edge and takes a 20px
                inset on the other, mirroring from row to row, so the column of
                pictures alternates down the page instead of sitting as three
                identical full-width bands. The side each row bleeds to is the
                side its picture already sits on from xl up, so the stacked order
                reads as the same alternation as the desktop frame.

                20px is Kerala's inset (its 16px Container gutter plus 4), and
                here it is the whole margin because these rows are full-bleed by
                construction rather than breaking out of a Container. */}
            <div
              className={cn(
                "relative aspect-[1027/585] w-[calc(100%_-_20px)] shrink-0",
                "md:aspect-[1027/540] md:w-[75%] md:mx-auto",
                "lg:aspect-[1027/480] lg:w-[65%]",
                "xl:mx-0 xl:aspect-[1027/585] xl:w-[53.4896%]",
                pictureRight ? "max-md:ml-5" : "max-md:mr-5",
              )}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1280px) 54vw, (min-width: 768px) 85vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* The padding lives on this wrapper rather than on TextBlock so the
                668.7px measure stays a content width — max-width resolves
                against the border box, so padding on the same element would eat
                into the measure instead of sitting outside it. */}
            <div
              className={cn(
                // Picture → copy gap is Kerala's stacked pair: 45px, 48 from md.
                "mt-[45px] flex w-full min-w-0 flex-1 px-4 md:mt-12 md:px-8 xl:mt-0",
                pictureRight
                  ? "xl:pr-[60.3px] xl:pl-20"
                  : "xl:pr-20 xl:pl-[60.3px]",
              )}
            >
              <TextBlock
                className="w-full xl:max-w-[668.7px]"
                eyebrow={item.eyebrow}
                title={item.title}
                description={item.description}
                /* The 492 measure is the desktop frame's, where the copy sits in
                   a column beside the picture. Stacked from md the copy has the
                   full width to itself, so the cap only left a short ragged
                   column against a full-bleed picture — released through the
                   md-to-xl band and restored with the two-column layout at xl.
                   Below md the container is narrower than 492 anyway, so the cap
                   never bound there. */
                descriptionClassName="md:mt-[25px] max-w-[620px] md:max-w-none xl:max-w-[620px]"
                ctaLabel={item.ctaLabel}
                ctaHref={item.ctaHref}
                ctaClassName="md:mt-[49px]"
              />
            </div>
          </div>
        );
      })}
    </StickyStack>
  );
}
