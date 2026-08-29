import { ContactHeroSection } from "@/components/contact/ContactHeroSection";
import { OfficesSection } from "@/components/about/OfficesSection";
import { FaqSection } from "@/components/common/FaqSection";

export const metadata = {
  title: "Contact Us | Let's Start Planning",
  description:
    "Get in touch with Fortune Travels. Start planning your custom journey, family holiday, or luxury escape with our dedicated travel designers.",
};

const CONTACT_FAQS = [
  {
    question: "Do Indian citizens need a permit?",
    answer:
      "A good Kerala trip isn't picked— it's thoughtfully planned around you. We listen, tailor your stays and experiences, and keep our Kerala-based team close by.",
  },
  {
    question: "How far ahead should we plan?",
    answer:
      "We recommend planning 2 to 3 months in advance, especially for travel between October and March, to secure the best boutique resorts, heritage stays, and bespoke experiences.",
  },
  {
    question: "Which island should we choose?",
    answer:
      "Depending on whether you seek pristine beaches, rich coral diving, secluded lagoons, or cultural discovery, our travel designers will tailor the destination choices to your preferences.",
  },
  {
    question: "Which hotel will we stay in?",
    answer:
      "We curate boutique heritage retreats, luxury backwater villas, private island stays, and premium eco-resorts based on your comfort and style.",
  },
  {
    question: "Can foreign nationals visit?",
    answer:
      "Yes, foreign nationals with a valid Indian visa can travel seamlessly. Our team coordinates all arrival formalities, private transfers, and local logistics.",
  },
  {
    question: "Is alcohol available?",
    answer:
      "Alcohol is available at classified 4-star and 5-star hotels, luxury resorts, and licensed heritage retreats throughout Kerala.",
  },
  {
    question: "Do we need to be able to swim?",
    answer:
      "Swimming is not required for houseboats, scenic backwater cruises, nature walks, or heritage trails. Water-based activities are guided by certified professionals with safety gear.",
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
