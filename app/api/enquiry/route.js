import { NextResponse } from "next/server";
import { sendEnquiryEmail } from "@/lib/mailer";

/* One endpoint for every enquiry form on the site — contact, plan-my-trip,
   package booking. Each form posts its own field values verbatim; this route
   only validates the two fields every one of them collects and forwards the
   rest to lib/mailer.js unchanged, so a new form field never needs a change
   here. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_FORM_TYPES = new Set([
  "Contact Us",
  "Plan My Trip",
  "Package Booking Enquiry",
]);

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { formType, fields, pageUrl } = body;

  if (!ALLOWED_FORM_TYPES.has(formType)) {
    return NextResponse.json(
      { success: false, error: "Unknown form type." },
      { status: 400 },
    );
  }

  if (
    !fields ||
    typeof fields !== "object" ||
    !String(fields.name ?? "").trim() ||
    !String(fields.email ?? "").trim()
  ) {
    return NextResponse.json(
      { success: false, error: "Name and email are required." },
      { status: 400 },
    );
  }

  try {
    await sendEnquiryEmail({
      formType,
      fields: pageUrl ? { ...fields, pageUrl } : fields,
      replyTo: `${fields.name} <${fields.email}>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/enquiry] failed to send enquiry email:", error);

    return NextResponse.json(
      { success: false, error: "Failed to send your enquiry. Please try again." },
      { status: 500 },
    );
  }
}
