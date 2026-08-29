"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Loader2 } from "lucide-react";
import { FaFacebookF, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import { toast } from "sonner";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

const INTEREST_OPTIONS = [
  "Family trip",
  "Honeymoon Holidays",
  "Luxury Holidays",
  "Adventure & Nature",
  "Spiritual & Heritage",
  "Tailor-made Journey",
  "Corporate / Group Retreat",
  "Other",
];

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    icon: FaFacebookF,
    href: "https://facebook.com",
    label: "Facebook",
  },
  {
    name: "X",
    icon: FaXTwitter,
    href: "https://twitter.com",
    label: "X (Twitter)",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedinIn,
    href: "https://linkedin.com",
    label: "LinkedIn",
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
  backgroundImage = "/contact/hero-bg.jpg",
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
        "relative min-h-[100svh] w-full flex items-center pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-36 lg:pb-12 2xl:pt-40 2xl:pb-16 text-white overflow-visible",
        className
      )}
    >
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

      <Container className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8 xl:gap-12 2xl:gap-16 items-center">
          
          {/* Left Column: Contact Details & Head Office */}
          <div className="lg:col-span-5 flex flex-col justify-center max-w-xl">
            {/* Eyebrow */}
            <span className="font-top text-[12px] md:text-[13px] 2xl:text-[14px] tracking-[0.22em] text-white/90 uppercase mb-2 md:mb-3 block font-light">
              {eyebrow}
            </span>

            {/* Main Heading */}
            <h1 className="font-heading text-[38px] sm:text-[46px] md:text-[54px] lg:text-[46px] xl:text-[56px] 2xl:text-[64px] leading-[1.08] text-white font-normal tracking-[-0.01em] mb-8 sm:mb-10 lg:mb-12">
              {title}
            </h1>

            {/* Head Office Info - Horizontal 2-column layout */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 lg:gap-10">
              <h2 className="font-top text-[12px] md:text-[13px] 2xl:text-[14px] tracking-[0.2em] text-white/80 uppercase font-medium shrink-0 w-28 sm:w-32 md:w-36">
                {headOffice.title}
              </h2>

              <div className="space-y-3 font-sans text-[14px] md:text-[15px] 2xl:text-[16px] text-white/85 leading-relaxed font-light">
                <div>
                  {headOffice.addressLines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>

                {/* Phone Numbers */}
                <div className="space-y-0.5">
                  {headOffice.phones.map((phone, idx) => (
                    <a
                      key={idx}
                      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                      className="block text-white/90 hover:text-white transition-colors duration-200"
                    >
                      {phone}
                    </a>
                  ))}
                </div>

                {/* Email */}
                <div>
                  <a
                    href={`mailto:${headOffice.email}`}
                    className="inline-block text-white/90 hover:text-white hover:underline transition-colors duration-200"
                  >
                    {headOffice.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links - Horizontal 2-column layout */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 lg:gap-10 mt-8 sm:mt-10 lg:mt-12">
              <h3 className="font-top text-[12px] md:text-[13px] 2xl:text-[14px] tracking-[0.2em] text-white/80 uppercase font-medium shrink-0 w-28 sm:w-32 md:w-36">
                Social Links
              </h3>

              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-[3px] bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm text-[13px] sm:text-[14px] active:scale-95"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Planning Form Card (exact 1038x741 with 67px/78px/113px padding on large screens) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end relative z-20 lg:translate-y-[50px] lg:-mb-[50px]">
            <div className="w-full max-w-[600px] lg:max-w-none 2xl:w-[1038px] 2xl:min-h-[741px] bg-[#FAFAF9] text-[#1A1A1A] p-6 sm:p-9 md:p-11 lg:p-10 xl:p-12 2xl:pt-[67px] 2xl:pb-[67px] 2xl:pl-[78px] 2xl:pr-[113px] shadow-2xl shadow-black/30 rounded-[2px] transition-all flex flex-col justify-between">
              
              {isSubmitted ? (
                <div className="py-12 sm:py-16 text-center space-y-4">
                  <h3 className="font-heading text-[26px] sm:text-[30px] text-black">
                    Thank you, {formData.name || "Explorer"}!
                  </h3>
                  <p className="font-sans text-[15px] sm:text-[16px] text-black/70 max-w-md mx-auto leading-relaxed">
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
                    className="mt-6 bg-black text-white text-[12px] tracking-[0.16em] uppercase px-8 py-3 hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-7 2xl:space-y-[44px]">
                  
                  {/* Name & Email (2-column layout with exact 24px gap) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 2xl:gap-[24px]">
                    {/* Name */}
                    <div className="relative flex flex-col justify-between 2xl:h-[80px]">
                      <label
                        htmlFor="contact-name"
                        className="font-sans font-light text-[14px] sm:text-[15px] 2xl:text-[16px] 2xl:leading-[24px] tracking-[0.3em] text-black uppercase block mb-1 2xl:mb-[16px]"
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
                        className="w-full bg-transparent border-b-[0.5px] border-black/50 focus:border-black pb-1.5 2xl:pb-0 text-[15px] 2xl:text-[16px] 2xl:leading-[24px] text-black placeholder:text-black/35 font-sans font-light tracking-normal focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="relative flex flex-col justify-between 2xl:h-[80px]">
                      <label
                        htmlFor="contact-email"
                        className="font-sans font-light text-[14px] sm:text-[15px] 2xl:text-[16px] 2xl:leading-[24px] tracking-[0.3em] text-black uppercase block mb-1 2xl:mb-[16px]"
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
                        className="w-full bg-transparent border-b-[0.5px] border-black/50 focus:border-black pb-1.5 2xl:pb-0 text-[15px] 2xl:text-[16px] 2xl:leading-[24px] text-black placeholder:text-black/35 font-sans font-light tracking-normal focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="relative flex flex-col justify-between 2xl:h-[80px]">
                    <label
                      htmlFor="contact-phone"
                      className="font-sans font-light text-[14px] sm:text-[15px] 2xl:text-[16px] 2xl:leading-[24px] tracking-[0.3em] text-black uppercase block mb-1 2xl:mb-[16px]"
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
                      className="w-full bg-transparent border-b-[0.5px] border-black/50 focus:border-black pb-1.5 2xl:pb-0 text-[15px] 2xl:text-[16px] 2xl:leading-[24px] text-black placeholder:text-black/35 font-sans font-light tracking-normal focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Interest Select */}
                  <div className="relative flex flex-col justify-between 2xl:h-[80px]">
                    <label
                      htmlFor="contact-interest"
                      className="font-sans font-light text-[14px] sm:text-[15px] 2xl:text-[16px] 2xl:leading-[24px] tracking-[0.3em] text-black uppercase block mb-1 2xl:mb-[16px]"
                    >
                      INTEREST
                    </label>
                    <div className="relative">
                      <select
                        id="contact-interest"
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b-[0.5px] border-black/50 focus:border-black pb-1.5 2xl:pb-0 text-[15px] 2xl:text-[16px] 2xl:leading-[24px] text-black font-sans font-light tracking-normal focus:outline-none transition-colors appearance-none pr-8 cursor-pointer"
                      >
                        {INTEREST_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="text-black bg-white">
                            {opt}
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
                      className="font-sans font-light text-[14px] sm:text-[15px] 2xl:text-[16px] 2xl:leading-[24px] tracking-[0.3em] text-black uppercase block mb-1 2xl:mb-[16px]"
                    >
                      MESSAGE
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={1}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="A anniversary in the Mara, a first safari with the children, a slow week by the ocean..."
                      className="w-full bg-transparent border-b-[0.5px] border-black/50 focus:border-black pb-1.5 2xl:pb-0 text-[15px] 2xl:text-[16px] 2xl:leading-[24px] text-black placeholder:text-black/35 font-sans font-light tracking-normal focus:outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submit Button (Exact 186x52px with 101px gap above on large screens) */}
                  <div className="pt-2 2xl:pt-0 2xl:mt-[101px]">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto 2xl:w-[186px] 2xl:h-[52px] bg-black text-white font-sans font-light text-[15px] sm:text-[16px] 2xl:text-[18px] 2xl:leading-[24px] tracking-normal px-8 py-3 2xl:px-0 2xl:py-0 hover:bg-neutral-800 active:scale-[0.99] transition-all duration-200 cursor-pointer inline-flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
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
