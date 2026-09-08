import Image from "next/image";
import { CtaLink } from "@/components/common/CtaLink";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CardCascade } from "@/components/common/CardCascade";
import { JournalCard } from "@/components/common/JournalCard";
import { cn } from "@/lib/utils";

/* Journal strip (Figma "final" → Chapter 07 — Journal).
   Card type per Figma: meta = Spartan Light 16/100%, story = Poppins Light
   18/24 at black 80%, Read = Spartan Medium 16/100%. The story <p> gets its
   Poppins values from the design-system tag defaults.
   Images are placeholders from public/home until journal photography lands.
   Titles and hrefs mirror real articles in lib/journal.js, so a "Read" link on
   the fallback always opens an article that exists — the earlier placeholder
   slugs (/journal/sunrise-in-iceland …) had no article behind them and 404'd. */
const POSTS = [
  {
    meta: "Stories — 6 min read",
    title: "What sunrise in Iceland taught me about stillness.",
    href: "/journal/what-sunrise-in-iceland-taught-me-about-stillness",
    image: "/home/journal/field-notes.png",
  },
  {
    meta: "Stories — 7 min read",
    title: "The slow road through the Alps.",
    href: "/journal/the-slow-road-through-the-alps",
    image: "/home/journal/coastal-escape.png",
  },
  {
    meta: "Guides — 8 min read",
    title: "A first-timer's guide to the backwaters.",
    href: "/journal/a-first-timers-guide-to-the-backwaters",
    image: "/home/journal/city-guide.png",
  },
  {
    meta: "Inspiration — 5 min read",
    title: "The case for staying put for a week.",
    href: "/journal/the-case-for-staying-put-for-a-week",
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
        "spacing -mt-[40px] lg:max-xl:mt-0 xl:max-2xl:mt-0 2xl:mt-0 lg:-mt-[100px] relative z-10",
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
          className="mt-16 grid max-xl:flex max-xl:flex-nowrap max-xl:overflow-x-auto max-xl:snap-x max-xl:snap-mandatory max-xl:[scrollbar-width:none] max-xl:[&::-webkit-scrollbar]:hidden max-xl:gap-x-[7px] gap-x-3 gap-y-10 xl:grid-cols-4 xl:max-2xl:mt-12 xl:max-2xl:gap-y-8"
        >
          {items.map((post, idx) => (
            <li
              key={post.href || post.title || post.meta || idx}
              data-cascade-card
              className="flex flex-col items-start max-xl:w-[254px] max-xl:shrink-0 max-xl:snap-center"
            >
              {/* w-full: the card and this li are both `items-start` flex
                  columns, so without it the card shrinks to its own text and
                  the picture — sized w-full against that — comes out narrower
                  on every card, by a different amount each time. */}
              <JournalCard
                className="w-full"
                meta={post.meta}
                title={post.title}
                href={post.href}
                image={post.image}
                alt={post.alt}
                readLabel={readLabel}
                cascade={true}
              />
            </li>
          ))}
        </CardCascade>
      </Container>
    </section>
  );
}
