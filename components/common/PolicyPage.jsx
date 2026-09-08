import { Container } from "@/components/common/Container";

/* The shell for the site's plain policy pages (Terms, Privacy). These exist so
   the footer's "Terms and conditions" and "Privacy Policy" links land on a real
   page instead of a 404. The copy is an honest holding page — it says the full
   policy is being finalised and points to Contact — NOT fabricated legal text;
   replace `children` with the real policy when it is ready. */
export function PolicyPage({ title, children }) {
  return (
    <>
      {/* Opens on the page's own light ground with no hero, so the navbar has
          to be solid from the first pixel — the marker the bar resolves (see
          components/layout/Navbar.jsx), same as /gallery and /plan-my-trip. */}
      <div data-navbar-solid-from aria-hidden="true" />
      <section className="bg-cream pt-20 text-black">
        <Container className="py-16 md:py-24 2xl:py-28">
          <div className="max-w-3xl">
            <h1 className="font-heading text-navy text-[34px] leading-[1.08] font-normal tracking-[-0.01em] sm:text-[44px] md:text-[54px]">
              {title}
            </h1>
            <div className="mt-8 space-y-5 font-sans text-[15px] leading-relaxed font-light text-black/70 sm:mt-10 md:text-[18px]">
              {children}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
