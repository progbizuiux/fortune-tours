import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

/* "Cancellation Policy" — the deadline/charge table.
 *
 * A real <table>, not a stack of flex rows: each line pairs a period with the
 * charge that applies to it, which is a two-column relationship a screen reader
 * should be able to read across. The header row is visually hidden because the
 * frame draws none — the pairing is obvious to a sighted reader from the copy
 * itself — but it still has to exist for the cells to be announced with their
 * meaning.
 *
 * Shape-only. All copy comes from the page; see lib/packages.js.
 */
export function CancellationSection({
  eyebrow = "Cancellation Policy",
  title = "Cancellation Policy",
  description,
  rows = [],
  note,
  className,
}) {
  if (!rows.length) return null;

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

        {/* Measured as a share of the Container rather than a fixed pixel
            width, so the table keeps its ~80% proportion as the frame grows
            instead of stranding itself in the middle of a wide screen. The cap
            stops it stretching past a readable line beyond ~1920, and below md
            the share would leave the two columns cramped, so it runs edge to
            edge on phones. */}
        <AnimateIn className="mt-10 md:mt-12 lg:mt-[55px] mx-auto w-full md:w-4/5 max-w-[1400px]">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              {title} — charge by how far ahead of departure the booking is
              cancelled
            </caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">When you cancel</th>
                <th scope="col">Charge</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  /* Banded rather than ruled — the frame alternates white and
                     a faint grey instead of drawing lines between rows. */
                  className={i % 2 === 0 ? "bg-white" : "bg-black/[0.03]"}
                >
                  <th
                    scope="row"
                    className="px-4 sm:px-5 md:px-8 lg:px-[35px] py-3.5 sm:py-4 lg:py-[18px] font-sans font-light text-[13px] lg:text-[14px] xl:text-[15px] leading-[1.5] text-black/80 w-1/2 lg:w-auto"
                  >
                    {row.label}
                  </th>
                  <td className="px-4 sm:px-5 md:px-8 lg:px-[35px] py-3.5 sm:py-4 lg:py-[18px] text-right font-sans font-light text-[13px] lg:text-[14px] xl:text-[15px] leading-[1.5] text-black/80 max-lg:whitespace-normal lg:whitespace-nowrap w-1/2 lg:w-auto">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {note && (
            <p className="mt-6 lg:mt-[30px] mx-auto max-w-[820px] text-center font-sans font-light text-[12px] lg:text-[13px] leading-[1.7] text-black/50">
              {note}
            </p>
          )}
        </AnimateIn>
      </Container>
    </section>
  );
}
