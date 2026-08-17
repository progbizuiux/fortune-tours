import { CardCarouselSection } from "@/components/common/CardCarouselSection";

const PLACES = [
  {
    key: "munnar",
    title: "Munnar",
    description: "Rolling tea estates, misty hills, and scenic waterfalls.",
    image: "/destinations/kerala/hill-stations.avif",
  },
  {
    key: "alleppey",
    title: "Alleppey.",
    description: "Peaceful backwaters, houseboat cruises, and village charm.",
    image: "/destinations/kerala/house-boat.avif",
  },
  {
    key: "wayanad",
    title: "Wayanad.",
    description: "Lush forests, waterfalls, caves, and nature trails.",
    image: "/destinations/kerala/adventure-nature.avif",
  },
  {
    key: "thekkady",
    title: "Thekkady.",
    description: "Wildlife safaris, spice plantations, and bamboo rafting.",
    image: "/destinations/kerala/wildlife.avif",
  },
  {
    key: "varkala",
    title: "Varkala.",
    description: "Clifftop beaches, cafés, and sunsets.",
    image: "/destinations/kerala/beaches.avif",
  },
];

export function MustVisitSection() {
  return (
    <CardCarouselSection
      className="bg-cream"
      eyebrow="Must Visit Places"
      title="Explore Kerala's Most Loved Destinations"
      description="A few places we plan around most. Each one asks for a different pace."
      eyebrowClassName="lg:text-[20px]"
      descriptionClassName="max-lg:max-w-[560px] max-w-[828px] lg:leading-[29px]"
      items={PLACES}
    />
  );
}
