"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Container } from "@/components/common/Container";
import { ChevronRight } from "lucide-react";

export function HighlightsSection() {
  return (
    <section className="spacing">
      <Container>
        <SectionHeading
          eyebrow="Highlights"
          title="Moments You'll Never Forget"
        />

        {/* Top Row: Dancer & Cultural Escape */}
        <div className="mt-16 md:mt-24 flex flex-col xl:flex-row gap-16 md:gap-12 xl:gap-[90px]">
          {/* Left Column */}
          <div className="w-full xl:w-[58%] flex flex-col">
            <div className="relative w-full aspect-[886/700]">
              <Image
                src="/destinations/kerala/dancer-performing.png"
                alt="Kathakali Dancer"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 60vw, 100vw"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full xl:w-[42%] flex flex-col pt-12 xl:pt-[10%]">
            <div className="flex flex-col pr-4 md:pr-0">
              <span className="text-[16px] font-sans text-black">
                Cultural Escape
              </span>
              <h3 className="font-heading text-[32px] md:text-[45px] leading-[1.1] md:leading-[41.4px] md:tracking-[-0.7px] mt-[30px] text-navy">
                Discover Kerala's Rich Culture
              </h3>
              <p className="font-sans text-[16px] md:text-[18px] font-light leading-[1.5] md:leading-[28.9px] text-black/80 mt-[27px] max-w-[612px]">
                Immerse yourself in traditions that have been preserved for
                generations. Watch the expressive movements of a Kathakali
                performance, witness the discipline of Kalaripayattu martial
                arts, stroll through fragrant spice plantations, and
                experience colorful festivals that celebrate Kerala's vibrant
                heritage.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 mt-8 text-[11px] font-bold tracking-widest uppercase text-black hover:opacity-70 transition-opacity"
              >
                GET STARTED
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="relative w-full aspect-[600/380] xl:aspect-[782/300] mt-16 xl:mt-[96px] xl:-ml-[160px] z-20">
              <Image
                src="/destinations/kerala/elephants-sri-lanka.jpg"
                alt="Elephants in Kerala"
                fill
                className="object-cover object-center"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>

        {/* Bottom Row: Spotlight/Yoga & Houseboat/Mountain Retreat */}
        <div className="mt-16 lg:mt-[50px] flex flex-col xl:flex-row gap-16 md:gap-12 xl:gap-[109px]">
          {/* Left Column */}
          <div className="w-full xl:w-[58%] flex flex-col">
            <div className="flex flex-col md:pr-[15%]">
              <span className="text-[16px] font-sans text-black">
                Spotlight Experience
              </span>
              <h3 className="font-heading text-[32px] md:text-[45px] leading-[1.1] md:leading-[41.4px] md:tracking-[-0.7px] mt-[20px] text-navy">
                Cruise Through Timeless Backwaters
              </h3>
              <p className="font-sans text-[16px] md:text-[18px] font-light leading-[1.5] md:leading-[28.9px] text-black/80 mt-[32px] max-w-[611px]">
                Step aboard a traditional houseboat and drift through Kerala's
                serene backwaters, where quiet canals, swaying coconut palms,
                and charming villages create a journey unlike any other. Slow
                down, soak in the scenery, and experience life at its most
                peaceful.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 mt-8 text-[11px] font-bold tracking-widest uppercase text-black hover:opacity-70 transition-opacity"
              >
                PLAN MY TRIP
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="hidden xl:block relative w-full aspect-[875/846] mt-16 md:mt-24 md:pr-12">
              <Image
                src="/destinations/kerala/people-practicing.jpg"
                alt="Wellness and Yoga in Kerala"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 60vw, 100vw"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full xl:w-[42%] flex flex-col justify-center mt-16 xl:mt-0 relative">
            <div className="relative w-full aspect-[864/600]">
              <Image
                src="/destinations/kerala/houseboat-alappuzha.jpg"
                alt="Houseboat in Kerala Backwaters"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>

            <div className="flex flex-col justify-center mt-16 xl:mt-0">
              <span className="text-[16px] font-sans text-black">
                Mountain Retreat
              </span>
              <h3 className="font-heading text-[32px] md:text-[45px] leading-[1.1] md:leading-[41.4px] md:tracking-[-0.7px] mt-[20px] text-navy">
                Embrace Nature & Wellness
              </h3>
              <p className="font-sans text-[16px] md:text-[18px] font-light leading-[1.5] md:leading-[28.9px] text-black/80 mt-[32px] max-w-[611px]">
                Walk through endless tea plantations, explore wildlife in
                protected forests, savor authentic Kerala cuisine, and unwind
                with rejuvenating Ayurveda therapies. Every experience brings
                you closer to the heart of Kerala, leaving you refreshed,
                inspired, and connected to the destination.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 mt-8 text-[11px] font-bold tracking-widest uppercase text-black hover:opacity-70 transition-opacity"
              >
                VIEW DESTINATIONS
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
