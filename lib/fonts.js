import { League_Spartan, Poppins } from "next/font/google";

// "Spartan" in the brand guide maps to League Spartan (Google's current
// successor to the deprecated "Spartan" family).
export const spartan = League_Spartan({
  variable: "--font-spartan",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Neiko is not available on Google Fonts. Drop its woff2 files into
// public/fonts/neiko/ and swap this for a next/font/local() call — the
// --font-neiko variable is already wired through globals.css and Tailwind's
// `font-heading` utility, so no other code needs to change.
