import { AnimateIn } from "@/components/common/AnimateIn";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

/* The article's copy, rendered from a list of typed blocks rather than from a
 * string of HTML.
 *
 * A block list is what a CMS hands you — Strapi's rich text and dynamic zones
 * both arrive this shape — so building against it now means the swap is a data
 * change rather than a rewrite, and nothing here has to run
 * dangerouslySetInnerHTML over editor output.
 *
 * An unknown block type renders nothing rather than throwing: a CMS can add one
 * before the front end knows about it, and a missing paragraph is a better
 * failure than a 500 on the whole page.
 *
 * Shape-only. Content comes from lib/journal.js.
 */
export function ArticleBody({ blocks = [], className }) {
  if (!blocks.length) return null;

  return (
    <div className={cn("bg-cream relative z-10 pb-16 md:pb-24 lg:pb-[110px]", className)}>
      <Container>
        {/* A measure, not the full container: body copy set across 1760px is
            unreadable however good the type is. The frame runs it to roughly
            720px and leaves the rest of the column empty. */}
        <div className="max-w-[760px]">
          {blocks.map((block, i) => (
            <Block key={i} block={block} isFirst={i === 0} />
          ))}
        </div>
      </Container>
    </div>
  );
}

function Block({ block, isFirst }) {
  switch (block.type) {
    case "heading":
      return (
        <AnimateIn
          as="h2"
          /* text-h3, the shared token, rather than a literal ramp: it carries
             the 22/25/32px steps app/globals.css sets for the laptop bands, so
             the article's headings move with every other heading on the site. */
          className={cn(
            "font-heading text-h3 leading-[1.25] text-navy",
            /* The first block opens the column, so it takes no top margin — a
               heading after copy needs the space to read as a new section. */
            isFirst ? "mt-0" : "mt-10 lg:mt-[52px]",
          )}
        >
          {block.text}
        </AnimateIn>
      );

    case "paragraph":
      return (
        <AnimateIn
          as="p"
          /* No size class at all. app/design-system.css already sets bare <p>
             to Poppins 300 at --text-body, which is the site's body copy — the
             literal 13px that was here rendered this page's prose a step
             smaller than every other page's. Only the measure-specific leading
             and colour are stated.

             whitespace-pre-line so a block written as two lines keeps its break
             without needing to be split into two entries. */
          className={cn(
            "whitespace-pre-line font-sans font-light leading-[1.75] text-black/75",
            isFirst ? "mt-0" : "mt-5 lg:mt-[18px]",
          )}
        >
          {block.text}
        </AnimateIn>
      );

    case "definitions":
      return (
        <AnimateIn as="dl" className="mt-7 lg:mt-[30px]">
          {block.items?.map((item) => (
            /* Each pair in its own div so the term and its description stay
               together — a bare dt/dd sequence gives the browser nothing to
               keep them from breaking apart across a column. */
            <div key={item.term} className="mt-5 first:mt-0 lg:mt-[22px]">
              {/* The variable, not the `text-body` utility. The utility is
                  generated from `@theme inline` and compiles to the literal
                  clamp, so it reads 18px on a 1280 laptop while the paragraphs
                  beside it — bare <p>, styled from var(--text-body) in
                  app/design-system.css — read 15px. Reading the same variable
                  is what keeps a definition the same size as the prose around
                  it at every width. */}
              <dt className="font-sans text-[length:var(--text-body)] font-medium leading-[1.5] text-navy">
                {item.term}
              </dt>
              <dd className="mt-1 font-sans text-[length:var(--text-body)] font-light leading-[1.75] text-black/75">
                {item.description}
              </dd>
            </div>
          ))}
        </AnimateIn>
      );

    case "table":
      return <ArticleTable block={block} />;

    default:
      return null;
  }
}

/* The comparison table.
 *
 * Wider than the copy measure above it — six columns will not sit inside 760px
 * — so it breaks out to the full column and scrolls sideways below that. The
 * scroller is focusable and labelled, because a region that scrolls has to be
 * reachable by keyboard for anyone who cannot drag it. */
function ArticleTable({ block }) {
  const { caption, columns = [], rows = [] } = block;

  if (!columns.length || !rows.length) return null;

  return (
    /* A little wider than the copy measure, which is what the frame draws — but
       only by 72px, because the Container's content box at the lg breakpoint is
       864px and a bigger break-out would push the table past the page gutter
       before xl ever arrives. */
    <AnimateIn className="mt-10 w-full lg:mt-[52px] lg:w-[calc(100%+72px)]">
      <div
        role="region"
        aria-label={caption ?? "Comparison table"}
        tabIndex={0}
        className="overflow-x-auto border border-black/10 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
      >
        <table className="w-full min-w-[720px] border-collapse text-left">
          {caption && <caption className="sr-only">{caption}</caption>}

          <thead>
            <tr className="border-b border-black/10">
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  /* text-small, the scale's smallest step. Its rank over the
                     cells below is carried by the caps, the tracking and the
                     lighter ink rather than by a size off the scale. */
                  className="px-5 py-4 font-sans text-small font-normal uppercase tracking-[0.08em] leading-none text-black/50 lg:px-[22px]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row[0] ?? i}
                /* Banded, and ruled between — the frame does both, which is what
                   keeps a six-column row readable across its full width. */
                className={cn(
                  "border-b border-black/[0.06] last:border-b-0",
                  i % 2 === 1 && "bg-black/[0.02]",
                )}
              >
                {row.map((cell, j) => {
                  /* The first cell names the row, so it is a header FOR that
                     row — a screen reader reading "$180" across should hear
                     "Kyoto, Japan" with it. It is also the cell the frame sets
                     in the darker ink. */
                  const Cell = j === 0 ? "th" : "td";

                  return (
                    <Cell
                      key={j}
                      scope={j === 0 ? "row" : undefined}
                      className={cn(
                        "px-5 py-4 font-sans text-small font-light leading-[1.5] lg:px-[22px]",
                        j === 0 ? "text-navy" : "text-black/70",
                      )}
                    >
                      {cell}
                    </Cell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnimateIn>
  );
}
