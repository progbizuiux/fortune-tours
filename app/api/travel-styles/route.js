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
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
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
