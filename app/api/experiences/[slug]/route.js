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
          /* No CDN cache here on purpose. s-maxage would park this response on
             Vercel's edge, where revalidateTag() cannot reach it, so a Strapi
             publish would not show up until that window expired. The Strapi
             call inside is already tagged and cached by the Data Cache
             (lib/strapi/client.js), so this stays fast and stays invalidatable. */
          "Cache-Control": "no-store",
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
