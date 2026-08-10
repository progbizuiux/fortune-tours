import { HeroSection } from "@/components/home/HeroSection";
import { TravelStylesSection } from "@/components/home/TravelStylesSection";
import { DeparturesSection } from "@/components/home/DeparturesSection";
import { JournalSection } from "@/components/home/JournalSection";
import { PolaroidGallery } from "@/components/home/PolaroidGallery";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TravelStylesSection />
      <DeparturesSection />
      <JournalSection />
      <PolaroidGallery />
    </>
  );
}
