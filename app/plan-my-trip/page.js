import { PlanTripWizard } from "@/components/plan-my-trip/PlanTripWizard";
import { getDestinations } from "@/lib/strapi/search";

/* ISR on the same terms as the rest of the app — must be a literal so Next can
   read it statically at build time. The page fetches the destination pictures
   below, so it can no longer be fully static. */
export const revalidate = 3600;

export const metadata = {
  title: "Plan My Trip | Craft Your Unique Journey",
  description:
    "Tell us where you're dreaming of going, how you like to travel and what you want to experience. Our travel designers shape the journey around you.",
};

export default async function PlanMyTripPage() {
  /* Every destination the site covers, for the "where would you like to go?"
     autocomplete and for the "Your journey" rail (which shows the chosen
     place's own photograph). `?? []` on failure: the wizard falls back to no
     suggestions and its own neutral rail image, so a CMS that is down or
     forbidden costs the live pictures, not the page. */
  const destinations = await getDestinations().catch(() => []);

  return (
    <>
      {/* The page opens on the form rather than a hero, so the navbar has to
          be solid from the first pixel — this is the marker Navbar resolves
          (see components/layout/Navbar.jsx). Without it the bar stays in its
          over-the-hero treatment: white type on the cream page. */}
      <div data-navbar-solid-from aria-hidden="true" />
      <PlanTripWizard destinations={destinations} />
    </>
  );
}
