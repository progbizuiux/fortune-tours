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
