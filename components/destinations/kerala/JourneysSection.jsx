"use client";

import { useEffect, useState } from "react";
import { ImageCarouselSection } from "@/components/common/ImageCarouselSection";

const TAG = "I want.";

const JOURNEYS = [
  {
    key: "backwaters",
    label: "Backwaters",
    image: "/destinations/kerala/house-boat.avif",
    alt: "House boat in Kerala backwaters",
  },
  {
    key: "hill-stations",
    label: "Hill Stations",
    image: "/destinations/kerala/hill-stations.avif",
    alt: "Mist covered hills in Kerala",
  },
  {
    key: "beaches",
    label: "Beaches",
    image: "/destinations/kerala/beaches.avif",
    alt: "Waves crashing on a Kerala beach",
  },
  {
    key: "adventure-nature",
    label: "Adventure",
    image: "/destinations/kerala/adventure-nature.avif",
    alt: "Hiker in the mountains",
  },
  {
    key: "culture-heritage",
    label: "Culture",
    image: "/destinations/kerala/culture-heritage.jpg",
    alt: "Cultural experience in Kerala",
  },
  {
    key: "ayurveda-wellness",
    label: "Ayurveda",
    image: "/destinations/kerala/ayurveda-wellness.jpg",
    alt: "Ayurveda & Wellness in Kerala",
  },
  {
    key: "food-culinary",
    label: "Food",
    image: "/destinations/kerala/food-culinary.jpg",
    alt: "Food & Culinary experiance in Kerala",
  },
  {
    key: "wildlife",
    label: "Wildlife.",
    image: "/destinations/kerala/wildlife.avif",
    alt: "Elephant near a waterfall in Kerala",
  },
];

export function JourneysSection({
  eyebrow = "Choose Your Journey",
  title = "Find the Side of Kerala You'll Love",
  description = "Choose the experiences that inspire you and create a Kerala journey that's uniquely yours.",
  items: initialItems,
}) {
  const [items, setItems] = useState(initialItems || JOURNEYS);
  const [isLoading, setIsLoading] = useState(!initialItems);

  useEffect(() => {
    if (initialItems) return;

    const fetchTravelStyles = async () => {
      try {
        const response = await fetch("/api/travel-styles");
        const { data } = await response.json();
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch travel styles:", error);
        setItems(JOURNEYS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelStyles();
  }, [initialItems]);

  if (isLoading) {
    return <div className="h-64 bg-slate-200 dark:bg-slate-800 animate-pulse" />;
  }

  return (
    <ImageCarouselSection
      ariaLabel={`Journeys — ${title}`}
      eyebrow={eyebrow}
      title={title}
      description={description}
      items={items.map((item) => ({ ...item, tag: TAG }))}
      buttonContainerClassName="mt-24 lg:mt-20 flex justify-center"
    />
  );
}
