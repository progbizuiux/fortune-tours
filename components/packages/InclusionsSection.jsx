"use client";

import { useState } from "react";
import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

/* "What's Covered & What's Not" — the two-panel inclusions list.
 *
 * Deliberately NOT components/common/TabbedCardsSection: that one switches
 * between sets of picture cards and brings a GSAP crossfade with it. This frame
 * switches between two plain lists of text set inline and divided by rules, so
 * reusing it would mean bending a card grid into a paragraph. The tab control
 * is the only thing the two share, and it is six lines.
 *
 * Client-side because the toggle is: the panels are the whole point of the
 * section, so both sets render into the markup and the state only chooses which
 * is shown. That keeps the "not covered" copy in the page source for search
 * engines, and it is what makes a no-JS visitor still see the covered list.
 *
 * Shape-only. All copy comes from the page; see lib/packages.js.
 */
export function InclusionsSection({
  eyebrow = "All you need",
  title = "What's Covered & What's Not",
  description,
  tabs = [],
  className,
}) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key);
  const activeTab = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];

  if (!tabs.length) return null;

  return (
    <section
      aria-label={title}
      className={cn("bg-cream relative z-10 spacing", className)}
    >
      <Container>
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          description={description}
          titleClassName="max-w-[900px] mx-auto"
          descriptionClassName="max-w-[700px] mx-auto"
        />

        <AnimateIn>
          {/* The rule the frame draws under the heading, with the tab row
              sitting on it. */}
          <div className="mt-10 md:mt-12 lg:mt-[55px] border-t border-black/10" />

          <div
            role="tablist"
            aria-label={title}
            className="-mt-px flex items-stretch justify-center"
          >
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab?.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  id={`inclusions-tab-${tab.key}`}
                  aria-selected={isActive}
                  aria-controls={`inclusions-panel-${tab.key}`}
                  onClick={() => setActiveKey(tab.key)}
                  className={cn(
                    "px-8 md:px-10 lg:px-[50px] py-3 lg:py-[14px] font-sans text-[14px] lg:text-[15px] xl:text-[16px] leading-none transition-colors",
                    /* A hairline after every control, the last one included —
                       the frame closes the tab row off against the rule on its
                       right as well as splitting the two labels. */
                    "border-r border-black/10",
                    isActive
                      ? "bg-black text-white font-normal"
                      : "text-black/60 font-light hover:text-black",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {tabs.map((tab) => (
            <div
              key={tab.key}
              role="tabpanel"
              id={`inclusions-panel-${tab.key}`}
              aria-labelledby={`inclusions-tab-${tab.key}`}
              /* Hidden rather than unmounted, so both lists ship in the HTML
                 and the inactive one stays readable to a crawler and to a
                 visitor whose JS never ran. */
              hidden={tab.key !== activeTab?.key}
              className="mt-8 md:mt-10 lg:mt-[45px] bg-white px-6 md:px-10 lg:px-[60px] py-10 md:py-12 lg:py-[55px]"
            >
              <h3 className="text-center font-heading text-[20px] md:text-[22px] lg:text-[24px] leading-[1.2] text-navy">
                {tab.title}
              </h3>

              {/* Set inline and wrapped, divided by rules — the frame runs the
                  items across the panel rather than down it. A list, not a
                  paragraph, so it still reads as one to a screen reader. */}
              <ul className="mt-6 lg:mt-[35px] flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
                {tab.items?.map((item, i) => (
                  <li key={item} className="flex items-center gap-x-4">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="h-[14px] w-px bg-black/20"
                      />
                    )}
                    <span className="font-sans font-light text-[13px] lg:text-[14px] xl:text-[15px] leading-[1.6] text-black/75">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </AnimateIn>
      </Container>
    </section>
  );
}
