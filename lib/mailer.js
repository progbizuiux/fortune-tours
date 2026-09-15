import nodemailer from "nodemailer";

/* Every enquiry on the site — contact, plan-my-trip, package booking — ends up
   here. One transporter and one email layout, so a new form only has to
   supply its field values and does not have to know how the email gets sent
   or built. Server-only: never import this from a "use client" component. */

const DEFAULT_TO_EMAIL = "info@fortunetours.com";

/* Human labels for the field keys the forms send. A key with no entry here
   still renders — formatLabel() falls back to spacing out its camelCase —
   this only exists to fix the handful that don't camelCase into the label the
   form actually shows (e.g. "phone" -> "Phone / WhatsApp"). */
const FIELD_LABELS = {
  name: "Name",
  email: "Email",
  phone: "Phone / WhatsApp",
  interest: "Interest",
  message: "Message",
  destinationMode: "Destination Mode",
  destination: "Destination",
  datesFlexible: "Dates Flexible",
  arriving: "Arriving",
  returning: "Returning",
  duration: "Duration",
  travellingWith: "Travelling With",
  groupSize: "Group Size",
  interests: "Interests",
  date: "Preferred Date",
  packageName: "Package",
  pageUrl: "Page URL",
};

let transporter;

/* Built lazily so a misconfigured server fails on the first real send (with a
   clear error) rather than at import time, which would take the whole route
   module down for every request including ones that never send mail. */
function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "Email is not configured: set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS.",
    );
  }

  const port = Number(SMTP_PORT) || 587;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE === "true" || port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    // Without these, a host that silently drops the connection (a blocked
    // outbound port, a firewall) hangs the request forever instead of
    // failing — the traveller's submit button would spin indefinitely.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  });

  return transporter;
}

function formatLabel(key) {
  return (
    FIELD_LABELS[key] ??
    key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase())
  );
}

function hasValue(value) {
  if (value === undefined || value === null || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function displayValue(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char],
  );
}

function fieldsToHtmlRows(fields) {
  return Object.entries(fields)
    .filter(([, value]) => hasValue(value))
    .map(([key, value]) => {
      const label = escapeHtml(formatLabel(key));
      const display = escapeHtml(displayValue(value)).replace(/\n/g, "<br/>");
      return `<tr><td style="padding:8px 12px;border:1px solid #e5e5e5;font-weight:600;background:#fafaf9;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:8px 12px;border:1px solid #e5e5e5;">${display}</td></tr>`;
    })
    .join("");
}

function fieldsToText(fields) {
  return Object.entries(fields)
    .filter(([, value]) => hasValue(value))
    .map(([key, value]) => `${formatLabel(key)}: ${displayValue(value)}`)
    .join("\n");
}

/**
 * Sends one enquiry email to the Fortune Tours inbox, built from whatever
 * fields the calling form collected.
 *
 * @param {{ formType: string, fields: Record<string, unknown>, replyTo?: string }} params
 */
export async function sendEnquiryEmail({ formType, fields, replyTo }) {
  const toEmail = process.env.ENQUIRY_TO_EMAIL || DEFAULT_TO_EMAIL;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
      <h2 style="margin:0 0 16px;font-size:18px;">New enquiry &mdash; ${escapeHtml(formType)}</h2>
      <table style="border-collapse:collapse;width:100%;max-width:640px;">
        ${fieldsToHtmlRows(fields)}
      </table>
    </div>
  `;

  const text = `New enquiry — ${formType}\n\n${fieldsToText(fields)}`;

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    replyTo,
    subject: `Fortune Tours website enquiry — ${formType}`,
    text,
    html,
  });
}
