import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { FeatureCards } from "@/components/common/FeatureCards";

/* Why Travel With Fortune — the cream band between HighlightsSection (white)
   and SeasonsSection (white). Data-only module; all layout lives in the shared
   SectionHeading + FeatureCards primitives.

   `bg-cream` is the token form of the #FAF7F2 this section used to hardcode,
   and matches how MustVisitSection writes the same band. The section keeps the
   global `spacing` class rather than <Container spacing> — the Container
   variant pads 130px at ≥1024px against `spacing`'s 100px, which would break
   rhythm with the neighbouring sections. */
/* iconWidth/iconHeight are DISPLAY sizes, not the file's native pixels — each
   source PNG is a different size (45x45, 51x51, 45x45, 38x34), so they are
   normalised here to a common 42px optical height. */
const WHY_TRAVEL_CARDS = [
  {
    key: "expert-knowledge",
    icon: "/destinations/kerala/icons/goggle.png",
    iconWidth: 42,
    iconHeight: 42,
    title: "Expert Knowledge",
    lead: "Our specialists have travelled extensively",
    body: "The same specialist will handle your trip from start to finish.",
  },
  {
    key: "personalized-service",
    icon: "/destinations/kerala/icons/climb.png",
    iconWidth: 42,
    iconHeight: 42,
    title: "Personalized Service",
    lead: "Your journey is designed around you",
    body: "We take the time to understand what you want from your trip.",
  },
  {
    key: "trusted-experiences",
    icon: "/destinations/kerala/icons/diamond.png",
    iconWidth: 42,
    iconHeight: 42,
    title: "Trusted Experiences",
    lead: "Handpicked places and experiences",
    body: "We choose stays, experiences, and destinations we know and trust.",
  },
  {
    key: "dedicated-support",
    icon: "/destinations/kerala/icons/support.png",
    iconWidth: 47,
    iconHeight: 42,
    title: "Dedicated Support",
    lead: "We're here whenever you need us",
    body: "Our team stays connected throughout your journey, from planning to return.",
  },
];

export function WhyTravelSection() {
  return (
    <section className="bg-cream spacing">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Why Travel With Fortune"
          title="We Plan Every Journey Around You"
          description="Every journey is planned around you, from your interests and travel style to the experiences you want to discover. We handle the details, so you can focus on enjoying the journey and making memories."
          eyebrowClassName="lg:text-[20px]"
          descriptionClassName="max-lg:max-w-[560px] max-w-[828px] lg:leading-[29px]"
        />

        <FeatureCards
          items={WHY_TRAVEL_CARDS}
          className="mt-12 md:mt-16 lg:mt-[64px] mx-auto max-w-[600px] md:max-w-none xl:max-w-[1080px]"
        />
      </Container>
    </section>
  );
}
