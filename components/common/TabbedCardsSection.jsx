"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { useReveal } from "@/lib/useReveal";

export function TabbedCardsSection({
  eyebrow,
  title,
  description,
  tabs = [],
  cardsData = {},
  sectionAriaLabel = "Tabbed cards section",
}) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key);
  const activeTab = tabs.find((tab) => tab.key === activeKey);
  const sectionRef = useRef(null);
  const isFirstRender = useRef(true);
  const tabsRef = useReveal({ delay: 0.1, stagger: 0.05, y: 16 });
  const cardsRef = useReveal({ stagger: 0.15, y: 40 });

  useGSAP(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".departure-card", {
          y: 24,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
      });
    },
    { scope: sectionRef, dependencies: [activeKey] },
  );

  if (!tabs || tabs.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      aria-label={sectionAriaLabel}
      className="spacing"
    >
      <Container>
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div
          ref={tabsRef}
          className="mt-16 flex max-xl:flex-nowrap max-xl:overflow-x-auto max-xl:[scrollbar-width:none] max-xl:[&::-webkit-scrollbar]:hidden flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-6 xl:gap-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              aria-pressed={activeKey === tab.key}
              onClick={() => setActiveKey(tab.key)}
              className={cn(
                "whitespace-nowrap border-x transition-colors cursor-pointer",
                "text-[12px] px-3 py-1.5",
                "sm:text-[14px] sm:px-4 sm:py-2",
                "lg:text-[16px] lg:px-5 lg:py-2.5",
                "xl:text-[18px] xl:px-7 xl:py-3",
                activeKey === tab.key
                  ? "border-transparent bg-black text-white"
                  : "border-black/20 text-black/80 hover:text-black dark:border-cream/20 dark:text-cream/80 dark:hover:text-cream",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Container>

      <ul ref={cardsRef} className="max-sm:mt-8 mt-20 grid gap-1.5 px-1.5 md:grid-cols-2">
        {cardsData[activeKey]?.map((card) => (
          <li
            key={card.title}
            className="departure-card relative max-sm:aspect-[432/273] aspect-[951/696] overflow-hidden"
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
              aria-hidden="true"
            />

            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8 md:pt-11 md:pb-16">
              <span className="text-body max-sm:text-[12px] max-sm:font-light text-white/80">
                {activeTab?.name ? `${activeTab.name}.` : ""}
              </span>
              <div>
                <h3 className="text-white max-sm:text-[18px] max-sm:leading-none max-sm:tracking-[-0.01em]">
                  {card.title}
                </h3>
                <p className="mt-3 max-sm:mt-1 max-sm:text-[12px] max-sm:leading-6 max-sm:font-normal text-white/80">
                  {card.meta}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
