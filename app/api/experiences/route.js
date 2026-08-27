import { getExperiences } from "@/lib/strapi/experiences";
import { NextResponse } from "next/server";

/* API endpoint to fetch all experiences
   GET /api/experiences - returns list of all normalized experiences */
export async function GET() {
  try {
    const experiences = await getExperiences();

    return NextResponse.json(
      {
        success: true,
        data: experiences || [],
        count: experiences?.length || 0,
        message: experiences?.length
          ? `${experiences.length} experiences fetched successfully`
          : "No experiences available",
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
    console.error("Error fetching experiences:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch experiences",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
