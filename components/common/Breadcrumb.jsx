import { cn } from "@/lib/utils";
import { CtaLink } from "@/components/common/CtaLink";

/* Inner-page trail ("Experience - Honeymoon").
 *
 * Deliberately carries no typography or colour of its own — every inner page
 * hero sits on a different background, so the caller passes the type stack
 * through `className` exactly the way CtaLink does. That is what keeps one
 * component serving the cream experience heroes and any dark hero later.
 *
 * The last item is the current page: it never renders a link even if an href
 * is supplied, and it is the one that carries aria-current. Items before it
 * render as links only when they have an href, so a purely structural crumb
 * ("Experience" before the section index exists) can be listed as plain text
 * without inventing a dead route.
 */
export function Breadcrumb({ items, separator = "-", className }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-x-2">
              {item.href && !isCurrent ? (
                <CtaLink href={item.href} className="hover:text-sky">
                  {item.label}
                </CtaLink>
              ) : (
                <span aria-current={isCurrent ? "page" : undefined}>
                  {item.label}
                </span>
              )}

              {!isCurrent && (
                <span aria-hidden="true" className="opacity-70">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
