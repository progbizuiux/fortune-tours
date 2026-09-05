"use client";

import { Suspense, useCallback, useState } from "react";
import { UrlParamEffect } from "@/components/common/UrlParamEffect";
import Image from "next/image";
import { ChevronDown, Loader2 } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa6";
import { toast } from "sonner";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

/* The services the site menu offers (lib/navigation.js SITE_MENU.secondary),
   keyed by the `service` query their rows carry — /contact?service=visa-
   assistance — so an enquiry that started from one arrives already labelled.
   Listed here as interest options too, below the holiday types. */
const SERVICE_INTERESTS = {
  "visa-assistance": "Visa assistance",
  "hotel-bookings": "Hotel bookings",
  "flight-booking": "Flight booking",
  "travel-insurance": "Travel insurance",
  "passport-assistance": "Passport assistance",
};

const INTEREST_OPTIONS = [
  "Family trip",
  "Honeymoon Holidays",
  "Luxury Holidays",
  "Adventure & Nature",
  "Spiritual & Heritage",
  "Tailor-made Journey",
  "Corporate / Group Retreat",
  ...Object.values(SERVICE_INTERESTS),
  "Other",
];

/* Fortune Tours' own profiles — the same three the footer links. The X and
   LinkedIn icons that used to sit here pointed at the networks' home pages
   because there is no Fortune Tours account on either; an icon with no page
   behind it is removed rather than left as a dead link. */
const SOCIAL_LINKS = [
  {
    name: "Instagram",
    icon: FaInstagram,
    href: "https://instagram.com/fortunetours",
    label: "Instagram",
  },
  {
    name: "Facebook",
    icon: FaFacebookF,
    href: "https://facebook.com/Fortunetours",
    label: "Facebook",
  },
  {
    name: "YouTube",
    icon: FaYoutube,
    href: "https://www.youtube.com/@fortunetoursindia",
    label: "YouTube",
  },
];

export function ContactHeroSection({
  eyebrow = "Contact Us",
  title = "Let's Start Planning",
  headOffice = {
    title: "Head Office",
    addressLines: [
      "Mannamthara Tower,",
      "Paramara Rd, Ernakulam North.",
    ],
    phones: ["[+91] 7510 255 888", "[+91] 9656 211 888"],
    email: "info@fortunetours.com",
  },
  backgroundImage = "/contact/understand.jpeg",
  className,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "Family trip",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* A ?service= the site menu sent preselects the matching interest. Only
     ever sets a known option, so an unrecognised value leaves the default. */
  const applyServiceFromUrl = useCallback((service) => {
    const interest = SERVICE_INTERESTS[service];
    if (interest) setFormData((prev) => ({ ...prev, interest }));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in your name and email address.");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission or handle endpoint
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Thank you! Your travel inquiry has been received. We'll be in touch shortly.");
  }

  return (
    <section
      className={cn(
        "relative min-h-[100svh] 2xl:min-h-[1015px] 2xl:h-[1015px] w-full flex items-center pt-28 pb-16 md:pt-36 md:pb-24 lg:py-0 2xl:pt-0 2xl:pb-0 text-white overflow-visible",
        className
      )}
    >
      {/* Reads ?service= for the interest select; only this leaf renders on
          the client for it, the section stays in the server HTML. */}
      <Suspense fallback={null}>
        <UrlParamEffect name="service" onChange={applyServiceFromUrl} />
      </Suspense>
      {/* Background Image & Scrim (clipped strictly to hero section) */}
      <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-[1.02] transition-transform duration-1000 ease-out"
        />
        {/* Figma 30% black overlay */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Soft top gradient for navbar contrast */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />
        {/* Soft bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <Container className="relative z-10 w-full 2xl:max-w-[1928px] 2xl:!px-[84px] pt-16 pb-8 sm:pt-20 sm:pb-10 md:pt-24 lg:pt-0 lg:pb-0 2xl:pt-[180px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 xl:gap-10 2xl:gap-12 items-center 2xl:items-end w-full">
          
          {/* Left Column: Contact Details & Head Office (Centered on small screens, left-aligned on lg+) */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-start text-center lg:text-left max-w-xl lg:max-w-none mx-auto lg:mx-0 pb-2 sm:pb-4 lg:pb-0 2xl:pb-[60px] w-full">
            {/* Eyebrow (Spartan 400 20px Line-height 100% Tracking 0% on 2xl) */}
            <span className="font-top text-[13px] sm:text-[15px] md:text-[16px] xl:text-[18px] 2xl:text-[20px] leading-tight 2xl:leading-none tracking-[0.1em] 2xl:tracking-normal text-white uppercase sm:capitalize mb-2 sm:mb-3 md:mb-4 2xl:mb-[34px] block font-normal">
              {eyebrow}
            </span>

            {/* Main Heading (Neiko 400 85px Line-height 100% Tracking -1% on 2xl) */}
            <h1 className="font-heading text-[32px] sm:text-[42px] md:text-[50px] lg:text-[34px] xl:text-[54px] 2xl:text-[85px] leading-[1.08] 2xl:leading-[1] text-white font-normal tracking-[-0.01em] mb-4 sm:mb-6 md:mb-8 lg:mb-8 2xl:mb-[87px]">
              {title}
            </h1>

            {/* Head Office Info - Horizontal 2-column layout (Left: 84px to 386px = 302px offset) */}
            <div className="flex flex-col sm:flex-row sm:items-start items-center text-center sm:text-left gap-3 sm:gap-6 lg:gap-4 xl:gap-8 2xl:gap-0 w-full justify-center lg:justify-start">
              <h2 className="font-sans font-medium text-[13px] sm:text-[15px] md:text-[16px] lg:text-[14px] xl:text-[17px] 2xl:text-[20px] leading-[20px] sm:leading-[24px] 2xl:leading-[30px] 2xl:tracking-[0.24px] text-white capitalize shrink-0 w-full sm:w-32 md:w-36 lg:w-28 xl:w-36 2xl:w-[302px]">
                {headOffice.title}
              </h2>

              <div className="font-sans font-medium text-[13px] sm:text-[15px] md:text-[16px] lg:text-[13px] xl:text-[16px] 2xl:text-[20px] leading-[20px] sm:leading-[24px] md:leading-[26px] 2xl:leading-[30px] 2xl:tracking-[-0.32px] text-white">
                <div className="space-y-0.5 sm:space-y-1 2xl:space-y-[8px]">
                  {headOffice.addressLines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>

                {/* Phone Numbers (33px gap from address, 18px gap between phone lines on 2xl) */}
                <div className="mt-2 sm:mt-2.5 2xl:mt-[33px] space-y-0.5 sm:space-y-1 2xl:space-y-[18px]">
                  {headOffice.phones.map((phone, idx) => (
                    <a
                      key={idx}
                      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                      className="block text-white hover:text-white/80 transition-colors duration-200"
                    >
                      {phone}
                    </a>
                  ))}
                </div>

                {/* Email (219x30 exact dimensions and Poppins 500 20px / 30px on 2xl) */}
                <div className="mt-2 sm:mt-2.5 2xl:mt-[24px]">
                  <a
                    href={`mailto:${headOffice.email}`}
                    className="inline-block text-white hover:text-white/80 transition-colors duration-200"
                  >
                    {headOffice.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links - Horizontal 2-column layout (exact 115px gap from email on 2xl) */}
            <div className="flex flex-col sm:flex-row sm:items-center items-center text-center sm:text-left gap-3 sm:gap-6 lg:gap-4 xl:gap-8 2xl:gap-0 mt-5 sm:mt-7 md:mt-9 lg:mt-8 2xl:mt-[115px] w-full justify-center lg:justify-start">
              <h3 className="font-sans font-medium text-[13px] sm:text-[15px] md:text-[16px] lg:text-[14px] xl:text-[17px] 2xl:text-[20px] leading-[20px] sm:leading-[24px] 2xl:leading-[24px] 2xl:tracking-[0.24px] text-white capitalize shrink-0 w-full sm:w-32 md:w-36 lg:w-28 xl:w-36 2xl:w-[302px]">
                Social Links
              </h3>

              <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3 2xl:gap-[16px]">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 2xl:w-[46px] 2xl:h-[46px] rounded-[4px] bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm text-[12px] sm:text-[13px] md:text-[14px] 2xl:text-[18px] active:scale-95"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Planning Form Card (exact 1038x741 with 50px overhang into next section) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end relative z-20 2xl:translate-y-[50px] 2xl:-mb-[50px]">
            <div className="w-full max-w-[600px] lg:max-w-none 2xl:w-[1038px] 2xl:h-[741px] bg-[#FAFAF9] text-[#1A1A1A] p-4 sm:p-6 md:p-8 lg:p-7 xl:p-10 2xl:pt-[67px] 2xl:pb-[67px] 2xl:pl-[78px] 2xl:pr-[113px] shadow-2xl shadow-black/30 rounded-[2px] transition-all flex flex-col justify-between">
              
              {isSubmitted ? (
                <div className="py-8 sm:py-12 md:py-16 text-center space-y-4">
                  <h3 className="font-heading text-[24px] sm:text-[28px] md:text-[30px] text-black">
                    Thank you, {formData.name || "Explorer"}!
                  </h3>
                  <p className="font-sans text-[14px] sm:text-[15px] md:text-[16px] text-black/70 max-w-md mx-auto leading-relaxed">
                    Your journey brief has been received. Our travel designers will reach out with tailor-made recommendations within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        interest: "Family trip",
                        message: "",
                      });
                    }}
                    className="mt-4 sm:mt-6 bg-black text-white text-[12px] tracking-[0.16em] uppercase px-6 py-2.5 sm:px-8 sm:py-3 hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 2xl:space-y-[44px]">
                  
                  {/* Name & Email (2-column layout with exact 24px gap) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 md:gap-6 2xl:gap-[24px]">
                    {/* Name */}
                    <div className="relative flex flex-col justify-between 2xl:h-[80px]">
                      <label
                        htmlFor="contact-name"
                        className="font-sans font-light text-[12px] sm:text-[13px] md:text-[14px] 2xl:text-[16px] leading-[18px] sm:leading-[20px] 2xl:leading-[24px] tracking-[0.3em] text-black uppercase block mb-0.5 sm:mb-1 2xl:mb-[16px]"
                      >
                        NAME
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="James Thomas"
                        className="w-full bg-transparent border-b-[0.5px] border-black/50 focus:border-black pb-1 sm:pb-1.5 2xl:pb-[16px] text-[13px] sm:text-[14px] md:text-[15px] 2xl:text-[16px] leading-[20px] 2xl:leading-[24px] text-black placeholder:text-black/35 font-sans font-light tracking-normal focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="relative flex flex-col justify-between 2xl:h-[80px]">
                      <label
                        htmlFor="contact-email"
                        className="font-sans font-light text-[12px] sm:text-[13px] md:text-[14px] 2xl:text-[16px] leading-[18px] sm:leading-[20px] 2xl:leading-[24px] tracking-[0.3em] text-black uppercase block mb-0.5 sm:mb-1 2xl:mb-[16px]"
                      >
                        EMAIL
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="JamesThomas@gmail.com"
                        className="w-full bg-transparent border-b-[0.5px] border-black/50 focus:border-black pb-1 sm:pb-1.5 2xl:pb-[16px] text-[13px] sm:text-[14px] md:text-[15px] 2xl:text-[16px] leading-[20px] 2xl:leading-[24px] text-black placeholder:text-black/35 font-sans font-light tracking-normal focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="relative flex flex-col justify-between 2xl:h-[80px]">
                    <label
                      htmlFor="contact-phone"
                      className="font-sans font-light text-[12px] sm:text-[13px] md:text-[14px] 2xl:text-[16px] leading-[18px] sm:leading-[20px] 2xl:leading-[24px] tracking-[0.3em] text-black uppercase block mb-0.5 sm:mb-1 2xl:mb-[16px]"
                    >
                      PHONE / WHATSAPP
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="JamesThomas@gmail.com"
                      className="w-full bg-transparent border-b-[0.5px] border-black/50 focus:border-black pb-1 sm:pb-1.5 2xl:pb-[16px] text-[13px] sm:text-[14px] md:text-[15px] 2xl:text-[16px] leading-[20px] 2xl:leading-[24px] text-black placeholder:text-black/35 font-sans font-light tracking-normal focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Interest Select */}
                  <div className="relative flex flex-col justify-between 2xl:h-[80px]">
                    <label
                      htmlFor="contact-interest"
                      className="font-sans font-light text-[12px] sm:text-[13px] md:text-[14px] 2xl:text-[16px] leading-[18px] sm:leading-[20px] 2xl:leading-[24px] tracking-[0.3em] text-black uppercase block mb-0.5 sm:mb-1 2xl:mb-[16px]"
                    >
                      INTEREST
                    </label>
                    <div className="relative">
                      <select
                        id="contact-interest"
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b-[0.5px] border-black/50 focus:border-black pb-1 sm:pb-1.5 2xl:pb-[16px] text-[12px] sm:text-[13px] md:text-[14px] 2xl:text-[16px] leading-[18px] sm:leading-[20px] 2xl:leading-[24px] text-black font-sans font-light tracking-normal focus:outline-none transition-colors appearance-none pr-8 cursor-pointer"
                      >
                        {INTEREST_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="text-black bg-white text-[12px] sm:text-[13px] md:text-[14px] 2xl:text-[16px] py-1.5 sm:py-2 px-3 sm:px-4 pl-3 sm:pl-4">
                            {"\u00A0"}{opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60 pointer-events-none"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="relative flex flex-col justify-between 2xl:h-[80px]">
                    <label
                      htmlFor="contact-message"
                      className="font-sans font-light text-[12px] sm:text-[13px] md:text-[14px] 2xl:text-[16px] leading-[18px] sm:leading-[20px] 2xl:leading-[24px] tracking-[0.3em] text-black uppercase block mb-0.5 sm:mb-1 2xl:mb-[16px]"
                    >
                      MESSAGE
                    </label>
                    <input
                      id="contact-message"
                      name="message"
                      type="text"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="A anniversary in the Mara, a first safari with the children, a slow week by the ocean..."
                      className="w-full bg-transparent border-b-[0.5px] border-black/50 focus:border-black pb-1 sm:pb-1.5 2xl:pb-[16px] text-[13px] sm:text-[14px] md:text-[15px] 2xl:text-[16px] leading-[20px] 2xl:leading-[24px] text-black placeholder:text-black/35 font-sans font-light tracking-normal focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Submit Button (Exact 186x52px with 101px gap above on large screens) */}
                  <div className="pt-1 sm:pt-2 2xl:pt-0 2xl:mt-[101px]">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto 2xl:w-[186px] 2xl:h-[52px] bg-black text-white font-sans font-light text-[13px] sm:text-[14px] md:text-[15px] 2xl:text-[18px] leading-[20px] sm:leading-[22px] 2xl:leading-[24px] tracking-normal px-6 py-2.5 sm:px-8 sm:py-3 2xl:px-0 2xl:py-0 hover:bg-neutral-800 active:scale-[0.99] transition-all duration-200 cursor-pointer inline-flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
