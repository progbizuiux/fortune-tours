import { BehindTheJourneySection } from "@/components/about/BehindTheJourneySection";
import { ServicesSection } from "@/components/about/ServicesSection";
import { TeamSection } from "@/components/about/TeamSection";
import { PageHero } from "@/components/common/PageHero";
import { WhyTravelSection } from "@/components/common/WhyTravelSection";
import { FeatureRows } from "@/components/common/FeatureRows";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CredentialsSection } from "@/components/common/CredentialsSection";
import { OfficesSection } from "@/components/about/OfficesSection";
import { JournalSection } from "@/components/common/JournalSection";

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
    body: "Destinations chosen around your interests, travel style, and the experiences you want to discover.",
  },
  {
    key: "thoughtful-stays",
    title: "Thoughtful Stays",
    body: "Hotels, resorts, villas, and retreats selected for their location, character, comfort, and setting.",
  },
  {
    key: "meaningful-experiences",
    title: "Meaningful Experiences",
    body: "Carefully chosen experiences that help you connect with the destination beyond the usual sights.",
  },
  {
    key: "smooth-connections",
    title: "Smooth Connections",
    body: "Transfers, transportation, and logistics planned to keep your journey comfortable and well connected.",
  },
  {
    key: "travel-support",
    title: "Travel Support",
    body: "Dedicated assistance before and throughout your journey, whenever you need guidance or support.",
  },
];

const PROCESS_ITEMS = [
  {
    key: "understand",
    title: "01 - We Understand Your Journey",
    description:
      "We start by getting to know your destination, interests, travel style, priorities, and expectations. This gives us a clear understanding of what matters to you, what you want to experience, and how you want your journey to feel from the very beginning.",
    image: "/destinations/kerala/adventure-nature.avif",
    alt: "We Understand Your Journey",
  },
  {
    key: "shape",
    title: "02 - We Shape the Details",
    description:
      "We bring together the right destinations, stays, experiences, transportation, and timing to create a journey around your preferences. Every element is considered carefully, balancing what you want to see with enough time to experience each place at your own pace.",
    image: "/destinations/kerala/house-boat.avif",
    alt: "We Shape the Details",
  },
  {
    key: "stay",
    title: "03 - We Stay With You",
    description:
      "Once your journey is confirmed, we coordinate the details and remain involved throughout your trip. From preparation and departure to the final transfer, our team stays available to provide guidance, handle the details, and support you whenever you need it.",
    image: "/destinations/kerala/wildlife.avif",
    alt: "We Stay With You",
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
          eyebrow="About Fortune · EST. 2005"
          title="Two decades of making travel feel personal."
          description="An editorial travel house, working out of Kerala since 2005. Built on local expertise, direct planners, and thoughtfully crafted journeys."
          /* Placeholder. The frame's own export
             (view-green-mountains-sunset-beautiful-summer-landscape.png) is not
             in the repo yet — drop it into /public and change this one line. */
          image="/inner-page/innerpage.png"
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

      <WhyTravelSection
        eyebrow="More Than A Booking"
        title="What We Bring Together"
        description="A great journey is made up of many details. We bring them together so every part works naturally with the next."
        items={BRING_TOGETHER_ITEMS}
      />

      <section className="bg-white pt-24 md:pt-32 xl:pt-[150px]">
        <div className="mx-auto max-w-[1160px] px-4 md:px-8 xl:px-0">
          <SectionHeading
            eyebrow="Our Process"
            title="From Your Idea to Your Journey"
            titleClassName="max-w-none"
            /* No description in the design */
          />
        </div>
        <FeatureRows
          items={PROCESS_ITEMS}
          className="mt-12 md:mt-16 xl:mt-[60px]"
          stacked
        />
      </section>

      <ServicesSection />
      <TeamSection />
      <CredentialsSection />
      <OfficesSection />
      
      {/* Journal Section relies on negative top margins by default to overlap the home page cloud bank.
          On the About Us page, we override it with 'mt-0!' so it sits naturally below the Offices section,
          or we can just let it sit if it doesn't cause issues. Wait, let's look at `JournalSection.jsx`:
          `className={cn("spacing -mt-[40px] lg:-mt-[100px] 2xl:mt-0 relative z-10", className)}`
          I will pass `className="mt-0! lg:mt-0!"` to clear that margin. */}
      <JournalSection className="mt-0! lg:mt-0! bg-white pt-20 md:pt-32 xl:pt-[150px]" />
    </>
  );
}
