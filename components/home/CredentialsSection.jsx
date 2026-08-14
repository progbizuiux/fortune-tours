import Image from "next/image";
import { Star } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import { Container } from "@/components/common/Container";
import { FrameButton } from "@/components/common/FrameButton";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { AnimatedAvatars } from "@/components/home/AnimatedAvatars";

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
            <p className="font-top max-sm:text-[12px] max-sm:leading-none text-h4 lg:text-[20px] lg:leading-none text-navy">
              Chapter 03 - Credentials
            </p>

            <h2 className="font-heading max-sm:text-[30px] max-sm:leading-none max-sm:tracking-[-0.01em] text-h3 lg:text-[65px] lg:leading-none lg:tracking-[-0.01em] text-navy mt-6 max-w-xl lg:max-w-3xl">
              Your journey, backed by excellence.
            </h2>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
            <AnimatedAvatars />

            <p className="max-sm:font-light max-sm:text-[11px] max-sm:leading-[14px] text-caption lg:font-light lg:text-[18px] lg:leading-6 text-navy/70 lg:text-black/80">
              4.8 Rating from 13K+ Google Reviews
            </p>
          </div>
        </div>

        <PartnerLogos className="mt-20 lg:mt-28" />

        {/* The gap is a percentage so the column-to-gutter proportion holds at
            any width, matching the design's narrow cards and wide gutters. */}
        {/* Four across only from xl: at lg the 8% gutters squeezed each card to
            ~161px, too narrow for the name + rating overlay to read. */}
        <ul className="mt-20 grid grid-cols-2 max-sm:gap-x-4 gap-x-10 max-sm:gap-y-8 gap-y-14 sm:grid-cols-2 lg:mt-28 xl:grid-cols-4 xl:gap-x-[8%]">
          {REVIEWS.map((review, i) => (
            // The divider is a pseudo-element sitting in the gutter rather than
            // a border + padding: padding would shrink every column except the
            // first, leaving card 1 visibly wider than the other three.
            <li
              key={review.numeral}
              className={`group cursor-pointer before:bg-navy/15 relative flex flex-col before:absolute before:top-0 max-sm:before:-left-2 sm:max-xl:before:-left-5 xl:before:-left-[4%] before:h-full before:w-px before:content-[''] xl:first:before:hidden ${i >= 2 ? "max-xl:hidden" : ""}`}
            >
              <p className="text-caption text-navy/70 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:text-sky group-hover:translate-x-2">
                {review.numeral}
              </p>

              <p className="max-sm:font-light max-sm:text-[12px] max-sm:leading-[1.2] max-sm:tracking-[-0.3px] text-small lg:font-light lg:text-[18px] lg:leading-[1.2] lg:tracking-[-1.4px] text-navy lg:text-[#333333] mt-8 transition-colors duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:text-black">
                {review.quote}
              </p>

              <div className="bg-navy/10 relative mt-10 grow aspect-5/6 max-sm:aspect-[179/216] lg:aspect-[319/386] w-full overflow-hidden">
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

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-2">
                  <span className="text-small truncate font-medium text-white/90 transition-colors duration-700 group-hover:text-white">
                    {review.name}
                  </span>

                  <span className="flex shrink-0 items-center gap-2 text-white/90 transition-colors duration-700 group-hover:text-white">
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
          <FrameButton variant="rail">View more</FrameButton>
        </div>
      </Container>
    </section>
  );
}
