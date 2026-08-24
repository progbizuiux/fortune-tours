import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { JournalCard } from "@/components/common/JournalCard";
import { cn } from "@/lib/utils";

const FALLBACK_JOURNALS = [
  {
    meta: "Journal — 01",
    title: "The Soul of Morocco",
    description: "Explore the vibrant colours, diverse flavours, and enchanting hidden corners of Morocco, a land rich in culture and history.",
    href: "/journal/soul-of-morocco",
    image: "/countries/africa/into-the-wild.png",
  },
  {
    meta: "Journal — 02",
    title: "Into the Wild",
    description: "Let's take a closer look at Africa's extraordinary wildlife, showcasing its diverse species and breathtaking natural habitats.",
    href: "/journal/into-the-wild-africa",
    image: "/countries/africa/elephant.png",
  },
  {
    meta: "Journal — 03",
    title: "Into the Wild",
    description: "Discover the rich culture, stunning landscapes, and vibrant people of Egypt as you embark on an unforgettable journey.",
    href: "/journal/into-the-wild-egypt",
    image: "/countries/africa/safari.png",
  },
];

export function RegionJournalSection({
  className,
  title = "Go beyond the destination.",
  description = "Discover the stories and culture that make each place unique. Travel beyond sights to find its authentic character.",
  items = FALLBACK_JOURNALS,
  readLabel = "Read",
}) {
  return (
    <section className={cn("relative z-10 bg-background spacing", className)}>
      <Container>
        <SectionHeading
          align="center"
          title={title}
          description={description}
          titleClassName="max-w-[800px]"
          descriptionClassName="max-w-[600px]"
        />

        <div className="mt-16 max-xl:flex max-xl:flex-nowrap max-xl:overflow-x-auto max-xl:snap-x max-xl:snap-mandatory max-xl:[scrollbar-width:none] max-xl:[&::-webkit-scrollbar]:hidden xl:grid xl:grid-cols-3 gap-x-[15px] gap-y-12">
          {items.map((post) => (
            <div 
              key={post.href}
              className="max-xl:shrink-0 max-xl:snap-center max-sm:w-[254px] sm:max-md:w-[320px] md:max-lg:w-[280px] lg:max-xl:w-[320px]"
            >
              <JournalCard
                meta={post.meta}
                title={post.title}
                description={post.description}
                href={post.href}
                image={post.image}
                alt={post.title}
                readLabel={readLabel}
                titleClassName="text-black dark:text-cream font-heading text-[20px] xl:text-[24px] font-normal leading-[1.2] mt-4"
                imageClassName="aspect-[577/586]"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
