import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";

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
    image: "/home/journal/city-guide.png",
  },
  {
    meta: "Coastal Escape — 7 min read",
    title: "Five charming towns on Italy's Amalfi Coast.",
    href: "/journal/amalfi-coast-towns",
    image: "/home/journal/coastal-escape.png",
  },
  {
    meta: "Card 04 — Kyoto, Japan",
    title: "Walking through Kyoto during cherry blossom season.",
    href: "/journal/kyoto-cherry-blossom",
    image: "/home/journal/climatic.png",
  },
];

export function JournalSection() {
  return (
    <section aria-label="Journal — stories from the field" className="spacing">
      <Container>
        <SectionHeading
          eyebrow="Chapter 07 — Journal"
          title="From the field."
          description="Every destination tells a story. Discover guides and experiences to inspire your next adventure."
        />

        {/* 12px column gap and 431:551 image ratio from the Figma frame */}
        <Reveal
          as="ul"
          stagger={0.12}
          y={36}
          className="mt-16 grid gap-x-3 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {POSTS.map((post) => (
            <li key={post.href} className="flex flex-col items-start">
              <div className="relative aspect-[431/551] w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
                  className="object-cover"
                />
              </div>

              <span className="font-top text-small mt-5 leading-none font-light text-navy dark:text-cream">
                {post.meta}
              </span>

              <p className="mt-4 text-black/80 dark:text-cream/80">
                {post.title}
              </p>

              {/* mt-auto bottom-anchors Read so it sits on the same line in
                  every card of a row, however many lines the story wraps to;
                  pt-4 keeps the 16px gap on the tallest card */}
              <Link
                href={post.href}
                className="font-top text-small hover:text-sky mt-auto inline-flex items-center gap-1.5 pt-4 leading-none font-medium text-navy transition-colors dark:text-cream"
              >
                Read
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </Link>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
