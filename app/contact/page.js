import { ContactHeroSection } from "@/components/contact/ContactHeroSection";
import { OfficesSection } from "@/components/about/OfficesSection";

export const metadata = {
  title: "Contact Us | Let's Start Planning",
  description:
    "Get in touch with Fortune Travels. Start planning your custom journey, family holiday, or luxury escape with our dedicated travel designers.",
};

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
    </>
  );
}
