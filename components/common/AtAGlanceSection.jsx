"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
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
  const scrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => {
      const overflow = el.scrollWidth > el.clientWidth + 4;
      setHasOverflow(overflow);
      setCanScrollRight(
        overflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 10,
      );
    };

    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [stats]);

  const handleScrollClick = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: 240, behavior: "smooth" });
  };

  return (
    <section className={cn("bg-cream spacing relative z-10", className)}>
      <Container>
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          description={description}
          titleClassName="max-w-[800px] mx-auto"
          descriptionClassName="max-w-[1100px] mx-auto"
        />

        <div className="relative mt-16 md:mt-20 lg:mt-[95px]">
          <div
            ref={scrollRef}
            className="w-full max-w-[1920px] mx-auto overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4"
          >
            <ul
              className={cn(
                "flex min-w-max xl:min-w-0 xl:grid divide-x divide-black/10",
                stats.length === 1 && "xl:grid-cols-1 xl:max-w-[400px] xl:mx-auto",
                stats.length === 2 && "xl:grid-cols-2 xl:max-w-[800px] xl:mx-auto",
                stats.length === 3 && "xl:grid-cols-3 xl:max-w-[1200px] xl:mx-auto",
                stats.length === 4 && "xl:grid-cols-4 xl:max-w-[1500px] xl:mx-auto",
                stats.length === 5 && "xl:grid-cols-5 xl:max-w-[1700px] xl:mx-auto",
                (stats.length >= 6 || stats.length === 0) && "xl:grid-cols-6",
              )}
            >
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

          {/* Animated scroll hint for small screens up to lg */}
          {hasOverflow && canScrollRight && (
            <button
              type="button"
              onClick={handleScrollClick}
              aria-label="Scroll to see more information"
              className="xl:hidden flex items-center justify-center gap-1.5 mx-auto mt-4 px-3.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 transition-colors text-navy/70 cursor-pointer"
            >
              <span className="font-top text-[11px] uppercase tracking-[0.14em] font-normal">
                Scroll
              </span>
              <span className="inline-flex items-center">
                <ChevronRight className="size-3.5 -mr-1.5 text-navy/40 animate-pulse" />
                <ChevronRight className="size-3.5 text-navy/80 animate-pulse" />
              </span>
            </button>
          )}
        </div>
      </Container>
    </section>
  );
}
