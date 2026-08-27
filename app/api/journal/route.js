import { getHomePage } from "@/lib/strapi/home";
import { NextResponse } from "next/server";

/* API endpoint to fetch journal section from home page
   GET /api/journal - returns normalized journal section data */
export async function GET() {
  try {
    const homePage = await getHomePage();
    const journalData = homePage?.journal;

    return NextResponse.json(
      {
        success: true,
        data: journalData || {},
        message: journalData ? "Journal section fetched successfully" : "No journal data available",
      },
      {
        status: 200,
        headers: {
          /* NOT `s-maxage`: that parks the JSON in Vercel's edge CDN, which
             revalidateTag() cannot purge — only the TTL or a redeploy clears
             it, which is what kept published Strapi content off the live
             site. The Strapi read underneath is still Data-Cached and tagged,
             so this costs no extra round trip. */
          "Cache-Control": "no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching journal section:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch journal section",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
