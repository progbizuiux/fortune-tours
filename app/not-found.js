"use client";

import Link from "next/link";
import { Container } from "@/components/common/Container";

/* The 404 page. Next renders this for any unmatched route and for every
   notFound() call one level up — the destination / package / country readers
   all fall through to it when the CMS has no entry.

   Built to the reference 404 design: centred gold "404" · condensed headline ·
   pink "Enquire Now" pill, then a left-aligned "try the following" block on a
   white ground. Client component only so the "Back" control can step the
   browser history; everything else is static. */
export default function NotFound() {
  return (
    <>
      {/* Opens on a light ground with no hero, so the navbar must be solid from
          the first pixel — same marker /gallery, /plan-my-trip and the policy
          pages use (resolved in components/layout/Navbar.jsx). */}
      <div data-navbar-solid-from aria-hidden="true" />

      <section className="bg-white pt-20">
        <Container className="flex flex-col items-center py-20 text-center md:py-28 2xl:py-32">
          <span className="font-heading text-[20px] italic tracking-wide text-[#b89a5c] md:text-[22px]">
            404
          </span>

          <h1 className="mt-4 font-heading uppercase leading-[0.95] tracking-[-0.01em] text-navy text-[clamp(2rem,5vw,3.75rem)]">
            Page Not Found
          </h1>

          <Link
            href="/contact"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-none bg-sky px-7 font-top text-small font-medium uppercase tracking-wider text-white transition-colors duration-200 hover:bg-[#0089b8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
          >
            Enquire Now
          </Link>

          <div className="mt-16 max-w-xl text-left font-sans text-small font-light leading-relaxed text-charcoal/80 md:mt-20">
            <p>
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>

            <p className="mt-6">Please try the following:</p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Check your spelling</li>
              <li>
                Return to the{" "}
                <Link
                  href="/"
                  className="underline underline-offset-4 transition-colors hover:text-navy"
                >
                  Home
                </Link>{" "}
                page
              </li>
              <li>
                Click the{" "}
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="cursor-pointer underline underline-offset-4 transition-colors hover:text-navy"
                >
                  Back
                </button>{" "}
                button
              </li>
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
