import { League_Spartan, Poppins } from "next/font/google";

// Neiko is the only brand font we have a local file for; it is declared as an
// @font-face in app/design-system.css and referenced by name in --font-heading.
//
// Spartan and Poppins have no local woff2 files in public/fonts, so they are
// served by next/font (League Spartan is Google's successor to the retired
// "Spartan" family). Each hook defines the CSS variable below, which
// app/layout.js applies to <html>. Drop real woff2 files into public/fonts and
// swap these for next/font/local if you license the exact brand cuts.
export const spartan = League_Spartan({
  variable: "--font-spartan",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
