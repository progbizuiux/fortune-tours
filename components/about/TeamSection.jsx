import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";

const TEAM = [
  {
    name: "Lorem Ipsum",
    role: "LOREM IPSUM DOLOR",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/inner-page/Rectangle 37.png",
  },
  {
    name: "Lorem Ipsum",
    role: "LOREM IPSUM DOLOR",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/inner-page/Rectangle 38.png",
  },
  {
    name: "Lorem Ipsum",
    role: "LOREM IPSUM DOLOR",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/inner-page/Rectangle 39.png",
  },
  {
    name: "Lorem Ipsum",
    role: "LOREM IPSUM DOLOR",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/inner-page/Rectangle 40.png",
  },
  {
    name: "Lorem Ipsum",
    role: "LOREM IPSUM DOLOR",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/inner-page/Rectangle 37.png",
  },
  {
    name: "Lorem Ipsum",
    role: "LOREM IPSUM DOLOR",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/inner-page/Rectangle 38.png",
  },
  {
    name: "Lorem Ipsum",
    role: "LOREM IPSUM DOLOR",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/inner-page/Rectangle 39.png",
  },
  {
    name: "Lorem Ipsum",
    role: "LOREM IPSUM DOLOR",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
              {/* Profile Skeleton Placeholder */}
              <div className="relative aspect-[422/473] w-full bg-[#EFEFEF] mb-5 md:mb-6 rounded-[2px] overflow-hidden flex items-end justify-center">
                <svg
                  className="w-[55%] h-[55%] text-[#D1D5DB] translate-y-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
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
