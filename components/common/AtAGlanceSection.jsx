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
    <section className={cn("bg-cream spacing relative z-10", className)}>
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
          <ul className={cn(
            "flex min-w-max xl:min-w-0 xl:grid divide-x divide-black/10",
            stats.length === 1 && "xl:grid-cols-1 xl:max-w-[400px] xl:mx-auto",
            stats.length === 2 && "xl:grid-cols-2 xl:max-w-[800px] xl:mx-auto",
            stats.length === 3 && "xl:grid-cols-3 xl:max-w-[1200px] xl:mx-auto",
            stats.length === 4 && "xl:grid-cols-4 xl:max-w-[1500px] xl:mx-auto",
            stats.length === 5 && "xl:grid-cols-5 xl:max-w-[1700px] xl:mx-auto",
            (stats.length >= 6 || stats.length === 0) && "xl:grid-cols-6"
          )}>
            {stats.map((stat, i) => (
              <li
                key={stat.label}
                className="flex flex-col items-center text-center px-6 lg:px-10 xl:px-4 shrink-0 w-[200px] xl:w-auto"
              >
                <h4 className="font-sans text-[15px] lg:max-xl:text-[14px] xl:max-2xl:text-[16px] 2xl:text-[16px] font-medium text-black mb-3">
                  {stat.label}
                </h4>
                <p className="font-sans text-[13px] lg:max-xl:text-[12px] xl:max-2xl:text-[14px] 2xl:text-[14px] font-light text-black/70 leading-[1.6] whitespace-pre-line">
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
