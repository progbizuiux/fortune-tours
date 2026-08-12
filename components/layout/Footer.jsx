import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa6";
import { Container } from "@/components/common/Container";

const QUICK_LINKS = [
  { label: "Terms and conditions", href: "/terms-and-conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Gallery", href: "/gallery" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "YouTube", href: "https://youtube.com", icon: FaYoutube },
];

const OFFICES = [
  {
    name: "Corporate Office",
    phone: "+91 9656 211 888",
    address:
      "Mannamthara Tower, Paramara Rd, Ernakulam North, Ernakulam, Kerala 682018",
  },
  {
    name: "Branch Office",
    phone: "+91 9656 211 888",
    address:
      "6th Floor, KG Oxford Business Center, Sreekandath Road, Perumanoor, Kochi, 682016",
  },
  {
    name: "Trivandrum",
    phone: "+91 7558 887 711",
    address:
      "2nd floor, Annas Arcade, Spencer Junction, M.G Road, Trivandrum – 695 001",
  },
  {
    name: "Thrissur",
    phone: "+91 9656 211 888",
    address:
      "St Antony's Tower, Fathima Nagar, East Fort, Nellikunnu, Thrissur, Kerala 680005",
  },
  {
    name: "Kannur",
    phone: "+91 8156 911 888",
    address:
      "KZN.11/39. E2, 1st Floor, Umbai Tower, Opp. Training School, Civil Station, Kannur-670002.",
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-black text-white">
      <Container className="py-16 lg:py-20">
        <div className="flex flex-col gap-12 max-sm:gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-sm:flex-row max-sm:items-start max-sm:justify-between flex-col gap-6">
            <Link
              href="/"
              aria-label="Fortune Tours & Travels — Home"
              className="w-fit max-sm:shrink-0"
            >
              <Image
                src="/fortune_Logo_White.png"
                alt="Fortune Tours & Travels"
                width={160}
                height={56}
                className="object-contain max-sm:w-[93px] max-sm:h-[34px]"
              />
            </Link>

            <p className="max-w-xs text-small leading-relaxed text-white/70 max-sm:text-[11px] max-sm:leading-[120%] max-sm:text-right max-sm:font-light max-sm:w-[228px]">
              An editorial travel house. Cinematic journeys, quietly curated
              since 1998.
            </p>

            <ul className="mt-2 flex items-center gap-8 max-sm:hidden">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex text-white/80 transition-colors hover:text-white"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Offset at lg so the row lines up with the tagline rather than
              the wordmark, matching the design. */}
          <nav aria-label="Quick links" className="lg:mt-15">
            <ul className="flex max-sm:flex-row max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden flex-wrap items-center gap-x-4 max-sm:gap-x-2 gap-y-2">
              <li className="font-heading text-body text-white max-sm:text-[12px] max-sm:font-normal max-sm:whitespace-nowrap">
                Quick Links :
              </li>
              {QUICK_LINKS.map((link, index) => (
                <li key={link.href} className="flex items-center gap-4 max-sm:gap-2 max-sm:whitespace-nowrap">
                  {index > 0 && (
                    <span
                      className="h-4 max-sm:h-3 w-px bg-white/25 block"
                      aria-hidden="true"
                    />
                  )}
                  <Link
                    href={link.href}
                    className="text-small text-white/70 transition-colors hover:text-white max-sm:text-[12px] max-sm:font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-20 max-sm:mt-10 grid grid-cols-2 gap-10 max-sm:gap-x-4 max-sm:gap-y-8 lg:grid-cols-5">
          {OFFICES.map((office) => (
            <div key={office.name} className="flex flex-col gap-3 max-sm:gap-2">
              <h3 className="font-heading text-h4 text-white max-sm:text-[13px] max-sm:font-normal">{office.name}</h3>
              <a
                href={`tel:${office.phone.replace(/\s/g, "")}`}
                className="text-small text-white/70 transition-colors hover:text-white max-sm:text-[12px] max-sm:font-light"
              >
                {office.phone}
              </a>
              <address className="text-small leading-relaxed text-white/60 not-italic max-sm:text-[11.3px] max-sm:leading-[150%] max-sm:font-light">
                {office.address}
              </address>
            </div>
          ))}
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex max-sm:flex-row max-sm:items-center max-sm:justify-between flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-white/60 max-sm:text-[10px] max-sm:font-light max-sm:leading-[24px]">
            © {year} Fortune Tours &amp; Travels. All journeys reserved.
          </p>
          <p className="text-small text-white/60 max-sm:hidden">
            Est. 1998 — India · Worldwide
          </p>
          
          <ul className="flex items-center gap-4 sm:hidden">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex text-white transition-colors"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
