import { spartan, poppins } from "@/lib/fonts";
import { Providers } from "@/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getCountryParams } from "@/lib/strapi/country";
import "./globals.css";

/* The public site, fortunetours.in, unless the environment names another (the
   dev deployment sets fortunedev.progbiz.in). It is the base every canonical
   and Open Graph URL resolves against, so the fallback must be the real
   domain rather than localhost — a build without the variable was stamping
   localhost into the live site's metadata. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fortunetours.in";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fortune Tours & Travels | Custom Journeys from Kerala",
    template: "%s | Fortune Tours & Travels",
  },
  description:
    "Custom journeys, curated holidays, and bespoke travel experiences crafted with local expertise from Kerala.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Fortune Tours & Travels | Custom Journeys from Kerala",
    description:
      "Custom journeys, curated holidays, and bespoke travel experiences crafted with local expertise from Kerala.",
    url: siteUrl,
    siteName: "Fortune Tours & Travels",
    type: "website",
  },
};

export default async function RootLayout({ children }) {
  /* Which country pages exist, for the navbar's Destinations sheet: a row
     links to its own page only where Strapi has one, and to its region
     otherwise — see resolveCountryHref() in lib/navigation.js. One tagged,
     cached request shared with /destinations/a-z, and never a reason for the
     shell to fail: an unreachable Strapi degrades every row to its region. */
  const publishedCountries = await getCountryParams().catch(() => []);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spartan.variable} ${poppins.variable}`}
    >
      {/* Extensions write their own attributes onto <body> before React
          hydrates (ColorZilla's cz-shortcut-listen, Grammarly's data-gr-*),
          which reads as a hydration mismatch. suppressHydrationWarning only
          applies one level deep, so the one on <html> above does not cover
          this element — it needs its own. Scoped to this element's
          attributes; mismatches inside the tree still surface. */}
      <body
        className="flex min-h-screen flex-col antialiased"
        suppressHydrationWarning
      >
        <Providers>
          <Navbar publishedCountries={publishedCountries} />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
