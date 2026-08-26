import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";

const TEAM = [
  {
    name: "K. V. Thomas",
    role: "FOUNDER & MANAGING DIRECTOR",
    description:
      "Founded Fortune in 1996, personally reviews complex European and multi-generational itineraries.",
    image: "/inner-page/Rectangle 37.png",
  },
  {
    name: "Anjali Nair",
    role: "EUROPEAN & ALPINE SPECIALIST",
    description:
      "Has been to Switzerland eleven times and will tell you exactly which panoramic train transfers to take.",
    image: "/inner-page/Rectangle 38.png",
  },
  {
    name: "Rajesh Pillai",
    role: "LAKSHADWEEP & ISLAND LOGISTICS",
    description:
      "Coordinates over 90% of our Agatti flight slots, island entry permits, and Bangaram boat transfers.",
    image: "/inner-page/Rectangle 39.png",
  },
  {
    name: "Rajesh Pillai",
    role: "LAKSHADWEEP & ISLAND LOGISTICS",
    description:
      "Coordinates over 90% of our Agatti flight slots, island entry permits, and Bangaram boat transfers.",
    image: "/inner-page/Rectangle 40.png",
  },
  {
    name: "K. V. Thomas",
    role: "FOUNDER & MANAGING DIRECTOR",
    description:
      "Founded Fortune in 1996, personally reviews complex European and multi-generational itineraries.",
    image: "/inner-page/Rectangle 37.png",
  },
  {
    name: "Anjali Nair",
    role: "EUROPEAN & ALPINE SPECIALIST",
    description:
      "Has been to Switzerland eleven times and will tell you exactly which panoramic train transfers to take.",
    image: "/inner-page/Rectangle 38.png",
  },
  {
    name: "Rajesh Pillai",
    role: "LAKSHADWEEP & ISLAND LOGISTICS",
    description:
      "Coordinates over 90% of our Agatti flight slots, island entry permits, and Bangaram boat transfers.",
    image: "/inner-page/Rectangle 39.png",
  },
  {
    name: "Rajesh Pillai",
    role: "LAKSHADWEEP & ISLAND LOGISTICS",
    description:
      "Coordinates over 90% of our Agatti flight slots, island entry permits, and Bangaram boat transfers.",
    image: "/inner-page/Rectangle 40.png",
  },
];

export function TeamSection() {
  return (
    <section className="bg-white spacing">
      <Container>
        <SectionHeading
          eyebrow="Our Team"
          title="Faces Behind the journey"
        />

        <div className="mt-12 md:mt-16 xl:mt-[60px] flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-x-4 md:gap-x-4 lg:gap-x-5 xl:gap-x-6 2xl:gap-x-[25.66px] gap-y-12 xl:gap-y-20 2xl:gap-y-[138px] pb-8 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TEAM.map((member, index) => (
            <div key={index} className="flex flex-col w-[323px] shrink-0 snap-start lg:w-auto">
              {/* Image Placeholder */}
              <div className="relative aspect-[422/473] w-full bg-[#D9D9D9] mb-5 md:mb-6 rounded-[2px] overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <h3 className="font-heading text-[18px] md:text-[20px] xl:text-[22px] xl:leading-[32px] text-[#16150F] mb-1">
                {member.name}
              </h3>
              
              <p className="font-sans text-[10px] xl:text-[11px] leading-none lg:leading-tight xl:leading-snug 2xl:leading-[16.5px] uppercase tracking-[0.18em] text-black/50 mb-3 md:mb-4">
                {member.role}
              </p>
              
              <p className="font-sans text-[13px] xl:text-[12px] xl:leading-[19.5px] font-normal text-black/50">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
