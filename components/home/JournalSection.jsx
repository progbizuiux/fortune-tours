import Image from "next/image";
import { CtaLink } from "@/components/common/CtaLink";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CardCascade } from "@/components/common/CardCascade";
import { CascadeText } from "@/components/common/CascadeText";
import { cn } from "@/lib/utils";

/* Journal strip (Figma "final" → Chapter 07 — Journal).
   Card type per Figma: meta = Spartan Light 16/100%, story = Poppins Light
   18/24 at black 80%, Read = Spartan Medium 16/100%. The story <p> gets its
   Poppins values from the design-system tag defaults.
   Images are placeholders from public/home until journal photography lands. */
const POSTS = [
  {
    meta: "Field Notes — 6 min read",
    title: "What sunrise in Iceland taught me about stillness.",
    href: "/journal/sunrise-in-iceland",
    image: "/home/journal/field-notes.png",
  },
  {
    meta: "City Guide — 9 min read",
    title: "Explore twelve secret cafés in Paris known only to locals.",
    href: "/journal/secret-cafes-paris",
    image: "/home/journal/coastal-escape.png",
  },
  {
    meta: "Coastal Escape — 7 min read",
    title: "Five charming towns on Italy's Amalfi Coast.",
    href: "/journal/amalfi-coast-towns",
    image: "/home/journal/city-guide.png",
  },
  {
    meta: "Card 04 — Kyoto, Japan",
    title: "Walking through Kyoto during cherry blossom season.",
    href: "/journal/kyoto-cherry-blossom",
    image: "/home/journal/climatic.png",
  },
];

/* The negative top margins pull this up under the home page's cloud transition.
   Any other page reusing the strip has nothing to tuck under, so `className` is
   there to cancel them — see the experience pages, which pass mt-0!. */
/* Content comes from the `sections.journal` block via lib/strapi/home.js on the
   home page. Other pages render it with no props and get POSTS above. */
export function JournalSection({
  className,
  eyebrow = "Chapter 07 — Journal",
  title = "From the field.",
  description = "Every destination tells a story. Discover guides and experiences to inspire your next adventure.",
  items = POSTS,
  readLabel = "Read",
}) {
  return (
    <section
      aria-label="Journal — stories from the field"
      className={cn(
        "spacing -mt-[40px] lg:-mt-[100px] 2xl:mt-0 relative z-10",
        className,
      )}
    >
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        {/* 12px column gap and 431:551 image ratio from the Figma frame */}
        <CardCascade
          as="ul"
          className="mt-16 grid max-xl:flex max-xl:flex-nowrap max-xl:overflow-x-auto max-xl:snap-x max-xl:snap-mandatory max-xl:[scrollbar-width:none] max-xl:[&::-webkit-scrollbar]:hidden gap-x-3 gap-y-10 xl:grid-cols-4"
        >
          {items.map((post) => (
            <li
              key={post.href}
              data-cascade-card
              className="flex flex-col items-start max-sm:w-[254px] sm:max-md:w-[320px] md:max-lg:w-[280px] lg:max-xl:w-[320px] max-xl:shrink-0 max-xl:snap-center"
            >
              <div
                data-cascade-picture
                className="relative aspect-[431/551] w-full overflow-hidden"
              >
                <Image
                  src={post.image}
                  alt={post.alt ?? post.title}
                  fill
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 254px"
                  className="object-cover"
                />
              </div>

              <span className="font-top text-small max-sm:text-[12px] mt-5 max-sm:mt-3 leading-none font-light text-navy dark:text-cream">
                <CascadeText part="title">{post.meta}</CascadeText>
              </span>

              <p className="mt-4 max-sm:mt-2 max-sm:font-light max-sm:text-[13px] max-sm:leading-[110%] text-black/80 dark:text-cream/80 xl:max-w-[90%]">
                <CascadeText part="subtitle">{post.title}</CascadeText>
              </p>

              {/* mt-auto bottom-anchors Read so it sits on the same line in
                  every card of a row, however many lines the story wraps to;
                  pt-4 keeps the 16px gap on the tallest card */}
              <CtaLink
                href={post.href}
                underline={false}
                className="font-top text-small max-sm:text-[12px] hover:text-sky mt-auto inline-flex items-center gap-1.5 pt-4 leading-none font-medium text-navy dark:text-cream"
              >
                {readLabel}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 max-sm:size-3"
                />
              </CtaLink>
            </li>
          ))}
        </CardCascade>
      </Container>
    </section>
  );
}
