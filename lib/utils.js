import clsx from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* The type scale in globals.css names its sizes with words — text-body, text-h3,
 * text-nav — and tailwind-merge cannot tell those from text-<colour>. It filed
 * them under colours, so any cn() call that put a colour after a size silently
 * deleted the size and the element fell back to whatever it inherited:
 *
 *   cn("text-h4", "text-navy/70")  ->  "text-navy/70"
 *
 * That was live in the navbar links, the section eyebrows, the /search filter
 * labels and the empty-results heading. Registering the scale here fixes every
 * call site at once; genuine conflicts (two sizes, or two colours) still
 * collapse the way they should.
 *
 * Keep this list in step with the --text-* tokens in app/globals.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["h1", "h2", "h3", "h4", "body", "small", "nav"] }],
    },
  },
});

export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}
