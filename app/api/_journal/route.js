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
