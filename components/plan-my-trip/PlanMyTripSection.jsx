"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Container } from "@/components/common/Container";
import { FrameButton } from "@/components/common/FrameButton";
import {
  DESTINATION_OPTIONS,
  DURATION_OPTIONS,
  EMPTY_PLAN,
  INTEREST_OPTIONS,
  PLAN_STEPS,
  TRAVELLER_OPTIONS,
  clearPlanDraft,
  loadPlanDraft,
  planSchema,
  savePlanDraft,
} from "@/lib/planMyTrip";
import { cn } from "@/lib/utils";

/* The plan-my-trip wizard, rendered in-flow on the Africa region page after
   the journal section. The four steps live in one form; Continue validates
   only the leaving step's slice of the schema, and the whole draft — answers
   plus the current step — survives a refresh through localStorage
   (lib/planMyTrip.js).

   Placeholder art until the Figma cut arrives — swap the src here. */
const BACKGROUND_IMAGE = "/destinations/africa.png";

/* Underline treatment shared by every free-text field on the form.
   [color-scheme:dark] flips the native date-picker glyph and popup to the
   white-on-dark set — without it Chrome draws a near-black calendar icon on
   the black panel. */
const INPUT_CLASSES =
  "mt-4 w-full border-b border-white/40 bg-transparent pb-3 text-body font-light text-white transition-colors placeholder:text-white/40 focus:border-white focus:outline-none [color-scheme:dark]";

/* A question heading with its answers beneath it. The group is labelled by
   the visible heading, and a group-level error (unanswered chips) is read
   with it via aria-describedby. */
function QuestionGroup({ id, title, error, className, children }) {
  return (
    <div className={className}>
      {/* Figma: Neiko 35px — the h3 token caps at 32px, so the exact size is
          pinned from 2xl up while smaller screens keep the site scale. */}
      <h3 id={id} className="2xl:text-[35px]">
        {title}
      </h3>
      <div
        role="group"
        aria-labelledby={id}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-6 md:mt-8 lg:mt-10"
      >
        {children}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-4 text-small text-red-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* One row of answer chips. Single- and multi-select share it — the caller
   owns the semantics through isActive/onToggle, the chips just render state.
   aria-pressed carries the selection for screen readers. */
function OptionChips({ options, isActive, onToggle }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-4 sm:gap-x-[27px]">
      {options.map((option) => (
        <FrameButton
          key={option}
          variant="option"
          active={isActive(option)}
          aria-pressed={isActive(option)}
          onClick={() => onToggle(option)}
        >
          {option}
        </FrameButton>
      ))}
    </div>
  );
}

/* Label-above-underline field wrapper for the date/contact inputs. */
function Field({ id, label, error, className, children }) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="font-top text-small font-light tracking-[0.35em] text-white/85 uppercase"
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-small text-red-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function PlanMyTripSection({className}) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [submittedName, setSubmittedName] = useState(null);
  // Set after mount: rendering new Date() would differ between the server
  // pass and hydration around midnight/timezones.
  const [today, setToday] = useState("");

  const sectionRef = useRef(null);
  const stepPanelRef = useRef(null);
  const stepRef = useRef(step);
  const persistTimer = useRef(null);
  const isFirstStepEffect = useRef(true);
  const isSubmittedRef = useRef(false);
  // Distinguishes step changes the traveller made (Continue/Back — scroll and
  // focus follow) from the silent draft restore on mount, which must not
  // yank the page down to this section on load.
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

  const [destination, duration, travellingWith, interests, arriving] = watch([
    "destination",
    "duration",
    "travellingWith",
    "interests",
    "arriving",
  ]);

  const isLastStep = step === PLAN_STEPS.length - 1;
  const submitted = submittedName !== null;

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
    const subscription = watch((values) => {
      if (isSubmittedRef.current) return;
      clearTimeout(persistTimer.current);
      persistTimer.current = setTimeout(
        () => savePlanDraft({ step: stepRef.current, values }),
        250,
      );
    });
    return () => {
      clearTimeout(persistTimer.current);
      subscription.unsubscribe();
    };
  }, [watch]);

  // Step changes save immediately. When the traveller drove the change, the
  // section also scrolls back to its top and focus lands on the new panel, so
  // keyboard/screen-reader users continue where the content restarted. The
  // mount run is skipped — it would overwrite a stored draft with step 0.
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
      sectionRef.current?.scrollIntoView({
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

  function toggleInterest(value) {
    const next = interests.includes(value)
      ? interests.filter((item) => item !== value)
      : [...interests, value];
    setValue("interests", next, { shouldValidate: true, shouldDirty: true });
  }

  function handleFinalSubmit(values) {
    // TODO(backend): POST `values` to the enquiry endpoint (lib/axios.js)
    // once it exists — until then the brief ends client-side by design.
    // The pending debounced save must die with the draft, or the keystrokes
    // that filled the last field write the draft straight back 250ms from now.
    isSubmittedRef.current = true;
    clearTimeout(persistTimer.current);
    clearPlanDraft();
    setSubmittedName(values.name.trim().split(/\s+/)[0]);
    toast.success("Your journey brief is on its way.");
  }

  // A final submit that fails on a field from an earlier step (possible if a
  // stored draft was tampered with) sends the traveller to that step instead
  // of failing silently behind the current one.
  function handleInvalidSubmit(formErrors) {
    const failed = PLAN_STEPS.findIndex((planStep) =>
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
    const valid = await trigger(PLAN_STEPS[step].fields, { shouldFocus: true });
    if (valid) goToStep(step + 1);
  }

  /* ── Render ─────────────────────────────────────────────────────────── */

  const stepNumber = String(step + 1).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      aria-label="Plan my trip"
      // scroll-mt clears the fixed navbar when a step change scrolls the
      // section back to its own top edge.
      className={`${cn('spacing relative scroll-mt-20 overflow-hidden bg-black text-white',className)}`}
    >
      {/* Backdrop: the art sits under a wash so the form stays legible over
          any image. First child, so everything after paints above it. */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src={BACKGROUND_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <Container
        as="form"
        onSubmit={onSubmit}
        noValidate
        // Explicit paddings instead of `.spacing`: that rule is unlayered so
        // utilities can't shrink it below lg, and this section runs tighter
        // than the standard rhythm on small screens.
        className="relative flex flex-col py-10 md:py-14 lg:py-[100px]"
      >
        <header>
          {/* Figma: Spartan 20px/100% — exactly the h4 element default. */}
          <h4 className="text-white">Plan my trip</h4>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <h2>Craft your unique journey.</h2>
            <p className="max-w-[706px] text-body text-white/80 lg:shrink-0 lg:text-right">
              Tell us what you're dreaming about, how you like to travel and
              what you want to experience. We'll help shape a journey around
              you.
            </p>
          </div>
        </header>

        {submitted ? (
          <div className="flex flex-col items-start py-16 motion-safe:animate-menu-drop md:py-24">
            <h3 className="text-h3">Thank you, {submittedName}.</h3>
            <p className="mt-6 max-w-[560px] text-body text-white/80">
              Your journey brief is with our travel designers. Expect
              personalised recommendations from a real person — usually within a
              day, always with no obligation.
            </p>
          </div>
        ) : (
          <>
            {/* Progress: numbers are back-jumps (earlier steps only —
                forward always goes through Continue's validation), the rail
                beneath fills with completion. */}
            <div className="mt-8 md:mt-10 lg:mt-[80px]">
              <div className="flex items-baseline justify-between gap-6">
                <div
                  aria-label="Steps"
                  className="flex shrink-0 items-baseline gap-5 md:gap-[50px]"
                >
                  {PLAN_STEPS.map((planStep, index) => (
                    <button
                      key={planStep.id}
                      type="button"
                      onClick={() => index < step && goToStep(index)}
                      disabled={index > step}
                      aria-current={index === step ? "step" : undefined}
                      aria-label={`Step ${index + 1}: ${planStep.label}`}
                      className={cn(
                        "text-body transition-colors",
                        index === step && "text-white",
                        index < step &&
                          "cursor-pointer text-white/70 hover:text-white",
                        index > step && "text-white/35",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
                {/* Figma: 50px between "Step 01" and the step name. */}
                <p className="text-body flex min-w-0 items-baseline gap-5 md:gap-[50px]">
                  <span className="shrink-0 text-white/90">
                    Step {stepNumber}
                  </span>
                  <span className="min-w-0 text-right text-white">
                    {PLAN_STEPS[step].label}
                  </span>
                </p>
              </div>
              {/* Figma: 0.5px rules at 50% white. */}
              <div className="mt-4 h-[0.5px] w-full bg-white/50">
                <div
                  className="h-[0.5px] bg-white transition-all duration-500"
                  style={{
                    width: `${((step + 1) / PLAN_STEPS.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Keyed by step so each change remounts and replays the
                entrance — forward slides in from the right, back from the
                left, same move as the navbar drill-down. Focusable so the
                step effect can land focus at the top of the new panel. The
                min-height keeps the footer rail from jumping between steps
                of different depths. */}
            <div
              key={step}
              ref={stepPanelRef}
              tabIndex={-1}
              className={cn(
                "min-h-[160px] pt-8 outline-none md:min-h-[220px] md:pt-10 lg:min-h-[300px] lg:pt-[70px]",
                direction === "forward"
                  ? "motion-safe:animate-menu-slide-in"
                  : "motion-safe:animate-menu-slide-back",
              )}
            >
              {step === 0 && (
                <QuestionGroup
                  id="question-destination"
                  title="Where would you like to go?"
                  error={errors.destination?.message}
                >
                  <OptionChips
                    options={DESTINATION_OPTIONS}
                    isActive={(option) => destination === option}
                    onToggle={(option) => selectSingle("destination", option)}
                  />
                </QuestionGroup>
              )}

              {step === 1 && (
                <>
                  <QuestionGroup
                    id="question-dates"
                    title="When are you planning to travel?"
                  >
                    <div className="grid gap-10 md:grid-cols-2 md:gap-16 xl:gap-24">
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
                  </QuestionGroup>

                  <QuestionGroup
                    id="question-duration"
                    title="How long would you like to travel?"
                    error={errors.duration?.message}
                    className="mt-10 md:mt-12 lg:mt-20"
                  >
                    <OptionChips
                      options={DURATION_OPTIONS}
                      isActive={(option) => duration === option}
                      onToggle={(option) => selectSingle("duration", option)}
                    />
                  </QuestionGroup>
                </>
              )}

              {step === 2 && (
                <>
                  <QuestionGroup
                    id="question-travellers"
                    title="Who are you travelling with?"
                    error={errors.travellingWith?.message}
                  >
                    <OptionChips
                      options={TRAVELLER_OPTIONS}
                      isActive={(option) => travellingWith === option}
                      onToggle={(option) =>
                        selectSingle("travellingWith", option)
                      }
                    />
                  </QuestionGroup>

                  <QuestionGroup
                    id="question-interests"
                    title="What inspires you?"
                    error={errors.interests?.message}
                    className="mt-10 md:mt-12 lg:mt-20"
                  >
                    <OptionChips
                      options={INTEREST_OPTIONS}
                      isActive={(option) => interests.includes(option)}
                      onToggle={toggleInterest}
                    />
                  </QuestionGroup>
                </>
              )}

              {step === 3 && (
                <>
                  <QuestionGroup
                    id="question-note"
                    title="What would make this journey special for you?"
                  >
                    <Field
                      id="message"
                      label="Message"
                      error={errors.message?.message}
                    >
                      <textarea
                        id="message"
                        rows={2}
                        placeholder="An anniversary in the Mara, a first safari with the children, a slow week by the ocean…"
                        aria-invalid={errors.message ? true : undefined}
                        aria-describedby={
                          errors.message ? "message-error" : undefined
                        }
                        {...register("message")}
                        className={cn(INPUT_CLASSES, "resize-none")}
                      />
                    </Field>
                  </QuestionGroup>

                  <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-12 xl:gap-16">
                    <Field id="name" label="Name" error={errors.name?.message}>
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

            {/* Figma: 58px between the rule and the footer row. */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-5 border-t-[0.5px] border-white/50 pt-5 md:mt-10 md:pt-6 lg:mt-14 lg:pt-[58px]">
              {step > 0 && (
                <FrameButton
                  variant="option"
                  onClick={() => goToStep(step - 1)}
                >
                  Back
                </FrameButton>
              )}
              <p
                className={cn(
                  "text-body order-last w-full text-center text-white/80 md:order-none md:w-auto md:flex-1",
                  step === 0 ? "md:text-left" : "md:text-center",
                )}
              >
                Personalised recommendations · Expert guidance · No obligation
              </p>
              <FrameButton
                variant="option"
                type="submit"
                className="ml-auto"
              >
                {isLastStep ? "Build My Journey" : "Continue"}
              </FrameButton>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
