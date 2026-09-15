import { BehindTheJourneySection } from "@/components/about/BehindTheJourneySection";
import { ServicesSection } from "@/components/about/ServicesSection";
import { TeamSection } from "@/components/about/TeamSection";
import { PageHero } from "@/components/common/PageHero";
import { RegionFeaturesSection } from "@/components/common/RegionFeaturesSection";
import { FeatureRows } from "@/components/common/FeatureRows";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CredentialsSection } from "@/components/common/CredentialsSection";
import { OfficesSection } from "@/components/about/OfficesSection";

/* /about-us — the About page.
 *
 * Only the opening banner so far; the frame below it (Behind The Journey and
 * everything after) lands in a later pass. The hero is the shared PageHero the
 * home and destination pages draw, so nothing about the frame, the entrance
 * timeline or the type scale is restated here — this file is the page's copy
 * and its two design-specific values.
 *
 * A static segment, so it wins over app/[slug] in Next's route matching the
 * same way /search and /experiences do — the region catch-all never sees it.
 */

/* Static: the copy is in this file, with nothing fetched. */
export const metadata = {
  title: "About",
  description:
    "An editorial travel house, working out of Kerala since 2005. Built on local expertise, direct planners, and thoughtfully crafted journeys.",
};

const BRING_TOGETHER_ITEMS = [
  {
    key: "right-places",
    title: "The Right Places",
    body: "Chosen from twenty years of sending groups to these destinations, not from a brochure picked up at a fair.",
  },
  {
    key: "your-plan-your-pace",
    title: "Your Plan, Your Pace",
    body: "No two families travel the same way, so no two plans should look the same. We listen first, then shape the days around your pace and your priorities.",
  },
  {
    key: "everything-in-one-booking",
    title: "Everything in One Booking",
    body: "Flights, hotels, meals, visas, insurance, entry tickets, coaches and transfers. One team holds all of it, so nothing sits with you to sort out.",
  },
  {
    key: "always-with-you",
    title: "Always With You",
    body: "A Malayalee tour manager travels with the group from Kerala. Questions get answered in your language, and someone who knows the plan is always within reach.",
  },
  {
    key: "support-throughout",
    title: "Support Throughout",
    body: "Our team is available through the whole journey. We stay involved because your experience is what our name runs on.",
  },
];

// Same reviews as the home page's CredentialsSection default, with this
// page's own photos from public/about-us/ in place of the shared /credentials/
// images.
const ABOUT_REVIEWS = [
  {
    numeral: "I.",
    quote:
      "I really enjoyed the Delhi tour conducted on 25 August. Althaf our tour manager was very friendly and excellent. Thanks fortune for making a wonderful memory.",
    name: "Leelamma Mathew",
    rating: "4.6",
    src: "/about-us/india-gate.jpg",
  },
  {
    numeral: "II.",
    quote:
      "We had an amazing 4 Days & 3 Nights Malaysia trip arranged by Fortune Tours. The entire tour was well organized, comfortable, and truly enjoyable from start to finish. A special thanks to our Tour Manager, Divya, who did an excellent job coordinating everything with great care and professionalism. Our guide, Mr. Sathya, was also outstanding—friendly and knowledgeable. This was a wonderful family experience, and we will definitely prefer Fortune Tours again for our future holidays. Highly recommended!",
    name: "Deepesh Kumar",
    rating: "4.6",
    src: "/about-us/malaysia.jpg",
  },
  {
    numeral: "III.",
    quote:
      "Our first international trip to Thailand was truly memorable and stress-free, thanks to Fortune Tours! From the 5-star hotel stays to the daily sightseeing, everything was seamlessly organized. Highly recommended!",
    name: "Smrithi Mohan",
    rating: "4.6",
    src: "/about-us/thailand.jpg",
  },
  {
    numeral: "IV.",
    quote:
      "The trip to Bhutan was extremely good. The place was really peaceful and calm. The Fortune group, as usual, never disappoints. This is our 5th trip with Fortune Travels. The stay, vehicle, and food arrangements were too good. The accompanying partner from Fortune, Mr. Abijith, was really helpful and understanding. I had a 3-year-old kid and was worried about it. Abijith was too good to help us along, even during the long trek to Tiger’s Nest. Thanks, Abijith and Fortune.",
    name: "Kothott Babu",
    rating: "4.6",
    src: "/about-us/before-you-travel.jpg",
  },
];

const PROCESS_ITEMS = [
  {
    key: "plan-it-right",
    title: "01. We Plan It Right",
    description:
      "We listen first;understanding who's travelling, your budget, timing, and what matters most. Then we build a route that fits, handling every detail: flights, hotels, meals, visas, insurance, transfers. Everything works because we've done these routes before and know where things go wrong.",
    image: "/about-us/understand.jpeg",
    alt: "01. We Plan It Right",
  },
  {
    key: "travel-with-you",
    title: "02. We Travel With You",
    description:
      "A Fortune tour manager joins your group and stays throughout. When last-minute changes happen, questions arise, or something unexpected occurs, someone who knows your plan is there to help. You're never managing logistics alone.",
    image: "/about-us/we shape the details.png",
    alt: "02. We Travel With You",
  },
  {
    key: "follow-up",
    title: "03. We Follow Up",
    description:
      "Your trip doesn't end when you land. We check in, gather your feedback, and carry it forward. What worked and what didn't shapes how we build the next journey better.",
    image: "/about-us/travel-guide.jpeg",
    alt: "03. We Follow Up",
  },
];

export default function AboutUsPage() {
  return (
    <>
      {/* Pin scope for the sticky hero, the same wrapper the destination pages
         use: the hero stays pinned only while this div is on screen, so the
         sections that follow will push it away rather than leave it fixed for
         the rest of the page. */}
      <div>
        <PageHero
          eyebrow="Our Foundation"
          title="Twenty Years of Planning Journeys That Feel Like Yours."
          description="Fortune Tours has been sending travellers from Kerala to every corner of the map for over twenty years."
          /* Placeholder. The frame's own export
             (view-green-mountains-sunset-beautiful-summer-landscape.png) is not
             in the repo yet — drop it into /public and change this one line. */
          image="/about-us_banner.png"
          imageAlt=""
          /* The banner is the LCP element here, as it is on the destination
             pages. */
          priority
          /* The frame's overlay exactly as its panel states it: #000000 at 20%,
             flat across the picture. Not the hero's default three-layer scrim —
             that is the home and destination spec, and this frame draws one
             colour at one opacity. */
          overlayClassName="bg-black/20"
        />

        <BehindTheJourneySection />
      </div>

      <RegionFeaturesSection
        eyebrow="More Than a Booking."
        title="What We Bring Together"
        description="A great trip needs someone who's been there, knows what goes wrong, and builds plans that prevent it."
        features={BRING_TOGETHER_ITEMS}
      />

      <section className="bg-white pt-10 md:pt-16 xl:pt-[150px] xl:max-2xl:pt-[100px]">
        <div className="mx-auto max-w-[1160px] px-4 md:px-8 xl:px-0">
          <SectionHeading
            eyebrow="How It Works"
            title="From Your Idea to Your Journey."
            titleClassName="max-w-none"
            /* No description in the design */
          />
        </div>
        <FeatureRows
          items={PROCESS_ITEMS}
          className="!py-0 mt-8 md:mt-12 xl:mt-[60px] xl:max-2xl:mt-[40px] xl:max-2xl:gap-[80px]"
          stacked
        />
      </section>

      <ServicesSection />
      {/* <TeamSection /> */}
      <CredentialsSection
        eyebrow="Industry Affiliations"
        title="Recognised Across the Travel Industry."
        reviews={ABOUT_REVIEWS}
      />
      <OfficesSection
        eyebrow="Five Offices Across Kerala"
        title="Walk In or Call. Someone Will Be There."
        description="Start your trip at fortunetours.in or call any office. Someone will be there to listen."
      />
      
      {/* Journal Section relies on negative top margins by default to overlap the home page cloud bank.
          On the About Us page, we override it with 'mt-0!' so it sits naturally below the Offices section,
          or we can just let it sit if it doesn't cause issues. Wait, let's look at `JournalSection.jsx`:
          `className={cn("spacing -mt-[40px] lg:-mt-[100px] 2xl:mt-0 relative z-10", className)}`
          I will pass `className="mt-0! lg:mt-0!"` to clear that margin. */}
      {/* <JournalSection className="mt-0! lg:mt-0! bg-white pt-20 md:pt-32 xl:pt-[150px]" /> */}
    </>
  );
}
