import { HeroSection } from "@/components/home/HeroSection";
import { DeparturesSection } from "@/components/home/DeparturesSection";
import { JournalSection } from "@/components/home/JournalSection";
import { PolaroidGallery } from "@/components/home/PolaroidGallery";

export default function Home() {
  return (
    <>
      <HeroSection />
      <DeparturesSection />
      <JournalSection />
      <PolaroidGallery />
    </>
  );
}
