"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Container } from "@/components/common/Container";
import { TextBlock } from "@/components/common/TextBlock";

export function HighlightsSection() {
  return (
    <section className="spacing">
      <Container>
        <SectionHeading
          eyebrow="Highlights"
          title="Moments You'll Never Forget"
        />

        {/* Top Row: Dancer & Cultural Escape */}
        <div className="mt-[44px] md:mt-24 flex flex-col xl:flex-row gap-[45px] md:gap-12 xl:gap-[90px]">
          {/* Left Column */}
          <div className="w-full xl:w-[58%] flex flex-col">
            {/* Below md the images break the Container's right gutter to reach
                the screen edge, and take a 20px left inset (16px gutter + 4px)
                per the mobile frame. w-auto lets the negative margin widen the
                box; md:w-full restores normal in-column behaviour. */}
            <div className="relative w-auto md:w-full lg:w-[70%] xl:w-[85%] 2xl:w-full ml-1 -mr-4 md:ml-0 md:mr-0 aspect-[420/317] md:aspect-[886/700]">
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
          <div className="w-full xl:w-[42%] xl:min-w-0 flex flex-col pt-0 md:pt-12 xl:pt-0 xl:justify-center 2xl:pt-[10%] 2xl:justify-start">
            <TextBlock
              className="pr-4 md:pr-0"
              eyebrow="Cultural Escape"
              title="Discover Kerala's Rich Culture"
              titleClassName="md:mt-[30px]"
              description="Immerse yourself in traditions that have been preserved for generations. Watch the expressive movements of a Kathakali performance, witness the discipline of Kalaripayattu martial arts, stroll through fragrant spice plantations, and experience colorful festivals that celebrate Kerala's vibrant heritage."
              descriptionClassName="md:mt-[27px] max-w-[612px]"
              ctaLabel="GET STARTED"
            />

            {/* Mirrored against the other two: this one bleeds off the LEFT
                edge and insets 20px on the right, which also matches the way
                it overhangs its column to the left from xl up. */}
            <div className="relative w-auto md:w-full lg:w-[70%] lg:ml-auto xl:w-full -ml-4 mr-1 md:ml-0 md:mr-0 aspect-[600/380] xl:aspect-[782/300] mt-[45px] md:mt-16 xl:mt-[96px] z-20 xl:hidden 2xl:block 2xl:w-[782px] 2xl:h-[300px] xl:-ml-[240px]">
              <Image
                src="/destinations/kerala/elephants-sri-lanka.jpg"
                alt="Elephants in Kerala"
                fill
                className="object-cover object-bottom"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>

        {/* Bottom Row: Spotlight/Yoga & Houseboat/Mountain Retreat */}
        <div className="mt-16 lg:mt-[20px] xl:mt-[96px] 2xl:mt-[20px] flex flex-col xl:flex-row gap-[45px] md:gap-12 xl:gap-[20px]">
          {/* Left Column */}
          <div className="w-full xl:w-1/2 flex flex-col">
            <TextBlock
              className="md:pr-[15%] lg:w-[70%] lg:ml-auto lg:pr-0 xl:w-full xl:ml-0 xl:pl-[90px]"
              eyebrow="Spotlight Experience"
              title="Cruise Through Timeless Backwaters"
              description="Step aboard a traditional houseboat and drift through Kerala's serene backwaters, where quiet canals, swaying coconut palms, and charming villages create a journey unlike any other. Slow down, soak in the scenery, and experience life at its most peaceful."
              ctaLabel="PLAN MY TRIP"
            />

            <div className="hidden xl:block relative w-full lg:w-[70%] xl:w-[85%] 2xl:w-full aspect-[875/846] mt-16 md:mt-24 md:pr-12">
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
          <div className="w-full xl:w-1/2 flex flex-col mt-0 xl:mt-0 relative">
            <div className="relative w-auto md:w-full lg:w-[70%] xl:w-[85%] xl:ml-auto 2xl:w-full ml-1 -mr-4 md:ml-0 md:mr-0 aspect-[864/600] xl:max-w-[864px]">
              <Image
                src="/destinations/kerala/houseboat-alappuzha.jpg"
                alt="Houseboat in Kerala Backwaters"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>

            <TextBlock
              className="mt-[45px] md:mt-16 xl:mt-0 xl:flex-1 xl:justify-center xl:pl-[90px]"
              eyebrow="Mountain Retreat"
              title="Embrace Nature & Wellness"
              description="Walk through endless tea plantations, explore wildlife in protected forests, savor authentic Kerala cuisine, and unwind with rejuvenating Ayurveda therapies. Every experience brings you closer to the heart of Kerala, leaving you refreshed, inspired, and connected to the destination."
              ctaLabel="VIEW DESTINATIONS"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
