import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import { Container } from "@/components/common/Container";

// Save the partner logos (transparent PNG or SVG) here, then flip the flag.
const PARTNERS = [
  { name: "Incredible India", src: "/credentials/incredible-india.png" },
  { name: "OTOAI", src: "/credentials/otoai.png" },
  { name: "IATA", src: "/credentials/iata.png" },
  { name: "TAFI", src: "/credentials/tafi.png" },
  { name: "Kerala Tourism", src: "/credentials/kerala.png" },
];

const REVIEWERS = [
  { key: "r1", src: "/credentials/reviewer-1.jpg" },
  { key: "r2", src: "/credentials/reviewer-2.jpg" },
  { key: "r3", src: "/credentials/reviewer-3.jpg" },
  { key: "r4", src: "/credentials/reviewer-4.jpg" },
];

// The design numbers the fourth column "III." as well — treated as a typo and
// continued as IV so the sequence reads correctly.
const REVIEWS = [
  {
    numeral: "I.",
    quote:
      "Planning to the final day was flawless. The itinerary was well designed, and every experience exceeded expectations.",
    name: "Sarah Johnson",
    rating: "4.6",
    src: "/credentials/review-1.jpg",
  },
  {
    numeral: "II.",
    quote:
      "Our vacation was stress-free. The team handled details, letting us enjoy the journey and create memories.",
    name: "Rahul Menon",
    rating: "4.6",
    src: "/credentials/review-2.jpg",
  },
  {
    numeral: "III.",
    quote:
      "Professional and knowledgeable. They suggested destinations we wouldn't have found. Highly recommended!",
    name: "Emily Carter",
    rating: "4.6",
    src: "/credentials/review-3.jpg",
  },
  {
    numeral: "IV.",
    quote:
      "Visa help, hotel tips, and local experiences were great. The trip felt seamless and well-organised.",
    name: "Ahmed Al Mansouri",
    rating: "4.6",
    src: "/credentials/review-4.jpg",
  },
];

const HAS_PARTNER_LOGOS = false;
const HAS_REVIEWER_PHOTOS = false;
const HAS_REVIEW_PHOTOS = false;

export function CredentialsSection() {
  return (
    // relative z-10 keeps it above the sticky hero, same as the other sections.
    <section className="bg-cream relative z-10">
      {/* Explicit padding rather than `spacing` (130/130): the design's block is
          proportionally shorter — roughly 88px above the eyebrow and 40px below
          the logo row at this width. */}
      <Container className="pt-16 pb-10 lg:pt-22">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-top text-h4 text-navy">
              Chapter 03 - Credentials
            </p>

            <h2 className="font-heading text-h3 text-navy mt-6 max-w-xl">
              Your journey, backed by excellence.
            </h2>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
            <div className="flex items-center">
              {REVIEWERS.map((reviewer, index) => (
                <div
                  key={reviewer.key}
                  className={`ring-cream bg-navy/15 relative size-12 overflow-hidden rounded-full ring-2 ${
                    index > 0 ? "-ml-3" : ""
                  }`}
                >
                  {HAS_REVIEWER_PHOTOS && (
                    <Image
                      src={reviewer.src}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </div>
              ))}

              <span className="bg-sky ring-cream text-small -ml-3 inline-flex size-16 items-center justify-center rounded-full font-semibold text-white ring-2">
                13k+
              </span>
            </div>

            <p className="text-caption text-navy/70">
              4.8 Rating from 13K+ Google Reviews
            </p>
          </div>
        </div>

        <ul className="mt-20 grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-12 sm:grid-cols-3 lg:mt-28 lg:grid-cols-5">
          {PARTNERS.map((partner) => (
            <li key={partner.name} className="flex justify-center">
              {HAS_PARTNER_LOGOS ? (
                <Image
                  src={partner.src}
                  alt={partner.name}
                  width={200}
                  height={80}
                  sizes="200px"
                  className="h-20 w-auto object-contain"
                />
              ) : (
                <span className="text-small text-navy/40 flex h-20 items-center text-center font-semibold">
                  {partner.name}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* The gap is a percentage so the column-to-gutter proportion holds at
            any width, matching the design's narrow cards and wide gutters. */}
        {/* Four across only from xl: at lg the 8% gutters squeezed each card to
            ~161px, too narrow for the name + rating overlay to read. */}
        <ul className="mt-20 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:mt-28 xl:grid-cols-4 xl:gap-x-[8%]">
          {REVIEWS.map((review) => (
            // The divider is a pseudo-element sitting in the gutter rather than
            // a border + padding: padding would shrink every column except the
            // first, leaving card 1 visibly wider than the other three.
            <li
              key={review.numeral}
              className="xl:before:bg-navy/15 relative flex flex-col xl:before:absolute xl:before:top-0 xl:before:-left-[4%] xl:before:h-full xl:before:w-px xl:before:content-[''] xl:first:before:hidden"
            >
              <p className="text-caption text-navy/70">{review.numeral}</p>

              <p className="text-small text-navy mt-8">{review.quote}</p>

              <div className="bg-navy/10 relative mt-10 aspect-5/6 w-full overflow-hidden">
                {HAS_REVIEW_PHOTOS && (
                  <Image
                    src={review.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                )}

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <span className="text-small truncate font-medium text-white">
                    {review.name}
                  </span>

                  <span className="flex shrink-0 items-center gap-2 text-white">
                    <FaGoogle className="size-4" aria-hidden="true" />
                    <span className="h-4 w-px bg-white/40" aria-hidden="true" />
                    <Star className="size-4 fill-white" aria-hidden="true" />
                    <span className="text-caption">{review.rating}</span>
                    <span className="sr-only">out of 5 on Google</span>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex items-center justify-center gap-6">
          <span className="bg-navy/20 h-6 w-px" aria-hidden="true" />
          <Link
            href="/reviews"
            className="text-body text-navy hover:text-sky transition-colors"
          >
            View more
          </Link>
          <span className="bg-navy/20 h-6 w-px" aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}
