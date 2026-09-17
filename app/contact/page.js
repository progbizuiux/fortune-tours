import { ContactHeroSection } from "@/components/contact/ContactHeroSection";
import { OfficesSection } from "@/components/about/OfficesSection";
import { FaqSection } from "@/components/common/FaqSection";

export const metadata = {
  title: "Contact Us | Let's Start Planning",
  description:
    "Get in touch with Fortune Travels. Start planning your custom journey, family holiday, or luxury escape with our dedicated travel designers.",
};

/* The questions a reader actually arrives on this page with — how to start,
   how early, whether we cover a place, visas, and whether they can just walk
   in. They lead, because the set below them came across from a Kerala package
   and answers a different reader.

   "How far ahead should we plan?" was dropped from that older set: it asked the
   same thing as "How far ahead should we start planning?" below and answered it
   differently (October-to-March pressure vs visa appointments), which is worse
   than either answer on its own. */
const CONTACT_FAQS = [
  {
    question: "How do I start planning a trip with Fortune?",
    answer:
      "Fill in the form on this page or call any of our offices. Tell us where you want to go, how many are travelling, and roughly when. We come back with a plan and a price, and nothing moves until you say it is right.",
  },
  {
    question: "How far ahead should we start planning?",
    answer:
      "Two to three months for most international tours, and earlier if the trip needs a Schengen or consulate visa, since appointments book out. Domestic tours and cruises can come together faster, but the good dates and cabin grades go to the early bookings.",
  },
  {
    question:
      "Can you plan a trip to a destination not listed on your website?",
    answer:
      "Yes. The destinations on the site are the ones we run most often, but we plan private trips to places outside that list too. Tell us what you have in mind and we will tell you honestly whether we can do it well.",
  },
  {
    question: "Do you handle visas and travel documents?",
    answer:
      "Yes, for every destination we sell. Visa applications, document checks, biometric appointments, and embassy follow-ups are all managed as part of your booking. We start as soon as you register so the timeline stays comfortable.",
  },
  {
    question: "Can I walk into an office instead of calling?",
    answer:
      "Yes. We have offices in Kochi, Thiruvananthapuram, Kannur, and Thrissur. Walk in during working hours and someone will be there to sit with you and start planning.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Contact Hero Section: Let's Start Planning */}
      <ContactHeroSection />

      {/* Where Are We / Branch Offices */}
      <div data-navbar-solid-from>
        <OfficesSection
          eyebrow="Branches"
          title="Where are we?"
          description="Walk in, or call the office nearest you. Someone will be there."
        />
      </div>

      {/* Good To Know / FAQ Section */}
      <FaqSection
        eyebrow="Good To Know"
        title={"Questions with useful\nanswers"}
        faqs={CONTACT_FAQS}
        className="bg-[#FAF7F2]"
      />
    </>
  );
}
