"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

export function FaqSection({
  eyebrow = "Good To Know",
  title = "Questions with useful\nanswers",
  contactInfo,
  faqs = [],
  className,
}) {
  const [openIndex, setOpenIndex] = useState(0);

  // No FAQs in the CMS means nothing to show — an empty accordion under a
  // heading reads as a broken section, not an answered one.
  if (!faqs.length) return null;

  return (
    <section className={cn("bg-white pt-16 pb-16 md:pt-24 md:pb-24 lg:max-xl:pt-[45px] lg:max-xl:pb-[90px] xl:max-2xl:pt-[55px] xl:max-2xl:pb-[105px] 2xl:pt-[120px] 2xl:pb-[120px] relative z-10", className)}>
      <Container>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 xl:gap-[120px]">
          {/* Left Column */}
          <div className="w-full lg:w-[35%] shrink-0 flex flex-col">
            <h4 className="font-top text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px] 2xl:leading-[12px] text-[#6E6A63] font-normal mb-4 md:mb-6 lg:mb-8">
              {eyebrow}
            </h4>
            <h2 className="font-heading text-[32px] md:text-[36px] lg:text-[42px] xl:text-[48px] 2xl:text-[65px] leading-[1.1] 2xl:leading-[70px] tracking-[-0.02em] 2xl:tracking-[-2.52px] text-[#1C1C1A] max-lg:whitespace-normal whitespace-pre-line max-lg:w-full">
              {title}
            </h2>
            
            {contactInfo && (
              <div className="mt-8 md:mt-10 lg:mt-[55px] xl:mt-[65px] 2xl:mt-[75px] text-[13px] md:text-[14px] text-black font-light leading-[1.6] whitespace-pre-line">
                {contactInfo}
              </div>
            )}
          </div>

          {/* Right Column: Accordion */}
          <div className="w-full lg:flex-1 mt-4 lg:mt-0">
            <div className="flex flex-col">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div 
                    key={index} 
                    className={cn(
                      "group border-t border-black/10 overflow-hidden",
                      index === faqs.length - 1 && "border-b"
                    )}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between py-3.5 md:py-4 lg:py-[17px] xl:py-[18px] 2xl:py-[19px] text-left transition-colors hover:text-black/70"
                      aria-expanded={isOpen}
                    >
                      <span className="font-heading font-normal text-[#1C1C1A] text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] leading-[1.3] 2xl:leading-[42px] pr-8">
                        {faq.question}
                      </span>
                      <span className="shrink-0 text-black flex items-center justify-center w-[14px] h-[30px]">
                        {isOpen ? <Minus className="w-[14px] h-[14px]" strokeWidth={1.5} /> : <Plus className="w-[14px] h-[14px]" strokeWidth={1.5} />}
                      </span>
                    </button>
                    
                    <div 
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="font-sans font-light text-black/80 text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] leading-[1.6] 2xl:leading-[29px] whitespace-pre-line pr-4 md:pr-8 max-w-[828px] pt-1 md:pt-[5px] lg:pt-[6px] xl:pt-[6px] 2xl:pt-[7px] pb-5 md:pb-6 lg:pb-[22px] xl:pb-[24px] 2xl:pb-[26px]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
