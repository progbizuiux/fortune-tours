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
    <footer className="bg-black text-white">
      <Container className="py-16 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              aria-label="Fortune Tours & Travels — Home"
              className="w-fit"
            >
              <Image
                src="/fortune_Logo_White.png"
                alt="Fortune Tours & Travels"
                width={160}
                height={56}
                className="object-contain"
              />
            </Link>

            <p className="max-w-xs text-small leading-relaxed text-white/70">
              An editorial travel house. Cinematic journeys, quietly curated
              since 1998.
            </p>

            <ul className="mt-2 flex items-center gap-8">
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
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <li className="font-heading text-body text-white">
                Quick Links :
              </li>
              {QUICK_LINKS.map((link, index) => (
                <li key={link.href} className="flex items-center gap-4">
                  {/* Hidden below sm: the row wraps there, which would strand
                      a divider at the start of a new line. */}
                  {index > 0 && (
                    <span
                      className="hidden h-4 w-px bg-white/25 sm:block"
                      aria-hidden="true"
                    />
                  )}
                  <Link
                    href={link.href}
                    className="text-small text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {OFFICES.map((office) => (
            <div key={office.name} className="flex flex-col gap-3">
              <h3 className="font-heading text-h4 text-white">{office.name}</h3>
              <a
                href={`tel:${office.phone.replace(/\s/g, "")}`}
                className="text-small text-white/70 transition-colors hover:text-white"
              >
                {office.phone}
              </a>
              <address className="text-small leading-relaxed text-white/60 not-italic">
                {office.address}
              </address>
            </div>
          ))}
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-white/60">
            © {year} Fortune Tours &amp; Travels. All journeys reserved.
          </p>
          <p className="text-small text-white/60">
            Est. 1998 — India · Worldwide
          </p>
        </Container>
      </div>
    </footer>
  );
}
