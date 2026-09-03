import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  /* Editors link to /itinerary throughout the CMS — hero CTAs, every package
     card's "View Itinerary", the packages section button — but no such route
     was ever built; the trip planner at /plan-my-trip is that page. One
     redirect here fixes every one of those links without touching content,
     and keeps working when /itinerary is typed by hand. */
  async redirects() {
    return [
      { source: "/itinerary", destination: "/plan-my-trip", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
