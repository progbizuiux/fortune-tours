import { TabbedCardsSection } from "@/components/common/TabbedCardsSection";

const SEASONS_TABS = [
  { key: "sep_mar", label: "September – March", name: "September" },
  { key: "apr_may", label: "April – May", name: "April" },
  { key: "jun_aug", label: "June – August", name: "June" },
];

const SEASONS_DATA = {
  sep_mar: [
    {
      title: "Wayanad",
      meta: "04 Days - Nature & adventure - Private stay. Varkala",
      image: "/destinations/kerala/adventure-nature.avif",
    },
    {
      title: "Varkala coastal escape.",
      meta: "03 Days - Beach & wellness - Private stay.",
      image: "/destinations/kerala/beaches.avif",
    },
  ],
  apr_may: [
    {
      title: "Munnar tea trails.",
      meta: "03 Days - Hills & tea - Boutique resort.",
      image: "/destinations/kerala/hill-stations.avif",
    },
    {
      title: "Alleppey backwaters.",
      meta: "02 Days - Cruise & relax - Houseboat.",
      image: "/destinations/kerala/house-boat.avif",
    },
  ],
  jun_aug: [
    {
      title: "Athirappilly monsoons.",
      meta: "02 Days - Rain & waterfalls - Luxury resort.",
      image: "/destinations/kerala/wildlife.avif",
    },
    {
      title: "Kumarakom retreat.",
      meta: "03 Days - Wellness & spa - Lake resort.",
      image: "/destinations/kerala/ayurveda-wellness.jpg",
    },
  ],
};

export function SeasonsSection() {
  return (
    <TabbedCardsSection
      eyebrow="Plan Your Journey"
      title="Kerala in Every Season"
      description="Small-group journeys with a host. Fixed dates, limited seats."
      tabs={SEASONS_TABS}
      cardsData={SEASONS_DATA}
      sectionAriaLabel="Kerala seasons and departures"
    />
  );
}
