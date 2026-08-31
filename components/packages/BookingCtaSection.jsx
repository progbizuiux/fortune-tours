import Image from "next/image";

import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { CtaLink } from "@/components/common/CtaLink";
import { BookingCtaButton } from "@/components/packages/BookingCtaButton";
import { HERO_BODY, HERO_CTA } from "@/lib/typography";
import { cn } from "@/lib/utils";

/* The closing "hold your seat" band — a full-bleed photo strip with the booking
 * ask centred over it, sitting between the cancellation table and the FAQ.
 *
 * Deliberately not PageHero with a shorter height. That component is the
 * opening frame: it pins itself with `sticky top-0 min-h-screen` and runs an
 * entrance timeline on `.hero-*` classes, both of which are wrong halfway down
 * a page — a second pinned min-h-screen block would take the whole viewport
 * back and re-trigger a hero entrance under the reader. What is shared is the
 * scrim recipe and the type stack, and those come from the same places the hero
 * takes them from (HERO_BODY, the black/35 + gradient trio), so the two bands
 * stay in step without one owning the other.
 *
 * A short band rather than a tall one — 1081x392 off the frame, ~2.76:1. The
 * height is stepped minimums rather than a locked ratio; see the note on the
 * section element for why.
 *
 * Shape-only, like every other section on this route — all copy comes from
 * lib/packages.js.
 */
export function BookingCtaSection({
  eyebrow,
  title,
  description,
  ctas = [],
  image,
  imageAlt = "",
  /* The enquiry dialog's own copy and picture. All optional: unset, the dialog
     falls back to its own heading and to this band's photograph, so a package
     that says nothing about the form still opens a complete one. */
  formTitle,
  formDescription,
  formImage,
  formImageAlt,
  packageName,
  className,
}) {
  if (!title) return null;

  return (
    <section
      aria-label={title?.replace(/\n/g, " ")}
      /* z-10 for the same reason the sections above carry it: the hero one
         screenful up is z-0 and pinned, so anything that scrolls over it has to
         paint on top rather than slide underneath. */
      className={cn(
        "relative z-10 flex w-full items-center justify-center overflow-hidden",
        /* Height comes from a minimum, not a fixed ratio. The frame draws a
           short 1081x392 strip, but a locked ratio makes the box height a
           function of width alone: between 768 and ~880 the band was 320px tall
           holding 368px of copy and padding, and `overflow-hidden` — there for
           the photo — quietly cropped the buttons off the bottom. A floor keeps
           the strip proportions where there is room and lets the band grow
           instead of clipping where there is not. No floor at all on a phone,
           where the copy and its padding already set a sensible height. */
        "md:min-h-[320px] xl:min-h-[420px] 2xl:min-h-[490px]",
        className,
      )}
    >
      {image && (
        <Image
          className="object-cover object-center"
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
        />
      )}

      {/* The hero's three-layer scrim, unchanged — same photography, same
          white/90 copy, so the same contrast floor applies. */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      <Container className="relative py-12 sm:py-14 md:py-16">
        <AnimateIn
          stagger={0.12}
          className="mx-auto flex max-w-[720px] flex-col items-center gap-4 text-center max-md:gap-3"
        >
          {eyebrow && (
            <span className="font-top text-h4 text-white/90 max-md:text-[13px]">
              {eyebrow}
            </span>
          )}

          {/* An h2, not an h1: the page already has one in the hero. Sized a
              step under the hero's ramp — this is a band inside the page, not
              its opening. whitespace-pre-line honours the frame's two lines and
              still wraps on overflow. */}
          <h2 className="font-heading text-h2 whitespace-pre-line text-white max-md:text-[30px] max-md:leading-[1.1] lg:max-2xl:text-[44px] lg:max-2xl:leading-[1.1]">
            {title}
          </h2>

          {description && (
            <p
              className={`${HERO_BODY} max-w-[560px] text-white/90 max-md:text-white/80`}
            >
              {description}
            </p>
          )}

          {ctas.length > 0 && (
            /* Stacked below sm, side by side above it. The two labels are
               "Book Your Seat" and "Call 9656 211 888"; kept on one row at
               375px they are squeezed until each wraps to two lines and the
               frames stop reading as buttons. Stacked, each label gets its own
               line and the frames stay tight around it — no shared width, so
               the side rules sit against the text the way the frame draws
               them rather than stranded out at a common edge. */
            <div className="mt-4 flex flex-col items-center justify-center gap-3 max-md:mt-2 sm:flex-row sm:flex-nowrap sm:gap-x-6 sm:gap-y-3">
              {ctas.map((link, index) =>
                /* A CTA marked `opensForm` in lib/packages.js opens the
                   enquiry dialog instead of navigating — "Book Your Seat"
                   asks for five details, which is a form, not a page. It
                   renders through a client leaf so this section stays a
                   server component; everything else in the row is a plain
                   link (the second is a tel:). */
                link.opensForm ? (
                  <BookingCtaButton
                    key={link.label}
                    href={link.href}
                    label={link.label}
                    withLeftDivider={index > 0}
                    dividerClassName="h-6 w-px bg-white/40 max-sm:hidden"
                    className={`${HERO_CTA} border-white/40 text-white inline-flex items-center justify-center whitespace-nowrap`}
                    modalTitle={formTitle}
                    modalDescription={formDescription}
                    image={formImage ?? image}
                    imageAlt={formImageAlt ?? imageAlt}
                    packageName={packageName}
                  />
                ) : (
                  <CtaLink
                    key={link.label}
                    href={link.href}
                    /* The shared control, exactly as the hero one screenful up
                     draws it: CtaLink with `fill`, so the sky panel wipes in
                     from the left rule on hover (FILL_SWEEP) instead of this
                     band inventing its own hover. HERO_CTA brings the border
                     and the 13px phone size with it, but no colour — CtaLink
                     carries none either, so without text-white the labels
                     inherit the page body's black and all but disappear
                     against the photo. */
                    fill
                    withLeftDivider={index > 0}
                    /* The rule separates two items on a row; stacked, it would
                     sit above the second one as a stray bar. */
                    dividerClassName="h-6 w-px bg-white/40 max-sm:hidden"
                    className={`${HERO_CTA} border-white/40 text-white inline-flex items-center justify-center whitespace-nowrap`}
                  >
                    {link.label}
                  </CtaLink>
                ),
              )}
            </div>
          )}
        </AnimateIn>
      </Container>
    </section>
  );
}
