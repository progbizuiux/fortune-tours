import { spartan, poppins } from "@/lib/fonts";
import { Providers } from "@/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getCountryParams } from "@/lib/strapi/country";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fortune Travels | Tours & Travel Boilerplate",
    template: "%s | Fortune Travels",
  },
  description:
    "A production-ready Next.js travel website boilerplate ready for Strapi CMS integration.",
  openGraph: {
    title: "Fortune Travels | Tours & Travel Boilerplate",
    description:
      "A production-ready Next.js travel website boilerplate ready for Strapi CMS integration.",
    url: siteUrl,
    siteName: "Fortune Travels",
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
