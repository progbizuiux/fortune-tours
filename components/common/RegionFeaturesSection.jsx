import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

const FALLBACK_FEATURES = [
  {
    title: "19 Years of Experience",
    body: "Hundreds of unique destinations and thousands of unforgettable journeys have shaped the way we plan every adventure.",
  },
  {
    title: "All-Inclusive Pricing",
    body: "What we quote covers what you need — from park fees to internal transfers — with no surprises at checkout.",
  },
  {
    title: "Curated Safari Itineraries",
    body: "Routes in Kenya, Tanzania, and South Africa focus on genuine wildlife experiences, not rushed checklists.",
  },
  {
    title: "Trusted Experiences",
    body: "Established local operators and experienced rangers help keep drives and transfers running smoothly.",
  },
  {
    title: "Dedicated Support",
    body: "A tour manager stays with your group throughout the journey and handles every detail.",
  },
  {
    title: "Visa Assistance",
    body: "Trusted partners coordinate eligible visa applications and document checks for all major African destinations.",
  },
];

/* Desktop column count follows the item count, so the row fills its track
   instead of leaving a dead column and reading as off-centre. Written out
   rather than interpolated because Tailwind only sees whole class names.
   Beyond six, wrap onto a second row of six. */
const XL_WIDTHS = {
  1: "xl:w-full",
  2: "xl:w-1/2",
  3: "xl:w-1/3",
  4: "xl:w-1/4",
  5: "xl:w-1/5",
  6: "xl:w-1/6",
};

export function RegionFeaturesSection({
  eyebrow = "Why Fortune tours",
  title = "Africa rewards travellers who plan well.",
  description = "Visa rules, health precautions, park permits and long distances between destinations all need careful handling. Our experience helps take that complexity away.",
  features = FALLBACK_FEATURES,
}) {
  return (
    <section className="relative z-10 bg-[#FAF7F2] spacing">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          description={description}
          titleClassName="max-w-[1050px]"
          descriptionClassName="max-w-[828px]"
        />
      </Container>

      {/* Features Grid */}
      <div className="w-full px-4 md:px-8 lg:px-[80px] mt-[95px]">
        <div className={cn(
          "flex flex-wrap justify-center gap-y-12 max-w-[1920px] mx-auto"
        )}>
          {features.map((feature, i) => {
            // If we have > 4 items (e.g. 6), we hide the last 2 on mobile/tablet.
            const hideOnSmall = features.length > 4 && i >= features.length - 2;
            const visibleOnSmallCount = features.length > 4 ? features.length - 2 : features.length;

            // Determine if the item is in the last row for each breakpoint
            const isLastRowMobile = i === visibleOnSmallCount - 1; // 1 col (max-md)
            // On md (2 cols), if there are 3 items, last row is just the last 1.
            const itemsInLastTabletRow = visibleOnSmallCount % 2 || 2;
            const isLastRowTablet = i >= visibleOnSmallCount - itemsInLastTabletRow && i < visibleOnSmallCount;
            
            // On lg (3 cols), if there are 6 items, last row is last 3. If 4 items, last row is just the last 1.
            const itemsInLastLgRow = visibleOnSmallCount % 3 || 3;
            const isLastRowLg = i >= visibleOnSmallCount - itemsInLastLgRow;
            
            return (
              <div
                key={i}
                className={cn(
                  "w-full md:w-1/2 lg:w-1/3",
                  XL_WIDTHS[features.length] ?? "xl:w-1/6",
                  "flex flex-col items-center justify-start xl:justify-between text-center px-[22px] h-full pt-2",
                  hideOnSmall && "max-lg:hidden",
                  // Vertical borders
                  "md:border-r border-black/10 last:border-r-0",
                  "md:max-lg:even:border-r-0", // On 2-col (md), every 2nd item has no right border
                  "lg:max-xl:[&:nth-child(3n)]:border-r-0", // On 3-col (lg), every 3rd item has no right border
                  
                  // Horizontal borders
                  "border-b border-black/10 max-xl:pb-8",
                  isLastRowMobile && "max-md:border-b-0 max-md:pb-0",
                  isLastRowTablet && "md:max-lg:border-b-0 md:max-lg:pb-0",
                  isLastRowLg && "lg:max-xl:border-b-0 lg:max-xl:pb-0",
                  "xl:border-b-0 xl:pb-0" // No bottom borders on desktop
                )}
              >
              {/* Two lines' worth of height at every breakpoint, with the
                  title bottom-aligned inside it: titles run to one or two
                  lines, and without a common floor each description starts at
                  a different baseline across the row. xl is 2 x 33px leading. */}
              <h3 className="flex items-end justify-center font-heading max-lg:text-[20px] lg:max-xl:text-[18px] xl:max-2xl:text-[21px] 2xl:text-[24px] font-normal max-xl:leading-[1.2] xl:leading-[33px] text-black max-xl:min-h-[48px] xl:min-h-[66px]">
                {feature.title}
              </h3>
              <p className="mt-[10px] font-sans max-lg:text-[14px] lg:max-xl:text-[13px] xl:max-2xl:text-[14.5px] 2xl:text-[16px] font-light max-xl:leading-[21px] xl:leading-[24px] text-black/80 max-xl:flex-1">
                {feature.body}
              </p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
