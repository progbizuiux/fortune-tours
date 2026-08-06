import { League_Spartan, Baloo_2, Poppins } from "next/font/google";

// "Spartan" in the brand guide maps to League Spartan (Google's current
// successor to the deprecated "Spartan" family).
export const spartan = League_Spartan({
  variable: "--font-spartan",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Stand-in for Neiko until its real files are available — Baloo 2's rounded,
// high-x-height letterforms are the closest Google Fonts match to the
// brand's main-heading typeface.
export const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Neiko itself is not available on Google Fonts. Drop its woff2 files into
// public/fonts/neiko/ and swap the Baloo 2 import above for a
// next/font/local() call — the `font-heading` utility in globals.css already
// puts "Neiko" first in the stack, so no other code needs to change.
