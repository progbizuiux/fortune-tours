"use client";

import { useState } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    num: "01",
    title: "Custom Tour Planning",
    description:
      "Personalized itineraries built around your destination, interests, travel style, and preferred pace. Every detail is planned to create a journey that feels right for you.",
  },
  {
    num: "02",
    title: "Visa & Passport Assistance",
    description:
      "Guidance with essential travel documentation, requirements, and application preparation. We help make the preparation process clearer and easier to navigate.",
  },
  {
    num: "03",
    title: "Flight & Hotel Booking",
    description:
      "Flights and stays arranged around your itinerary, preferred timings, location, comfort, and travel needs. We coordinate the essentials so your journey comes together smoothly.",
  },
  {
    num: "04",
    title: "Travel Insurance",
    description:
      "Travel insurance assistance to help you prepare for unexpected situations and travel with greater confidence. We help you understand the available options before you set off.",
  },
];

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-white spacing">
      <Container>
        <SectionHeading
          eyebrow="Our Services"
          title="Everything You Need to Travel"
          titleClassName="max-w-none"
        />

        <div className="mt-12 md:mt-16 lg:max-xl:mt-10 xl:mt-[64px] xl:max-2xl:mt-12 2xl:mt-[64px] flex flex-col">
          {SERVICES.map((service, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={service.num}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex flex-col md:flex-row md:items-start transition-colors duration-300 cursor-default",
                  "py-8 md:py-[42px] px-6 md:px-12 lg:max-xl:py-8 lg:max-xl:px-8",
                  "xl:py-[60px] xl:px-10 xl:max-2xl:py-10 xl:max-2xl:px-8 2xl:h-[293px] 2xl:pt-[84px] 2xl:pb-0 2xl:px-[56px]",
                  "gap-4 md:gap-8 lg:gap-16 lg:max-xl:gap-10 xl:gap-12 xl:max-2xl:gap-10 2xl:gap-[253px]",
                  isActive
                    ? "bg-cream border-transparent"
                    : "bg-white border-b border-black/10 last:border-b-0"
                )}
              >
                <div className="shrink-0">
                  <span
                    className={cn(
                      "font-heading font-light leading-none transition-colors duration-300",
                      "text-[40px] md:text-[48px] lg:max-xl:text-[42px] xl:text-[56px] xl:max-2xl:text-[55px] 2xl:text-[72px]",
                      isActive ? "text-black" : "text-black/[0.37]"
                    )}
                  >
                    {service.num}
                  </span>
                </div>
                <div className="flex-1 flex flex-col xl:pt-1">
                  <h3 className="font-heading text-[18px] md:text-[20px] lg:max-xl:text-[19px] xl:text-[30px] xl:max-2xl:text-[26.5px] xl:max-2xl:leading-[33px] 2xl:text-[30px] 2xl:leading-[36px] text-[#16150F] mb-2 lg:max-xl:mb-1.5 xl:max-2xl:mb-2 2xl:mb-3">
                    {service.title}
                  </h3>
                  <p className="font-sans text-[13px] md:text-[14px] lg:max-xl:text-[13px] lg:max-xl:leading-[1.4] xl:text-body xl:max-2xl:text-[16px] xl:max-2xl:leading-[1.4] 2xl:text-body 2xl:leading-normal font-light text-black/80 max-w-[755px]">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
