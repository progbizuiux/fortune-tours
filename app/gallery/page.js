import { GalleryGridSection } from "@/components/gallery/GalleryGridSection";
import { getGalleryPage } from "@/lib/strapi/gallery";

/* ISR on the same terms as the rest of the app. Must be a literal: Next reads
   this statically at build time, so it cannot be DEFAULT_REVALIDATE from
   lib/strapi/client.js. */
export const revalidate = 3600;

/* The standfirst doubles as the meta description, so the fallback has to exist
   in both places — the CMS may be empty, and the section carries its own copy
   independently of this. */
const FALLBACK_DESCRIPTION =
  "A collection of places, people, and moments that bring every Fortune journey to life. Explore our curated photo gallery across incredible destinations.";

export async function generateMetadata() {
  /* Metadata failing should not take the render down with it — the page body
     makes the same call and will throw there if the CMS is genuinely broken. */
  const page = await getGalleryPage().catch(() => null);

  return {
    /* Bare title on purpose — the root layout carries a
       `template: "%s | Fortune Travels"`, so adding the suffix here would print
       it twice. It used to. */
    title: page?.title ?? "Gallery",
    description: page?.description ?? FALLBACK_DESCRIPTION,
  };
}

export default async function GalleryPage() {
  /* `?? {}` rather than notFound(): the gallery still means something with no
     CMS entry at all, because the section ships with its own title, standfirst
     and twelve photographs. A 404 here would hide a page that renders fine. */
  const gallery = (await getGalleryPage()) ?? {};

  return (
    <>
      {/* Solid from the top. The page has no dark hero for a transparent bar to
          sit over — it opens on the gallery's own white, and white links on
          white is nothing at all. Same marker the other light-ground pages use;
          see app/journal/page.js. */}
      <div data-navbar-solid-from aria-hidden="true" />

      {/* The gallery is the whole page: its first tile opens as the banner and
          carries the title, and the mosaic pulls back from there. Spread, so a
          field the editor left empty arrives as undefined and the section's own
          default parameter takes over. */}
      <GalleryGridSection {...gallery} />
    </>
  );
}
