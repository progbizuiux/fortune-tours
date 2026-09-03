import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

/* /about-us, second section — Figma "Behind The Journey".
 *
 * A centred eyebrow over the studio paragraph, then a four-up figure row ruled
 * off above and below.
 *
 * The heading pair is the site's shared SectionHeading in its centred variant,
 * so the eyebrow and the paragraph carry the same type as every other section
 * heading on the site. The frame draws no h2 between them — hence no `title`.
 *
 * Figma values, from the frame's own panels:
 *   eyebrow    Spartan 400, 20/16.5, centred, Title case, #000000 at 80%
 *   paragraph  Neiko 400, 36/54, letter-spacing 0, centred, #16150F, box 1159
 *   row        1160 x 249, grid, 1 row x 4 columns
 *   rules      1px TOP AND BOTTOM ONLY, #E0DACE — the frame's border panel
 *              reads 1px, 0px, 1px, 0px; the lines that look like column
 *              rules in the frame are Figma's own grid guide, not borders
 *   cell       48 above its content, 27 below it
 *   figure     Neiko 400, 48/48, letter-spacing 0, centred, #16150F
 *   label      Neiko 400, 12/16.5, letter-spacing 1.98px, UPPERCASE, centred,
 *              #000000 at 60%
 *   note       Poppins 400, 14/21, centred, 216 wide, #000000 at 80%
 *
 * A design-system token carries anything the scale already lands on at the
 * width the frame is drawn — the eyebrow is exactly `font-top text-h4`, whose
 * ramp tops out at that 20px. Where none does, the frame's value is stated and
 * then stepped DOWN per band rather than held: the scale's utilities compile to
 * their literal clamp and never see the 1024-1535 downscale in globals.css, so
 * left alone they stand at their widest right where this frame is drawn. Every
 * step is a non-overlapping band (max-lg / lg-to-xl / xl-to-2xl), which is what
 * keeps 36px paragraphs and 48px figures out of a 375px column.
 */

/* Not a Tailwind colour token: this rule appears in this frame only, and the
   palette in globals.css is the site's shared colours. */
const RULE_COLOR = "#E0DACE";

const INTRO =
  "Fortune Tours & Travels has been crafting journeys from Kerala for over two decades. With offices across Ernakulam, Kochi, Thrissur, Trivandrum and Kannur, we plan travel across India and around the world. Every journey is shaped around the people travelling not pulled from a shelf. From your first conversation to your final transfer, our team stays involved, making sure every detail feels considered, personal and effortless.";

const STATS = [
  {
    value: "2005",
    label: "Established",
    note: "Our specialists have travelled extensively",
  },
  {
    value: "5",
    label: "Offices in Kerala",
    note: "Our specialists have travelled extensively",
  },
  {
    value: "4,200",
    label: "Custom journeys",
    note: "Our specialists have travelled extensively",
  },
  {
    value: "21",
    label: "Years of continuous service",
    note: "Our specialists have travelled extensively",
  },
];

export function BehindTheJourneySection({ className }) {
  return (
    <section
      aria-label="Behind the journey"
      /* bg-background is load-bearing, not cosmetic: the hero above is sticky,
         so a transparent section scrolls over it and lets the hero show
         straight through this one's copy — the same reason every section that
         follows a PageHero carries it. */
      className={cn("relative z-10 bg-background spacing", className)}
    >
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Behind the journey"
          description={INTRO}
          /* Spartan 400 20/16.5 in the frame — which is what the centred
             variant's own `font-top text-h4` already is at the width it is
             drawn (the token tops out at 20px), so only the colour and that
             16.5/20 line box are stated. Below lg the shared eyebrow steps to
             12px, as every other section heading on the site does. */
          eyebrowClassName="text-black/80 lg:leading-[0.825]"
          /* Not body copy: the panel gives this paragraph Neiko 400 36/54 at
             #16150F across a 1159 box. The heading font, so it is stated here
             rather than left to the shared p — and stepped per band, since a
             36px paragraph in a 375px column would run twenty lines. 36 is
             text-h2's own floor; the steps below it come down from there. */
          descriptionClassName={cn(
            "font-heading font-normal text-[#16150F]",
            "max-lg:text-[20px] max-lg:leading-[1.45] max-lg:font-normal",
            "lg:max-xl:text-[28px] lg:max-xl:leading-[1.45]",
            "xl:max-2xl:text-[33px] xl:max-2xl:leading-[1.45]",
            "2xl:text-[36px] 2xl:leading-[54px]",
            "max-lg:max-w-none max-w-[1160px] lg:max-w-[1160px]",
          )}
        />

        {/* dl, because each cell is a figure and its name: the markup says
            2005/Established rather than leaving four numbers floating in a
            row. The pair is wrapped per cell so the grid tracks lay out. */}
        <AnimateIn className="mx-auto mt-12 max-w-[1160px] md:mt-16 lg:mt-[60px]">
          <dl
            className="grid grid-cols-2 border-y lg:grid-cols-4"
            style={{ borderColor: RULE_COLOR }}
          >
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "flex flex-col items-center justify-center px-6 text-center",
                  /* One gap between all three lines. The frame does not state
                     it, but its arithmetic does: the cell's content box is 172
                     tall against 107 of text (48 + 17 + 42), which leaves 65
                     across the two gaps — a single 32 auto-layout step, and it
                     is what brings the row back to its stated 249. */
                  "max-lg:gap-3 lg:max-xl:gap-4 xl:max-2xl:gap-6 2xl:gap-8",
                  /* The frame's own gaps: 48 above the cell's content and 27
                     below it, inside the 249-tall row. Stepped down through
                     lg-to-xl and again below lg, where the figures are smaller
                     and the row wraps to two columns. */
                  "max-lg:mt-8 max-lg:mb-5",
                  "lg:max-xl:mt-10 lg:max-xl:mb-[22px]",
                  "xl:mt-12 xl:mb-[27px]",
                  index !== STATS.length - 1 && "lg:border-r",
                )}
                style={{ borderColor: RULE_COLOR }}
              >
                {/* One step per band, none of them overlapping, so the figure
                    never holds a desktop size in a narrow column: 30px below
                    lg, 38 through xl, then the frame's own 48 to 2xl, with
                    text-h2 taking the widest screens.

                    The middle steps are stated rather than left to the token
                    because `text-h2` is generated from an `@theme inline`
                    token, so it compiles to the literal clamp and never sees
                    the 1024-1535 downscale in globals.css — left alone it
                    stands at 65px right where the frame is drawn. Same reason
                    SectionHeading and GlobeSection state their own values
                    across that band.

                    tracking-normal because the token carries the heading
                    scale's -1%, where this panel states 0. */}
                <dd className="font-heading text-3xl lg:text-5xl leading-none tracking-normal text-[#16150F]">
                  {stat.value}
                </dd>

                <dt className="font-heading text-[11px] lg:text-xs uppercase leading-[1.375] tracking-[0.165em] text-black/60">
                  {stat.label}
                </dt>

                {/* Poppins is the page's own body family, so only size, measure
                    and colour are stated. 14px is the frame's; 16 from 2xl is
                    the text-small token's own value, which is where the rest of
                    the site's small copy lands at that width. */}
                <p className="max-w-[216px] text-[13px] lg:text-sm font-normal leading-[1.5] text-black/80">
                  {stat.note}
                </p>
              </div>
            ))}
          </dl>
        </AnimateIn>
      </Container>
    </section>
  );
}

