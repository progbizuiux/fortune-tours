"use client";

import { useState } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    num: "01",
    title: "Group and Escorted Tours",
    description:
      "Set departure dates through the year, with a Malayalee tour manager, hotels, all meals, and every detail arranged before you leave. This is what most of our travellers book, and what twenty years of experience has made us best at.",
  },
  {
    num: "02",
    title: "Custom Trips and Honeymoon Packages",
    description:
      "Your own route, built around your dates, your interests, your budget and your pace. Whether it's a week in one country, a month across several, or a romantic escape for two, we plan it with the same care and experience we bring to our group tours.",
  },
  {
    num: "03",
    title: "Visa, Documentation and Travel Insurance",
    description:
      "We handle passport support, visa applications, embassy appointments, and every piece of travel paperwork that comes before you leave. Travel insurance is included in most international packages for travellers up to 70 years of age. We explain what's covered, what's not, and what to do if something goes wrong on the road.",
  },
  {
    num: "04",
    title: "Flights and Hotels",
    description:
      "Booked as part of your package, not as separate pieces. We choose flights for timing and hotels for location, negotiating rates that come from sending groups to the same properties year after year. Everything is coordinated so your journey flows seamlessly.",
  },
];

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-white spacing max-lg:pb-0!">
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
