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
