import { getTravelStyles } from "@/lib/strapi/travel-styles";
import { NextResponse } from "next/server";

/* API endpoint to fetch travel styles from Strapi
   GET /api/travel-styles - returns normalized travel styles for the carousel */
export async function GET() {
  try {
    const travelStyles = await getTravelStyles();

    return NextResponse.json(
      {
        success: true,
        data: travelStyles || [],
        message: travelStyles ? "Travel styles fetched successfully" : "No travel styles available",
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
    console.error("Error fetching travel styles:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch travel styles",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
