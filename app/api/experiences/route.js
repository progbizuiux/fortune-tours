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
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
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
