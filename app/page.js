import { HeroSection } from "@/components/home/HeroSection";
import { CloudTransition } from "@/components/home/CloudTransition";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { CredentialsSection } from "@/components/home/CredentialsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CloudTransition />
      <DestinationsSection />
      <CredentialsSection />
    </>
  );
}
