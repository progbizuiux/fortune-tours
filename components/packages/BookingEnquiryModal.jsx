"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";
import { Modal } from "@/components/common/Modal";
import { cn } from "@/lib/utils";

/* The "Book Your Seat" enquiry — a picture beside a five-field form, opened
 * from the booking band at the foot of a package page.
 *
 * The schema lives here rather than in lib/: it is five fields used in one
 * place, unlike the plan-my-trip wizard whose schema is shared with its draft
 * storage. Same rules as that form, so a traveller who fills both is held to
 * one standard — a real name, a real email, a plausible phone.
 */
const PHONE_RE = /^\+?[0-9][0-9\s().-]{6,17}$/;

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  phone: z
    .string()
    .trim()
    .regex(PHONE_RE, "Enter a valid phone or WhatsApp number."),
  email: z.email("Enter a valid email address."),
  // Optional: a reader who knows they want the trip but not the week should
  // not be stopped at the door by a date picker.
  date: z.string(),
  message: z.string().max(1000, "Please keep it under 1000 characters."),
});

const EMPTY = { name: "", phone: "", email: "", date: "", message: "" };

/* Label above an underlined field — the treatment the plan-my-trip form uses,
   in its light colourway, so the two enquiry forms read as one house style. */
const LABEL_CLASSES =
  "font-top text-[11px] font-light tracking-[0.12em] text-black/45 uppercase sm:tracking-[0.18em]";

const INPUT_CLASSES =
  "mt-2 w-full border-b border-black/25 bg-transparent pb-2.5 text-[15px] font-light text-black transition-colors placeholder:text-black/35 focus:border-black focus:outline-none";

function Field({ id, label, error, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
      </label>
      {children}
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

export function BookingEnquiryModal({
  open,
  onClose,
  title = "Hold your seat",
  description = "Leave your details and a travel designer will confirm availability, usually within a day.",
  image,
  imageAlt = "",
  packageName,
}) {
  const headingId = useId();
  // Set after mount: rendering new Date() on the server would disagree with
  // hydration around midnight and across timezones.
  const [today, setToday] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: EMPTY,
    mode: "onTouched",
  });

  useEffect(() => {
    setToday(format(new Date(), "yyyy-MM-dd"));
  }, []);

  // The panel unmounts on close, so the fields are empty on the next open
  // anyway; this clears the error state that would otherwise be restored with
  // the same resolver instance.
  useEffect(() => {
    if (!open) reset(EMPTY);
  }, [open, reset]);

  async function onSubmit(values) {
    // TODO(backend): POST `values` (plus packageName) to the enquiry endpoint
    // through lib/axios.js once it exists. Until then the enquiry ends
    // client-side, the same way the plan-my-trip wizard does.
    void values;
    toast.success("Thanks — we'll be in touch shortly.");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={headingId}
      /* Wider than the primitive's default: this panel carries a picture and a
         five-field form side by side, and at 900px the form column was tight
         enough that the two-up rows below had to stay stacked. */
      className="sm:max-w-[1040px] lg:max-w-[1140px] xl:max-w-[1240px]"
    >
      {/* Picture left, form right from md, an even split from lg where there is
          width for it. Below md the picture is a short banner above the form
          rather than a column — a 40% image column on a phone leaves the fields
          in a 150px measure. */}
      <div className="grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:grid-cols-2">
        {image && (
          <div className="relative h-[160px] w-full sm:h-[200px] md:h-auto md:min-h-[520px] lg:min-h-[560px]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 1280px) 620px, (min-width: 768px) 480px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          <h2
            id={headingId}
            className="font-heading text-[24px] leading-[1.2] text-black sm:text-[28px]"
          >
            {title}
          </h2>
          {packageName && (
            <p className={cn(LABEL_CLASSES, "mt-3")}>{packageName}</p>
          )}
          <p className="mt-3 text-[14px] leading-[1.6] font-light text-black/70">
            {description}
          </p>

          {/* Two-up from lg: the extra width is what the wider panel bought,
              and five full-width underlines stacked in one column read as a
              much longer form than this is. */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-7 grid gap-6 lg:grid-cols-2"
          >
            <Field id="booking-name" label="Name" error={errors.name?.message}>
              <input
                id="booking-name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={
                  errors.name ? "booking-name-error" : undefined
                }
                {...register("name")}
                className={INPUT_CLASSES}
              />
            </Field>

            <Field
              id="booking-phone"
              label="Phone / WhatsApp"
              error={errors.phone?.message}
            >
              <input
                id="booking-phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+91 98765 43210"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={
                  errors.phone ? "booking-phone-error" : undefined
                }
                {...register("phone")}
                className={INPUT_CLASSES}
              />
            </Field>

            <Field
              id="booking-email"
              label="Email"
              error={errors.email?.message}
            >
              <input
                id="booking-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={
                  errors.email ? "booking-email-error" : undefined
                }
                {...register("email")}
                className={INPUT_CLASSES}
              />
            </Field>

            <Field
              id="booking-date"
              label="Preferred date"
              error={errors.date?.message}
            >
              {/* [color-scheme:light] pins the native picker to the light set —
                  the panel is white, and a viewer whose OS is in dark mode
                  otherwise gets a near-white glyph on it. */}
              <input
                id="booking-date"
                type="date"
                min={today || undefined}
                aria-invalid={errors.date ? true : undefined}
                aria-describedby={
                  errors.date ? "booking-date-error" : undefined
                }
                {...register("date")}
                className={cn(INPUT_CLASSES, "[color-scheme:light]")}
              />
            </Field>

            <Field
              id="booking-message"
              label="Message"
              error={errors.message?.message}
              className="lg:col-span-2"
            >
              <textarea
                id="booking-message"
                rows={3}
                placeholder="Travellers, dates you have in mind, anything we should know…"
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={
                  errors.message ? "booking-message-error" : undefined
                }
                {...register("message")}
                className={cn(INPUT_CLASSES, "resize-none")}
              />
            </Field>

            <button
              type="submit"
              disabled={isSubmitting}
              className="focus-visible:outline-sky hover:bg-navy mt-1 min-h-11 w-full lg:col-span-2 cursor-pointer bg-black px-8 py-3 text-[15px] text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending…" : "Send Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
