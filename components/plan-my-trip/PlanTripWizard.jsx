"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Container } from "@/components/common/Container";
import {
  DESTINATION_MODE_OPTIONS,
  DURATION_OPTIONS,
  EMPTY_PLAN,
  FLEXIBILITY_OPTIONS,
  GROUP_SIZE_OPTIONS,
  GROUP_TRAVELLERS,
  INTEREST_OPTIONS,
  OPEN_TO_SUGGESTIONS,
  PLAN_STEPS,
  TRAVELLER_OPTIONS,
  clearPlanDraft,
  loadPlanDraft,
  planSchema,
  savePlanDraft,
  summarizePlan,
} from "@/lib/planTrip";
import { cn } from "@/lib/utils";

/* The standalone /plan-my-trip wizard — the light treatment: cream page, black
   type, a form column on the left and a live "Your journey" rail on the right.
   Four steps live in one form; Continue validates only the leaving step's
   slice of the schema, and the whole draft — answers plus the current step —
   survives a refresh through localStorage (lib/planTrip.js).

   The dark PlanMyTripSection is a different design for a different placement
   (in-flow on the region pages) and stays as it is. */

const RAIL_IMAGE = "/destinations/kerala/houseboat-alappuzha.jpg";

/* Underline treatment shared by every free-text field on the form. */
const INPUT_CLASSES =
  "w-full border-b border-black/25 bg-transparent pb-3 text-body font-light text-black transition-colors placeholder:text-black/35 focus:border-black focus:outline-none";

/* Small uppercase field label — Spartan, wide tracking, the caps line that
   sits above every answer group in the design. The tracking is eased off below
   sm: at 0.18em a label like "ARE YOUR DATES FLEXIBLE?" runs past 375px and
   wraps mid-phrase. */
const LABEL_CLASSES =
  "font-top text-[11px] font-light tracking-[0.12em] text-black/45 uppercase sm:tracking-[0.18em]";

/* The question at the top of each step. Pinned rather than left to the h3
   token (clamp 24→32px): the design sets these smaller than a section heading,
   and the longest of them — "Who Is Travelling, and What Draws You?" — needs
   the phone size to stay on two lines. */
const STEP_TITLE_CLASSES =
  "text-[20px] leading-[1.3] sm:text-[22px] xl:text-[24px]";

/* A checkbox-shaped answer. The square fills solid black once chosen — the
   design's one selection cue, so it carries aria-pressed for screen readers
   rather than leaving the state to colour alone. Single- and multi-select
   share it: the caller owns the semantics, this just renders state. */
function OptionBox({ label, active, onToggle, className }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={cn(
        // Sizes to its label at every width — the labels run from "Solo" to
        // "I have a destination in mind", so a fixed width would either clip
        // the long ones or strand the short ones.
        "inline-flex min-h-11 max-w-full cursor-pointer items-center gap-2.5 border px-3.5 py-3 text-left text-[14px] font-light text-black transition-colors sm:gap-3 sm:px-4 sm:text-[15px]",
        "focus-visible:outline-sky focus-visible:outline-2 focus-visible:outline-offset-2",
        active ? "border-black" : "border-black/20 hover:border-black/50",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-[13px] shrink-0 border transition-colors",
          active ? "border-black bg-black" : "border-black/40",
        )}
      />
      {label}
      
    </button>
  );
}

/* One answer group: the caps label, its options or field, and the group-level
   error read with it through aria-describedby. */
function Group({ id, label, error, className, children }) {
  return (
    <div className={className}>
      <p id={id} className={LABEL_CLASSES}>
        {label}
      </p>
      <div
        role="group"
        aria-labelledby={id}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-3"
      >
        {children}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-3 text-[13px] text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* Label-above-underline wrapper for the date/contact inputs. */
function Field({ id, label, error, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
      </label>
      <div className="mt-3">{children}</div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-[13px] text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function PlanTripWizard({
  eyebrow = "Plan my trip",
  title = "Craft your unique journey.",
  railTitle = "Your journey",
  railCaption = "Every journey begins with a single question.",
  railImage = RAIL_IMAGE,
  successMessage = "Your journey brief is with our travel designers. Expect personalised recommendations from a real person — usually within a day, always with no obligation.",
}) {
  const steps = PLAN_STEPS;
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [submittedName, setSubmittedName] = useState(null);
  // Set after mount: rendering new Date() would differ between the server pass
  // and hydration around midnight/timezones.
  const [today, setToday] = useState("");

  const formRef = useRef(null);
  const stepPanelRef = useRef(null);
  const stepRef = useRef(step);
  const persistTimer = useRef(null);
  const isFirstStepEffect = useRef(true);
  const isSubmittedRef = useRef(false);
  // Distinguishes step changes the traveller made (Continue/Back — scroll and
  // focus follow) from the silent draft restore on mount, which must not yank
  // the page around on load.
  const userNavRef = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: EMPTY_PLAN,
    mode: "onTouched",
  });

  const values = watch();
  const {
    destinationMode,
    datesFlexible,
    duration,
    travellingWith,
    interests,
    arriving,
  } = values;

  const hasDestinationInMind =
    destinationMode && destinationMode !== OPEN_TO_SUGGESTIONS;
  const isLastStep = step === steps.length - 1;
  const submitted = submittedName !== null;
  const summary = summarizePlan(values);

  /* ── Draft restore & persistence ────────────────────────────────────── */

  // Restore once on mount — reset() rather than defaultValues so the server
  // render and hydration agree on the empty form first.
  useEffect(() => {
    setToday(format(new Date(), "yyyy-MM-dd"));
    const draft = loadPlanDraft();
    if (draft) {
      reset({ ...EMPTY_PLAN, ...draft.values });
      setStep(draft.step);
    }
  }, [reset]);

  // Answers save as they change, debounced so typing the message field is not
  // a write per keystroke.
  useEffect(() => {
    const subscription = watch((next) => {
      if (isSubmittedRef.current) return;
      clearTimeout(persistTimer.current);
      persistTimer.current = setTimeout(
        () => savePlanDraft({ step: stepRef.current, values: next }),
        250,
      );
    });
    return () => {
      clearTimeout(persistTimer.current);
      subscription.unsubscribe();
    };
  }, [watch]);

  // Step changes save immediately. When the traveller drove the change, focus
  // also lands on the new panel so keyboard and screen-reader users continue
  // where the content restarted. The mount run is skipped — it would overwrite
  // a stored draft with step 0.
  useEffect(() => {
    stepRef.current = step;
    if (isFirstStepEffect.current) {
      isFirstStepEffect.current = false;
      return;
    }
    savePlanDraft({ step, values: getValues() });
    if (userNavRef.current) {
      userNavRef.current = false;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      formRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      stepPanelRef.current?.focus({ preventScroll: true });
    }
  }, [step, getValues]);

  /* ── Navigation & submit ────────────────────────────────────────────── */

  function goToStep(next) {
    userNavRef.current = true;
    setDirection(next > stepRef.current ? "forward" : "back");
    setStep(next);
  }

  function selectSingle(field, value) {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
  }

  function selectDestinationMode(value) {
    selectSingle("destinationMode", value);
    // Switching to "open to suggestions" hides the free-text field, so the
    // answer behind it goes too — otherwise it would keep showing in the rail
    // with nothing on screen to change it.
    if (value === OPEN_TO_SUGGESTIONS) {
      setValue("destination", "", { shouldValidate: true, shouldDirty: true });
    }
  }

  function toggleInterest(value) {
    const next = interests.includes(value)
      ? interests.filter((item) => item !== value)
      : [...interests, value];
    setValue("interests", next, { shouldValidate: true, shouldDirty: true });
  }

  function handleFinalSubmit(finalValues) {
    // TODO(backend): POST `finalValues` to the enquiry endpoint (lib/axios.js)
    // once it exists — until then the brief ends client-side by design.
    // The pending debounced save must die with the draft, or the keystrokes
    // that filled the last field write it straight back 250ms from now.
    isSubmittedRef.current = true;
    clearTimeout(persistTimer.current);
    clearPlanDraft();
    setSubmittedName(finalValues.name.trim().split(/\s+/)[0]);
    toast.success("Your journey brief is on its way.");
  }

  // A final submit that fails on a field from an earlier step (possible if a
  // stored draft was tampered with) sends the traveller to that step instead
  // of failing silently behind the current one.
  function handleInvalidSubmit(formErrors) {
    const failed = steps.findIndex((planStep) =>
      planStep.fields.some((field) => formErrors[field]),
    );
    if (failed !== -1 && failed !== step) goToStep(failed);
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (isLastStep) {
      handleSubmit(handleFinalSubmit, handleInvalidSubmit)(event);
      return;
    }
    // Continue validates only this step's slice of the schema.
    const valid = await trigger(steps[step].fields, { shouldFocus: true });
    if (valid) goToStep(step + 1);
  }

  /* ── Render ─────────────────────────────────────────────────────────── */

  const stepNumber = String(step + 1).padStart(2, "0");

  return (
    // The page opens straight into this section with no hero under the fixed
    // navbar, so it carries the bar's own height as top padding — the same
    // per-breakpoint heights the header sets in components/layout/Navbar.jsx.
    <section
      aria-label="Plan my trip"
      className="bg-cream pt-20 text-black lg:max-xl:pt-14 xl:max-2xl:pt-16 2xl:pt-20"
    >
      {/* One column until lg — at md the rail would leave the form ~400px,
          narrower than the two destination boxes need side by side. From lg
          the rail takes a fixed 300/320/360px and the form takes the rest, so
          the form column never falls below ~570px. */}
      <Container className="grid gap-10 py-10 sm:gap-12 sm:py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-0 lg:max-xl:py-14 xl:grid-cols-[minmax(0,1fr)_320px] xl:py-20 2xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* ── Form column ──────────────────────────────────────────────── */}
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          // scroll-mt clears the fixed navbar when a step change scrolls the
          // form back to its own top edge.
          className="scroll-mt-24 lg:pr-10 xl:pr-14 2xl:pr-20"
        >
          <header>
            <h4 className="max-sm:text-[14px]">{eyebrow}</h4>
            {/* No width cap: the design keeps the title on one line. The h2
                token bottoms out at 36px, which crowds the descenders against
                the line box on a phone, so this section runs its own smaller
                step below sm — the same move the dark PlanMyTripSection
                makes. */}
            <h2 className="mt-3 max-sm:text-[30px] max-sm:leading-[1.1] sm:mt-4">
              {title}
            </h2>
          </header>

          {submitted ? (
            <div className="py-12 motion-safe:animate-menu-drop sm:py-16 lg:py-24">
              <h3 className={STEP_TITLE_CLASSES}>
                Thank you, {submittedName}.
              </h3>
              <p className="mt-5 max-w-[560px] text-black/70 max-sm:text-[15px] sm:mt-6">
                {successMessage}
              </p>
            </div>
          ) : (
            <>
              {/* Progress: the numbers are back-jumps (earlier steps only —
                  forward always goes through Continue's validation), the rule
                  beneath fills with completion. */}
              <div className="mt-8 sm:mt-10 lg:mt-14">
                {/* Below sm the step name drops to its own line: "Personal
                    Note & Contact" beside four numbers overflows 375px, and
                    letting it wrap in place pushed the numbers off their
                    baseline. */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <div
                    aria-label="Steps"
                    className="flex shrink-0 items-baseline gap-5 sm:gap-6 md:gap-9"
                  >
                    {steps.map((planStep, index) => (
                      <button
                        key={planStep.id}
                        type="button"
                        onClick={() => index < step && goToStep(index)}
                        disabled={index > step}
                        aria-current={index === step ? "step" : undefined}
                        aria-label={`Step ${index + 1}: ${planStep.label}`}
                        className={cn(
                          // The numbers are the one control with no padding of
                          // its own, so the touch target is bought with
                          // min-h-11 and handed back to the layout with the
                          // negative margin — otherwise this row would grow
                          // 44px tall on a phone.
                          "-my-3 min-h-11 text-[14px] transition-colors sm:text-[15px]",
                          index === step && "font-medium text-black",
                          index < step &&
                            "cursor-pointer text-black/50 hover:text-black",
                          index > step && "text-black/25",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                  <p className="flex min-w-0 items-baseline justify-between gap-4 text-[13px] sm:justify-start sm:gap-6 sm:text-[15px] md:gap-12">
                    <span className="shrink-0 text-black/60">
                      Step {stepNumber}
                    </span>
                    <span className="min-w-0 text-right text-black">
                      {steps[step].label}
                    </span>
                  </p>
                </div>
                <div className="mt-4 h-px w-full bg-black/15">
                  <div
                    className="h-px bg-black transition-all duration-500"
                    style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Keyed by step so each change remounts and replays the
                  entrance — forward slides in from the right, back from the
                  left. Focusable so the step effect can land focus at the top
                  of the new panel; the min-height keeps the footer row from
                  jumping between steps of different depths. */}
              <div
                key={step}
                ref={stepPanelRef}
                tabIndex={-1}
                className={cn(
                  "min-h-[200px] pt-8 outline-none sm:min-h-[260px] sm:pt-10 lg:min-h-[300px] lg:max-xl:pt-10 xl:min-h-[320px] xl:pt-14",
                  direction === "forward"
                    ? "motion-safe:animate-menu-slide-in"
                    : "motion-safe:animate-menu-slide-back",
                )}
              >
                {step === 0 && (
                  <>
                    <h3 className={STEP_TITLE_CLASSES}>
                      Where Are You Thinking of Going?
                    </h3>
                    <Group
                      id="group-destination-mode"
                      label="Destination"
                      error={errors.destinationMode?.message}
                      className="mt-6 sm:mt-8"
                    >
                      <div className="flex flex-wrap gap-2.5 sm:gap-3">
                        {DESTINATION_MODE_OPTIONS.map((option) => (
                          <OptionBox
                            key={option}
                            label={option}
                            active={destinationMode === option}
                            onToggle={() => selectDestinationMode(option)}
                          />
                        ))}
                      </div>
                    </Group>

                    {/* Only asked of someone who just said they have somewhere
                        in mind — the schema requires it under the same
                        condition. */}
                    {hasDestinationInMind && (
                      <div className="mt-8 max-w-[420px] motion-safe:animate-menu-drop sm:mt-10">
                        <input
                          id="destination"
                          type="text"
                          placeholder="where would you like to go?"
                          aria-label="Where would you like to go?"
                          aria-invalid={errors.destination ? true : undefined}
                          aria-describedby={
                            errors.destination ? "destination-error" : undefined
                          }
                          {...register("destination")}
                          className={INPUT_CLASSES}
                        />
                        {errors.destination && (
                          <p
                            id="destination-error"
                            role="alert"
                            className="mt-2 text-[13px] text-red-600"
                          >
                            {errors.destination.message}
                          </p>
                        )}
                      </div>
                    )}

                    <Group
                      id="group-flexible"
                      label="Are your dates flexible?"
                      className="mt-8 sm:mt-10"
                    >
                      <div className="flex flex-wrap gap-2.5 sm:gap-3">
                        {FLEXIBILITY_OPTIONS.map((option) => (
                          <OptionBox
                            key={option}
                            label={option}
                            className="min-w-[110px]"
                            active={datesFlexible === option}
                            onToggle={() =>
                              selectSingle("datesFlexible", option)
                            }
                          />
                        ))}
                      </div>
                    </Group>
                  </>
                )}

                {step === 1 && (
                  <>
                    <h3 className={STEP_TITLE_CLASSES}>
                      When Are You Planning to Travel?
                    </h3>
                    <div className="mt-6 grid gap-6 sm:mt-8 sm:grid-cols-2 sm:gap-8 xl:gap-12">
                      <Field
                        id="arriving"
                        label="Arriving"
                        error={errors.arriving?.message}
                      >
                        <input
                          id="arriving"
                          type="date"
                          min={today || undefined}
                          aria-invalid={errors.arriving ? true : undefined}
                          aria-describedby={
                            errors.arriving ? "arriving-error" : undefined
                          }
                          {...register("arriving")}
                          className={INPUT_CLASSES}
                        />
                      </Field>
                      <Field
                        id="returning"
                        label="Returning"
                        error={errors.returning?.message}
                      >
                        <input
                          id="returning"
                          type="date"
                          min={arriving || today || undefined}
                          aria-invalid={errors.returning ? true : undefined}
                          aria-describedby={
                            errors.returning ? "returning-error" : undefined
                          }
                          {...register("returning")}
                          className={INPUT_CLASSES}
                        />
                      </Field>
                    </div>

                    <Group
                      id="group-duration"
                      label="How long would you like to travel?"
                      error={errors.duration?.message}
                      className="mt-8 sm:mt-10"
                    >
                      <div className="flex flex-wrap gap-2.5 sm:gap-3">
                        {DURATION_OPTIONS.map((option) => (
                          <OptionBox
                            key={option}
                            label={option}
                            active={duration === option}
                            onToggle={() => selectSingle("duration", option)}
                          />
                        ))}
                      </div>
                    </Group>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 className={STEP_TITLE_CLASSES}>
                      Who Is Travelling, and What Draws You?
                    </h3>
                    <Group
                      id="group-travellers"
                      label="Travelling with"
                      error={errors.travellingWith?.message}
                      className="mt-6 sm:mt-8"
                    >
                      <div className="flex flex-wrap gap-2.5 sm:gap-3">
                        {TRAVELLER_OPTIONS.map((option) => (
                          <OptionBox
                            key={option}
                            label={option}
                            active={travellingWith === option}
                            onToggle={() =>
                              selectSingle("travellingWith", option)
                            }
                          />
                        ))}
                      </div>
                    </Group>

                    {/* Headcount, only once a group chip is chosen — the
                        schema requires it for exactly those chips. */}
                    {GROUP_TRAVELLERS.includes(travellingWith) && (
                      <Field
                        id="groupSize"
                        label="Number of persons"
                        error={errors.groupSize?.message}
                        className="mt-6 sm:mt-8 sm:max-w-sm"
                      >
                        <select
                          id="groupSize"
                          aria-invalid={errors.groupSize ? true : undefined}
                          aria-describedby={
                            errors.groupSize ? "groupSize-error" : undefined
                          }
                          {...register("groupSize")}
                          className={cn(INPUT_CLASSES, "cursor-pointer")}
                        >
                          <option value="">Select</option>
                          {GROUP_SIZE_OPTIONS.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </Field>
                    )}

                    <Group
                      id="group-interests"
                      label="What inspires you?"
                      error={errors.interests?.message}
                      className="mt-8 sm:mt-10"
                    >
                      <div className="flex flex-wrap gap-2.5 sm:gap-3">
                        {INTEREST_OPTIONS.map((option) => (
                          <OptionBox
                            key={option}
                            label={option}
                            active={interests.includes(option)}
                            onToggle={() => toggleInterest(option)}
                          />
                        ))}
                      </div>
                    </Group>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3 className={STEP_TITLE_CLASSES}>
                      What Would Make This Journey Special?
                    </h3>
                    <Field
                      id="message"
                      label="Message"
                      error={errors.message?.message}
                      className="mt-6 sm:mt-8"
                    >
                      <textarea
                        id="message"
                        rows={2}
                        placeholder="An anniversary in the backwaters, a first safari with the children, a slow week by the ocean…"
                        aria-invalid={errors.message ? true : undefined}
                        aria-describedby={
                          errors.message ? "message-error" : undefined
                        }
                        {...register("message")}
                        className={cn(INPUT_CLASSES, "resize-none")}
                      />
                    </Field>

                    <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3 xl:gap-10">
                      <Field
                        id="name"
                        label="Name"
                        error={errors.name?.message}
                      >
                        <input
                          id="name"
                          type="text"
                          autoComplete="name"
                          placeholder="Your name"
                          aria-invalid={errors.name ? true : undefined}
                          aria-describedby={
                            errors.name ? "name-error" : undefined
                          }
                          {...register("name")}
                          className={INPUT_CLASSES}
                        />
                      </Field>
                      <Field
                        id="email"
                        label="Email"
                        error={errors.email?.message}
                      >
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          placeholder="you@example.com"
                          aria-invalid={errors.email ? true : undefined}
                          aria-describedby={
                            errors.email ? "email-error" : undefined
                          }
                          {...register("email")}
                          className={INPUT_CLASSES}
                        />
                      </Field>
                      <Field
                        id="phone"
                        label="Phone / WhatsApp"
                        error={errors.phone?.message}
                      >
                        <input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          placeholder="+91 98765 43210"
                          aria-invalid={errors.phone ? true : undefined}
                          aria-describedby={
                            errors.phone ? "phone-error" : undefined
                          }
                          {...register("phone")}
                          className={INPUT_CLASSES}
                        />
                      </Field>
                    </div>
                  </>
                )}
              </div>

              {/* Below sm the two actions stack full-width, and the row is
                  reversed so the primary one stays on top — DOM order keeps
                  Back before Continue for the tab sequence. */}
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-black/15 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:gap-4 sm:pt-8">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => goToStep(step - 1)}
                    className="focus-visible:outline-sky min-h-11 w-full cursor-pointer border border-black/25 px-8 py-3 text-[15px] text-black transition-colors hover:border-black focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="focus-visible:outline-sky hover:bg-navy min-h-11 w-full cursor-pointer bg-black px-10 py-3 text-[15px] text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto"
                >
                  {isLastStep ? "Build My Journey" : "Continue"}
                </button>
              </div>
            </>
          )}
        </form>

        {/* ── Journey rail ─────────────────────────────────────────────── */}
        {/* The running transcript of what has been answered. aria-live so an
            answer that just landed is announced without moving focus away from
            the form. Below lg it drops under the form rather than beside it. */}
        <aside
          aria-label={railTitle}
          className="border-t border-black/15 pt-8 sm:pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10 xl:pl-14 2xl:pl-20"
        >
          {/* Sticky only from lg, where the rail is a column of its own. The
              offset clears the tallest state of the fixed navbar (h-20). */}
          <div className="lg:sticky lg:top-28">
            <p className={LABEL_CLASSES}>{railTitle}</p>
            <dl
              aria-live="polite"
              className="mt-5 space-y-4 sm:mt-6 sm:space-y-5"
            >
              {summary.length === 0 ? (
                <p className="text-[14px] font-light text-black/45">
                  Your answers will appear here as you go.
                </p>
              ) : (
                summary.map((row) => (
                  <div key={row.label}>
                    <dt className="text-[13px] font-light text-black/45">
                      {row.label}
                    </dt>
                    <dd className="mt-1 text-[14px] font-medium break-words text-black">
                      {row.value}
                    </dd>
                  </div>
                ))
              )}
            </dl>

            {/* Capped below lg: stacked under the form, a full-bleed 4:3 image
                on a tablet is taller than the step it belongs to. */}
            <figure className="mt-8 max-w-[480px] sm:mt-10 lg:max-w-none">
              <div className="relative aspect-4/3 w-full overflow-hidden">
                <Image
                  src={railImage}
                  alt=""
                  fill
                  sizes="(min-width: 1536px) 360px, (min-width: 1280px) 320px, (min-width: 1024px) 300px, (min-width: 640px) 480px, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="font-heading mt-3 text-[12px] text-black/50 italic">
                {railCaption}
              </figcaption>
            </figure>
          </div>
        </aside>
      </Container>
    </section>
  );
}
