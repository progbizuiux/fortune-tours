import { GalleryHeroSection } from "@/components/gallery/GalleryHeroSection";
import { GalleryGridSection } from "@/components/gallery/GalleryGridSection";

export const metadata = {
  title: "Gallery | Moments Along the Way | Fortune Travels",
  description:
    "A collection of places, people, and moments that bring every Fortune journey to life. Explore our curated photo gallery across incredible destinations.",
};

export default function GalleryPage() {
  return (
    <main>
      {/* Gallery Hero Section */}
      <GalleryHeroSection />

      {/* Gallery Photos Grid (with navbar transition trigger) */}
      <div data-navbar-solid-from>
        <GalleryGridSection />
      </div>
    </main>
  );
}
