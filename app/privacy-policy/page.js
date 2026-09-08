import Link from "next/link";
import { PolicyPage } from "@/components/common/PolicyPage";

/* A static segment, so it wins over app/[slug] in Next's route matching the
   same way /about-us and /gallery do — the region catch-all never sees it.
   Exists so the footer's "Privacy Policy" link resolves instead of 404ing;
   replace the placeholder copy with the real policy. */
export const metadata = {
  title: "Privacy Policy",
  description:
    "How Fortune Tours & Travels collects, uses and protects the information you share with us.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Privacy Policy">
      <p>
        Fortune Tours &amp; Travels respects your privacy and is committed to
        protecting the personal information you share with us when planning your
        journey.
      </p>
      <p>
        Our detailed privacy policy is being finalised. In the meantime, if you
        have any questions about how we collect, use, or safeguard your
        information, please{" "}
        <Link href="/contact" className="text-sky underline">
          get in touch
        </Link>{" "}
        and our team will be glad to help.
      </p>
    </PolicyPage>
  );
}
