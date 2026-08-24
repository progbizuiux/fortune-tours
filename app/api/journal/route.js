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
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
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
