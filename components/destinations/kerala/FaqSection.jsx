"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

/* Good-to-know: the accordion of questions with the contact block beside it.
 *
 * The CMS has carried this section since the content type was written —
 * sections.kerala-faq, twelve questions on the Kerala entry and six on India —
 * but no component ever drew it, so the answers sat in the database unread.
 * This is that component.
 *
 * Two columns from lg, stacked below: the contact block leads on a phone,
 * where a reader who wants to ask rather than read should not have to scroll
 * the whole accordion first.
 *
 * One row open at a time. A set of independently-toggling rows lets a reader
 * open every answer and lose the shape of the list; with one open, the
 * questions stay scannable, which is the point of an accordion over a page of
 * headed paragraphs.
 *
 * Buttons rather than <details>: the open row animates its body height, and
 * the native element's toggle cannot be transitioned. aria-expanded and
 * aria-controls carry what <details> would have given for free.
 */
export function FaqSection({
  eyebrow,
  title,
  description,
  contactTitle,
  contactSubtitle,
  phone,
  email,
  items,
}) {
  /* First row open on arrival, so the section reads as answered rather than as
     a wall of closed bars. */
  const [openKey, setOpenKey] = useState(items?.[0]?.key);

  if (!items?.length) return null;

  return (
    <section aria-label={title || "Frequently asked questions"} className="spacing lg:max-xl:pt-[20px] xl:max-2xl:pt-[30px]">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-20">
          {/* 40% against the accordion's 60%, the split the rest of this page
              uses for a copy column beside a content column. */}
          <div className="flex flex-col gap-8 lg:w-[40%] lg:shrink-0">
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              description={description}
            />

            {(contactTitle || phone || email) && (
              <div className="flex flex-col gap-2 border-t border-black/10 pt-8 dark:border-cream/10">
                {contactTitle && (
                  <h3 className="font-heading text-[20px] leading-[1.2] font-normal text-navy dark:text-cream">
                    {contactTitle}
                  </h3>
                )}
                {contactSubtitle && (
                  <p className="text-body text-black/70 dark:text-cream/70">
                    {contactSubtitle}
                  </p>
                )}

                {/* tel: and mailto: rather than plain text — this block exists
                    to be acted on, and on a phone that is one tap. The href
                    strips spaces the CMS copy carries for legibility. */}
                <div className="mt-2 flex flex-col gap-1">
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                      className="text-body text-navy underline-offset-4 transition-colors hover:underline dark:text-cream"
                    >
                      {phone}
                    </a>
                  )}
                  {email && (
                    <a
                      href={`mailto:${email.toLowerCase()}`}
                      className="text-body text-navy underline-offset-4 transition-colors hover:underline dark:text-cream"
                    >
                      {email}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <ul className="flex flex-1 flex-col border-t border-black/10 dark:border-cream/10">
            {items.map((item) => {
              const isOpen = openKey === item.key;

              return (
                <li
                  key={item.key}
                  className="border-b border-black/10 dark:border-cream/10"
                >
                  <button
                    type="button"
                    onClick={() => setOpenKey(isOpen ? null : item.key)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.key}`}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
                  >
                    <span
                      className={cn(
                        "font-sans text-[15px] leading-[1.4] font-light transition-colors lg:max-xl:text-[16px] xl:max-2xl:text-[18px] 2xl:text-[18px]",
                        isOpen
                          ? "text-navy dark:text-cream"
                          : "text-black/80 dark:text-cream/80",
                      )}
                    >
                      {item.question}
                    </span>
                    {/* aria-hidden: the button's own aria-expanded already
                        announces the state, so the icon would say it twice. */}
                    {isOpen ? (
                      <Minus
                        aria-hidden="true"
                        className="size-5 shrink-0 stroke-1 text-navy dark:text-cream"
                      />
                    ) : (
                      <Plus
                        aria-hidden="true"
                        className="size-5 shrink-0 stroke-1 text-black/60 dark:text-cream/60"
                      />
                    )}
                  </button>

                  {/* grid-rows 0fr → 1fr animates to the answer's own height,
                      which a max-height transition can only approximate. The
                      inner overflow-hidden is what makes the collapsed row
                      clip rather than spill. */}
                  <div
                    id={`faq-answer-${item.key}`}
                    role="region"
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-3 pb-6 lg:pr-12">
                        {item.answer.map((paragraph, i) => (
                          <p
                            key={i}
                            className="font-sans text-[13px] leading-[1.6] font-light text-black/70 lg:max-xl:text-[14.5px] xl:max-2xl:text-[16px] 2xl:text-[16px] dark:text-cream/70"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
