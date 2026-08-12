"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/common/SectionHeading";

export function PlanJourneySection() {
  return (
    <section className="bg-[#FAF7F2] spacing">
      <div className="container">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            align="center"
            eyebrow="Why Travel With Fortune"
            title="We Plan Every Journey Around You"
          />
          <p className="font-sans text-[13px] md:text-[18px] font-light leading-[21px] md:leading-[1.6] text-black/80 text-center mt-6">
            Every traveler has a different idea of the perfect holiday, and
            that's exactly how we approach every itinerary. We take the time to
            understand your interests, travel style, and expectations before
            crafting a journey that's uniquely yours. From handpicked stays and
            trusted local experiences to comfortable transportation and dedicated
            travel support, every detail is thoughtfully planned so you can
            focus on making memories, not managing logistics.
          </p>
        </div>

        {/* Graphic & Steps Section */}
        <div className="max-w-[1050px] mx-auto relative">
          
          {/* Desktop Layout (md and up) */}
          <div className="hidden md:block mt-24">
            <div 
              className="relative w-full opacity-80 mx-auto" 
              style={{ aspectRatio: '1050 / 147' }}
            >
              <Image
                src="/destinations/kerala/plan-line.png"
                alt="Journey timeline line"
                fill
                className="object-cover object-center"
              />
            </div>

            <div className="grid grid-cols-3 mt-6">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <h4 className="font-heading text-[22px] leading-[28px] text-[#343434]">
                  We Listen Before <br /> We Plan
                </h4>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <h4 className="font-heading text-[22px] leading-[28px] text-[#343434]">
                  Every Trip Is Made <br /> for You
                </h4>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <h4 className="font-heading text-[22px] leading-[28px] text-[#343434]">
                  We're With You Along <br /> the Way
                </h4>
              </div>
            </div>
          </div>

          {/* Mobile Layout (< md) */}
          <div className="md:hidden relative w-full h-[250px] mt-12 max-w-[484px] mx-auto overflow-hidden">
            {/* The Image */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full opacity-80" 
              style={{ aspectRatio: '484 / 161' }}
            >
              <Image
                src="/destinations/kerala/plan-line.png"
                alt="Journey timeline line"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Text 1: Top Left */}
            <div className="absolute top-0 left-0 w-[45%] flex flex-col text-center">
              <h4 className="font-heading text-[15px] sm:text-[18px] leading-[20px] sm:leading-[24px] text-[#343434]">
                We Listen Before <br /> We Plan
              </h4>
            </div>

            {/* Text 2: Top Right */}
            <div className="absolute top-0 right-0 w-[45%] flex flex-col text-center">
              <h4 className="font-heading text-[15px] sm:text-[18px] leading-[20px] sm:leading-[24px] text-[#343434]">
                Every Trip Is Made <br /> for You
              </h4>
            </div>

            {/* Text 3: Bottom Center */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] flex flex-col text-center">
              <h4 className="font-heading text-[15px] sm:text-[18px] leading-[20px] sm:leading-[24px] text-[#343434]">
                We're With You Along <br /> the Way
              </h4>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
