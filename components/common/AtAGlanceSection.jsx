import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

export function AtAGlanceSection({
  eyebrow = "Good to know",
  title = "At a glance.",
  description,
  stats = [],
  className,
}) {
  return (
    <section className={cn("bg-cream py-16 md:py-24 lg:max-xl:py-[75px] xl:max-2xl:py-[85px] 2xl:py-[100px] relative z-10", className)}>
      <Container>
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          description={description}
          titleClassName="max-w-[800px] mx-auto"
          descriptionClassName="max-w-[700px] mx-auto"
        />

        <div className="mt-16 md:mt-20 lg:mt-[95px] w-full max-w-[1920px] mx-auto overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4">
          <ul className="flex min-w-max xl:min-w-0 xl:grid xl:grid-cols-6 divide-x divide-black/10">
            {stats.map((stat, i) => (
              <li
                key={stat.label}
                className="flex flex-col items-center text-center px-6 lg:px-10 xl:px-4 shrink-0 w-[200px] xl:w-auto"
              >
                <h4 className="font-sans text-[15px] lg:max-xl:text-[14px] xl:max-2xl:text-[15px] 2xl:text-[16px] font-medium text-black mb-3">
                  {stat.label}
                </h4>
                <p className="font-sans text-[13px] lg:max-xl:text-[12px] xl:max-2xl:text-[13px] 2xl:text-[14px] font-light text-black/70 leading-[1.6] whitespace-pre-line">
                  {stat.value}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
