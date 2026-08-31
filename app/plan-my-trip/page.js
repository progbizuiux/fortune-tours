import { PlanTripWizard } from "@/components/plan-my-trip/PlanTripWizard";

export const metadata = {
  title: "Plan My Trip | Craft Your Unique Journey",
  description:
    "Tell us where you're dreaming of going, how you like to travel and what you want to experience. Our travel designers shape the journey around you.",
};

export default function PlanMyTripPage() {
  return (
    <>
      {/* The page opens on the form rather than a hero, so the navbar has to
          be solid from the first pixel — this is the marker Navbar resolves
          (see components/layout/Navbar.jsx). Without it the bar stays in its
          over-the-hero treatment: white type on the cream page. */}
      <div data-navbar-solid-from aria-hidden="true" />
      <PlanTripWizard />
    </>
  );
}
