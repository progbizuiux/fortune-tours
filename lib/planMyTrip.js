import { z } from "zod";

// Everything the plan-my-trip wizard needs that is not markup: the step map,
// the option lists, the validation schema and the localStorage draft. Kept out
// of the component so the section file stays renderable top-to-bottom and the
// backend submission (coming later) can import the same schema server-side.

// ── Steps ────────────────────────────────────────────────────────────────
// `fields` names the schema keys a step owns — Continue validates exactly
// that slice, and a failed final submit uses it to find which step to send
// the traveller back to.
export const PLAN_STEPS = [
  { id: "destination", label: "Destination", fields: ["destination"] },
  {
    id: "duration",
    label: "Duration",
    fields: ["arriving", "returning", "duration"],
  },
  {
    id: "travellers",
    label: "Travellers & Interests",
    fields: ["travellingWith", "interests"],
  },
  {
    id: "contact",
    label: "Personal Note & Contact details",
    fields: ["message", "name", "email", "phone"],
  },
];

// ── Option lists ─────────────────────────────────────────────────────────
export const DESTINATION_OPTIONS = [
  "Kenya",
  "Tanzania",
  "Morocco",
  "Egypt",
  "South Africa",
  "Seychelles",
  "I'm open to suggestions",
];

export const DURATION_OPTIONS = [
  "3–5 days",
  "6–9 days",
  "10–14 days",
  "15+ days",
  "Not sure yet",
];

export const TRAVELLER_OPTIONS = [
  "Solo",
  "Couple",
  "Family",
  "Friends",
  "Honeymoon",
];

export const INTEREST_OPTIONS = [
  "Safari & Wildlife",
  "Adventure",
  "Culture & Heritage",
  "Beach",
  "Food & Local Life",
  "Luxury & Wellness",
];

export const EMPTY_PLAN = {
  destination: "",
  arriving: "",
  returning: "",
  duration: "",
  travellingWith: "",
  interests: [],
  message: "",
  name: "",
  email: "",
  phone: "",
};

// ── Validation ───────────────────────────────────────────────────────────
// Loose on purpose where the design is loose: dates are optional (the
// duration chips carry that step, and "Not sure yet" is a valid answer),
// while contact details are the one step that must be real.
const PHONE_RE = /^\+?[0-9][0-9\s().-]{6,17}$/;

export const planSchema = z
  .object({
    destination: z
      .string()
      .min(1, "Choose a destination — or “I'm open to suggestions”."),
    arriving: z.string(),
    returning: z.string(),
    duration: z.string().min(1, "Pick a duration — “Not sure yet” works too."),
    travellingWith: z.string().min(1, "Tell us who's travelling."),
    interests: z
      .array(z.string())
      .min(1, "Pick at least one thing that inspires you."),
    message: z.string().max(2000, "Please keep it under 2000 characters."),
    name: z.string().trim().min(2, "Please enter your name."),
    email: z.email("Enter a valid email address."),
    phone: z
      .string()
      .trim()
      .regex(PHONE_RE, "Enter a valid phone or WhatsApp number."),
  })
  .superRefine((values, ctx) => {
    // yyyy-mm-dd from <input type="date"> compares correctly as a string.
    if (
      values.arriving &&
      values.returning &&
      values.returning < values.arriving
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["returning"],
        message: "The return date can't be before arrival.",
      });
    }
  });

// ── Draft persistence ────────────────────────────────────────────────────
// The whole draft — answers plus the step the traveller was on — survives a
// refresh. Versioned key: bump it if the shape changes and stale drafts just
// fall away instead of half-restoring.
const STORAGE_KEY = "fortune:plan-my-trip:v1";

const str = (value) => (typeof value === "string" ? value : "");

// Keep an answer only while its chip still exists — after an option list
// edit, a stale value would otherwise be silently selected with no chip
// showing it, and the step would pass validation on an invisible answer.
const oneOf = (value, options) => (options.includes(value) ? value : "");

function sanitizeValues(raw) {
  if (typeof raw !== "object" || raw === null) return EMPTY_PLAN;
  return {
    destination: oneOf(raw.destination, DESTINATION_OPTIONS),
    arriving: str(raw.arriving),
    returning: str(raw.returning),
    duration: oneOf(raw.duration, DURATION_OPTIONS),
    travellingWith: oneOf(raw.travellingWith, TRAVELLER_OPTIONS),
    interests: Array.isArray(raw.interests)
      ? raw.interests.filter((item) => INTEREST_OPTIONS.includes(item))
      : [],
    message: str(raw.message),
    name: str(raw.name),
    email: str(raw.email),
    phone: str(raw.phone),
  };
}

// Every storage call is wrapped: localStorage throws in private windows and
// when the quota is gone, and a draft is never worth crashing the form over.
export function loadPlanDraft() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const step = Number.isInteger(parsed?.step)
      ? Math.min(Math.max(parsed.step, 0), PLAN_STEPS.length - 1)
      : 0;
    return { step, values: sanitizeValues(parsed?.values) };
  } catch {
    return null;
  }
}

export function savePlanDraft(draft) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Nothing to do — the form still works, it just won't survive a refresh.
  }
}

export function clearPlanDraft() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignored for the same reason as above.
  }
}
