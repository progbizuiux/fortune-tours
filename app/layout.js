import { spartan, baloo, poppins } from "@/lib/fonts";
import { Providers } from "@/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spartan.variable} ${baloo.variable} ${poppins.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
