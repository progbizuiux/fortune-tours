import { ImageCarouselSection } from "@/components/common/ImageCarouselSection";

const JOURNEYS = [
  {
    key: "backwaters",
    label: "Backwaters",
    image: "/destinations/kerala/house-boat.avif",
    alt: "House boat in Kerala backwaters",
    tag: "I want.",
  },
  {
    key: "hill-stations",
    label: "Hill Stations",
    image: "/destinations/kerala/hill-stations.avif",
    alt: "Mist covered hills in Kerala",
    tag: "I want.",
  },
  {
    key: "beaches",
    label: "Beaches.",
    image: "/destinations/kerala/beaches.avif",
    alt: "Waves crashing on a Kerala beach",
    tag: "I want.",
  },
  {
    key: "adventure-nature",
    label: "Adventure & Nature",
    image: "/destinations/kerala/adventure-nature.avif",
    alt: "Hiker in the mountains",
    tag: "I want.",
  },
  {
    key: "culture-heritage",
    label: "Culture & Heritage.",
    image: "/destinations/kerala/culture-heritage.jpg",
    alt: "Cultural experience in Kerala",
    tag: "I want.",
  },
  {
    key: "ayurveda-wellness",
    label: "Ayurveda & Wellness.",
    image: "/destinations/kerala/ayurveda-wellness.jpg",
    alt: "Ayurveda & Wellness in Kerala",
    tag: "I want.",
  },
  {
    key: "food-culinary",
    label: "Food & Culinary.",
    image: "/destinations/kerala/food-culinary.jpg",
    alt: "Food & Culinary experiance in Kerala",
    tag: "I want.",
  },
  {
    key: "wildlife",
    label: "Wildlife.",
    image: "/destinations/kerala/wildlife.avif",
    alt: "Elephant near a waterfall in Kerala",
    tag: "I want.",
  },
];

export function JourneysSection() {
  return (
    <ImageCarouselSection
      ariaLabel="Journeys — find the side of Kerala you'll love"
      eyebrow="Choose Your Journey"
      title="Find the Side of Kerala You'll Love"
      description="Choose the experiences that inspire you and create a Kerala journey that's uniquely yours."
      items={JOURNEYS}
      buttonText="Reveal my journeys."
    />
  );
}
