"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import { Container } from "@/components/common/Container";
import { CtaLink } from "@/components/common/CtaLink";
import { PartnerLogos } from "@/components/common/PartnerLogos";
import { AnimatedAvatars } from "@/components/common/AnimatedAvatars";
import { CascadeText } from "@/components/common/CascadeText";
import { useCardCascade } from "@/lib/gsap/useCardCascade";
import { useReveal } from "@/lib/gsap/useReveal";
import { HERO_CTA } from "@/lib/typography";

// The design numbers the fourth column "III." as well — treated as a typo and
// continued as IV so the sequence reads correctly.
const REVIEWS = [
  {
    numeral: "I.",
    quote:
      "Planning to the final day was flawless. The itinerary was well designed, and every experience exceeded expectations.",
    name: "Sarah Johnson",
    rating: "4.6",
    src: "/credentials/image 191.png",
  },
  {
    numeral: "II.",
    quote:
      "Our vacation was stress-free. The team handled details, letting us enjoy the journey and create memories.",
    name: "Rahul Menon",
    rating: "4.6",
    src: "/credentials/image 192.png",
  },
  {
    numeral: "III.",
    quote:
      "Professional and knowledgeable. They suggested destinations we wouldn't have found. Highly recommended!",
    name: "Emily Carter",
    rating: "4.6",
    src: "/credentials/image 193.png",
  },
  {
    numeral: "IV.",
    quote:
      "Visa help, hotel tips, and local experiences were great. The trip felt seamless and well-organised.",
    name: "Ahmed Al Mansouri",
    rating: "4.6",
    src: "/credentials/image 194.png",
  },
];

const HAS_REVIEWER_PHOTOS = true;
const HAS_REVIEW_PHOTOS = true;

// Collapsed height of a review quote. Shared by the clamp style below and the
// overflow check above, so the two can never disagree about where the cut is.
const CLAMP_EM = 3.6;

function ReviewCard({ review, index, isExpanded, onToggle }) {
  const textRef = useRef(null);
  const [needsReadMore, setNeedsReadMore] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const el = textRef.current;
      if (!el) return;
      // Measured against the clamp height in px, not against clientHeight.
      // clientHeight is the *animating* height: collapsing sets max-height
      // back to the clamp but the transition takes 500ms to get there, so a
      // check on that frame still sees ~500px, concludes the text fits, and
      // unmounts the button the moment "Read less" is pressed. scrollHeight is
      // the full content height in either state, so this reads the same
      // expanded or collapsed.
      const clampPx = parseFloat(getComputedStyle(el).fontSize) * CLAMP_EM;
      // 2px threshold absorbs fractional-pixel rounding.
      setNeedsReadMore(el.scrollHeight > clampPx + 2);
    };

    checkOverflow();

    // Re-check after fonts have loaded, as they can change text dimensions
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(checkOverflow);
    }

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [review.quote, isExpanded]);

  return (
    <li
      data-cascade-card
      className={`group cursor-pointer before:bg-navy/15 relative flex flex-col before:absolute before:top-0 max-sm:before:-left-2 sm:max-xl:before:-left-5 xl:before:-left-[4%] before:h-full before:w-px before:content-[''] xl:first:before:hidden ${index >= 2 ? "max-xl:hidden" : ""}`}
    >
      <p className="text-caption text-navy/70 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:text-sky group-hover:translate-x-2">
        <CascadeText part="title">{review.numeral}</CascadeText>
      </p>

      <div className="flex-1 flex flex-col items-start mt-8">
        <p 
          ref={textRef}
          className={`overflow-hidden transition-[max-height] duration-500 ease-in-out max-sm:font-light max-sm:text-[12px] max-sm:leading-120 max-sm:tracking-[-0.3px] text-small lg:font-sans lg:font-light lg:max-xl:text-[15.5px] xl:max-2xl:text-[18px] 2xl:text-[18px] lg:leading-120 lg:tracking-[-1.4px] text-navy lg:text-charcoal group-hover:text-black`}
          style={{ maxHeight: isExpanded ? "500px" : `${CLAMP_EM}em` }}
        >
          {review.quote}
        </p>
        {needsReadMore && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="mt-3 max-sm:text-[11px] text-[13px] font-medium text-sky hover:text-navy transition-colors"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>

      <div
        data-cascade-picture
        className="bg-navy/10 relative mt-10 shrink-0 aspect-5/6 max-sm:aspect-[179/216] lg:aspect-[319/386] w-full md:max-lg:max-w-[280px] lg:max-xl:max-w-[320px] overflow-hidden"
      >
        {HAS_REVIEW_PHOTOS && (
          <Image
            src={review.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.08]"
          />
        )}

        <div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        <div className="absolute inset-0 border border-white/40 pointer-events-none" aria-hidden="true" />

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-2">
          <span className="max-md:font-sans max-md:text-[11px] max-md:font-normal max-md:leading-[120%] max-md:tracking-[-0.84px] md:text-small lg:max-xl:text-[11px] xl:max-2xl:text-[14.5px] 2xl:text-small md:font-medium truncate text-white/90 transition-colors duration-700 group-hover:text-white">
            {review.name}
          </span>

          <span className="flex shrink-0 items-center gap-2 text-white/90 transition-colors duration-700 group-hover:text-white">
            <FaGoogle className="max-md:h-[14.43px] max-md:w-[14.43px] md:size-4" aria-hidden="true" />
            <span className="h-4 w-px bg-white/40" aria-hidden="true" />
            <Star className="max-md:h-[10.82px] max-md:w-[10.22px] md:size-4 fill-white" aria-hidden="true" />
            <span className="max-md:font-sans max-md:text-[10.82px] max-md:font-light max-md:leading-[120%] max-md:tracking-[-0.84px] md:text-caption lg:max-xl:text-[10px] xl:max-2xl:text-[12px] 2xl:text-caption">{review.rating}</span>
            <span className="sr-only">out of 5 on Google</span>
          </span>
        </div>
      </div>
    </li>
  );
}

/* Draws on two CMS blocks: `sections.brand` supplies the heading, and
   `sections.reviews` the cards. The reviews list is still empty in Strapi, so
   REVIEWS above stands in — see lib/strapi/home.js. */
export function CredentialsSection({
  eyebrow = "Chapter 03 - Credentials",
  title = "Your journey, backed by excellence.",
  reviews = REVIEWS,
}) {
  const [expandedId, setExpandedId] = useState(null);
  /* The grid, not the section: this section carries a heading, the avatar row
     and the partner logos above its cards, so triggering off the section's own
     top would spend the whole cascade before a card was anywhere near the
     screen. The card list is both what the trigger measures and what the hook
     searches. */
  const cardsRef = useCardCascade();
  const headerRef = useReveal({ stagger: 0.12 });

  return (
    // relative z-10 keeps it above the sticky hero, same as the other sections.
    <section className="bg-cream relative z-10">
      {/* Explicit padding rather than `spacing` (130/130): the design's block is
          proportionally shorter — roughly 88px above the eyebrow and 40px below
          the logo row at this width. */}
      <Container className="pt-16 pb-10 lg:pt-22 lg:pb-[90px] min-[1900px]:pb-[40px]">
        <div ref={headerRef} className="flex flex-row sm:flex-col lg:flex-row items-end sm:items-start justify-between gap-2 sm:gap-4 lg:items-start lg:gap-10">
          <div>
            <p className="font-top max-sm:text-[12px] max-sm:leading-none text-h4 lg:max-xl:text-[13.5px] xl:max-2xl:text-[16.5px] 2xl:text-[20px] lg:leading-none text-navy">
              {eyebrow}
            </p>

            <h2 className="font-heading max-sm:text-[30px] max-sm:leading-none max-sm:tracking-[-0.01em] text-h3 lg:max-xl:text-[34px] xl:max-2xl:text-[42px] 2xl:text-[65px] lg:leading-none lg:tracking-[-0.01em] text-navy max-lg:mt-[20px] lg:mt-6 2xl:mt-[40px] max-w-[240px] sm:max-w-md lg:max-w-3xl">
              {title}
            </h2>
          </div>

          <div className="flex shrink-0 flex-col items-center max-lg:mt-auto gap-2 max-lg:mb-1 lg:items-end lg:gap-3 lg:mt-0 lg:self-center 2xl:mt-[60px] 2xl:self-start min-[1900px]:gap-[20px]">
            <AnimatedAvatars />

            <p className="max-sm:font-light max-sm:text-[9px] max-sm:leading-[12px] sm:text-[10px] sm:leading-[14px] text-center lg:text-right text-caption lg:font-light lg:max-xl:text-[15px] xl:max-2xl:text-[18px] 2xl:text-[18px] lg:leading-6 text-navy/70 lg:text-black/80 max-sm:w-[160px] sm:w-full lg:w-auto lg:max-w-none">
              4.8 Rating from 13K+<br className="lg:hidden" /> Google Reviews
            </p>
          </div>
        </div>

        <PartnerLogos className="mt-20 lg:mt-20 2xl:mt-28" />

        {/* The gap is a percentage so the column-to-gutter proportion holds at
            any width, matching the design's narrow cards and wide gutters. */}
        {/* Four across only from xl: at lg the 8% gutters squeezed each card to
            ~161px, too narrow for the name + rating overlay to read. */}
        <ul
          ref={cardsRef}
          className="mt-20 grid grid-cols-2 max-sm:gap-x-4 gap-x-10 max-sm:gap-y-8 gap-y-14 sm:grid-cols-2 lg:mt-20 2xl:mt-28 xl:grid-cols-4 xl:gap-x-[8%]"
        >
          {reviews.map((review, i) => (
            <ReviewCard 
              key={review.numeral} 
              review={review} 
              index={i} 
              isExpanded={expandedId === review.numeral}
              onToggle={() => setExpandedId(expandedId === review.numeral ? null : review.numeral)}
            />
          ))}
        </ul>

        <div className="max-md:mt-[26.82px] md:mt-16 flex items-center justify-center gap-6">
          <CtaLink href="#" fill className={`${HERO_CTA} border-navy/20 text-navy`}>
            View more
          </CtaLink>
        </div>
      </Container>
    </section>
  );
}
