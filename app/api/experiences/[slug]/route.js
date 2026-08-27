import { getExperience } from "@/lib/strapi/experiences";
import { NextResponse } from "next/server";

/* API endpoint to fetch individual experience by slug
   GET /api/experiences/[slug] - returns normalized experience data */
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing slug parameter",
        },
        { status: 400 }
      );
    }

    const experience = await getExperience(slug);

    if (!experience) {
      return NextResponse.json(
        {
          success: false,
          error: "Experience not found",
          slug,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: experience,
        message: `Experience "${slug}" fetched successfully`,
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
    console.error("Error fetching experience:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch experience",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
