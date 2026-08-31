import { z } from "zod";

// Everything the /plan-my-trip page needs that is not markup: the step map,
// the option lists, the validation schema and the localStorage draft.
//
// Deliberately separate from lib/planMyTrip.js, which backs the dark
// PlanMyTripSection embedded on the region pages. That flow asks a fixed
// destination chip; this one opens with "do you even have a destination in
// mind?" and carries a live journey summary, so the shapes differ and sharing
// one schema would mean a union of optional fields neither flow wants.

// ── Steps ────────────────────────────────────────────────────────────────
// `fields` names the schema keys a step owns — Continue validates exactly that
// slice, and a failed final submit uses it to find the step to send the
// traveller back to.
export const PLAN_STEPS = [
  {
    id: "destination",
    label: "Destination",
    fields: ["destinationMode", "destination", "datesFlexible"],
  },
  {
    id: "dates",
    label: "Dates & Duration",
    fields: ["arriving", "returning", "duration"],
  },
  {
    id: "travellers",
    label: "Travellers & Interests",
    fields: ["travellingWith", "interests"],
  },
  {
    id: "contact",
    label: "Personal Note & Contact",
    fields: ["message", "name", "email", "phone"],
  },
];

// ── Option lists ─────────────────────────────────────────────────────────
export const DESTINATION_MODE_OPTIONS = [
  "I have a destination in mind",
  "I'm open to suggestions",
];

export const FLEXIBILITY_OPTIONS = ["Yes", "No"];

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

export const OPEN_TO_SUGGESTIONS = DESTINATION_MODE_OPTIONS[1];

export const EMPTY_PLAN = {
  destinationMode: "",
  destination: "",
  datesFlexible: "",
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
// Loose where the design is loose: exact dates are optional (the duration
// answer carries that step, and "Not sure yet" is a valid answer), while the
// contact step is the one that must be real.
const PHONE_RE = /^\+?[0-9][0-9\s().-]{6,17}$/;

export const planSchema = z
  .object({
    destinationMode: z.string().min(1, "Pick one to continue."),
    destination: z.string().trim(),
    datesFlexible: z.string(),
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
    // The free-text destination is only required of someone who just said they
    // have one in mind — "open to suggestions" leaves it blank by design.
    if (
      values.destinationMode &&
      values.destinationMode !== OPEN_TO_SUGGESTIONS &&
      !values.destination
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["destination"],
        message: "Tell us where you're thinking of going.",
      });
    }
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
// refresh. Versioned key: bump it if the shape changes and stale drafts fall
// away instead of half-restoring.
const STORAGE_KEY = "fortune:plan-trip:v1";

const str = (value) => (typeof value === "string" ? value : "");

// Keep an answer only while its option still exists — after a list edit, a
// stale value would sit in the summary with nothing selected to show it, and
// the step would pass validation on an invisible answer.
const oneOf = (value, options) => (options.includes(value) ? value : "");

function sanitizeValues(raw) {
  if (typeof raw !== "object" || raw === null) return EMPTY_PLAN;
  return {
    destinationMode: oneOf(raw.destinationMode, DESTINATION_MODE_OPTIONS),
    destination: str(raw.destination),
    datesFlexible: oneOf(raw.datesFlexible, FLEXIBILITY_OPTIONS),
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

// ── Journey summary ──────────────────────────────────────────────────────
// The right-hand rail restates what has been answered so far, in the order it
// was asked. Question-shaped labels rather than field names, because the panel
// reads as a transcript of the conversation. Derived here so the component
// stays presentational and the wording lives beside the questions themselves.
export function summarizePlan(values) {
  const rows = [
    ["Destinations", values.destinationMode],
    ["where would you like to go?", values.destination],
    ["are your dates flexible", values.datesFlexible?.toLowerCase()],
    ["arriving", values.arriving],
    ["returning", values.returning],
    ["how long", values.duration],
    ["who's travelling", values.travellingWith],
    ["what inspires you", values.interests.join(", ")],
    ["your note", values.message],
    ["name", values.name],
    ["email", values.email],
    ["phone", values.phone],
  ];
  return rows
    .filter(([, value]) => value)
    .map(([label, value]) => ({ label, value }));
}
