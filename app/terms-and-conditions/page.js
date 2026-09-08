import Link from "next/link";
import { PolicyPage } from "@/components/common/PolicyPage";

/* A static segment, so it wins over app/[slug] in Next's route matching the
   same way /about-us and /gallery do — the region catch-all never sees it.
   Exists so the footer's "Terms and conditions" link resolves instead of
   404ing; replace the placeholder copy with the real terms. */
export const metadata = {
  title: "Terms and Conditions",
  description:
    "The terms and conditions for using the Fortune Tours & Travels website and services.",
};

export default function TermsAndConditionsPage() {
  return (
    <PolicyPage title="Terms and Conditions">
      <p>
        These are the terms and conditions for using the Fortune Tours &amp;
        Travels website and booking our travel services.
      </p>
      <p>
        Our full terms are being finalised. In the meantime, if you have any
        questions about bookings, payments, or cancellations, please{" "}
        <Link href="/contact" className="text-sky underline">
          get in touch
        </Link>{" "}
        and our team will be glad to help.
      </p>
    </PolicyPage>
  );
}
