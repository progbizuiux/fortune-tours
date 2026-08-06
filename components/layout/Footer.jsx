import Link from "next/link";
import { Plane, Mail, Phone, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { Container } from "@/components/common/Container";

const QUICK_LINKS = [
  { label: "About", href: "/about" },
  { label: "Destinations", href: "/destinations" },
  { label: "Tours", href: "/tours" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "Twitter", href: "https://twitter.com", icon: FaXTwitter },
  { label: "YouTube", href: "https://youtube.com", icon: FaYoutube },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-navy/10 bg-cream dark:border-cream/10 dark:bg-navy border-t">
      <Container className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="font-heading text-navy dark:text-cream flex items-center gap-2 text-xl"
          >
            <Plane className="text-sky size-6" aria-hidden="true" />
            Fortune Travels
          </Link>
          <p className="text-navy/70 dark:text-cream/70 text-sm">
            Curated journeys and unforgettable adventures to the world&apos;s
            most breathtaking destinations.
          </p>
        </div>

        <div>
          <h3 className="font-top text-navy dark:text-cream mb-4 text-sm font-semibold tracking-wider uppercase">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-3">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-navy/70 hover:text-sky dark:text-cream/70 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-top text-navy dark:text-cream mb-4 text-sm font-semibold tracking-wider uppercase">
            Contact
          </h3>
          <ul className="text-navy/70 dark:text-cream/70 flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="text-sky size-4 shrink-0" aria-hidden="true" />
              123 Travel Street, Wander City
            </li>
            <li className="flex items-center gap-2">
              <Phone className="text-sky size-4 shrink-0" aria-hidden="true" />
              +1 (555) 123-4567
            </li>
            <li className="flex items-center gap-2">
              <Mail className="text-sky size-4 shrink-0" aria-hidden="true" />
              hello@fortunetravels.com
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-top text-navy dark:text-cream mb-4 text-sm font-semibold tracking-wider uppercase">
            Follow Us
          </h3>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="bg-navy/10 text-navy hover:bg-sky dark:bg-cream/10 dark:text-cream inline-flex size-10 items-center justify-center rounded-full transition-colors hover:text-white"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-navy/10 dark:border-cream/10 border-t py-6">
        <Container>
          <p className="text-navy/60 dark:text-cream/60 text-center text-sm">
            © {year} Fortune Travels. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
