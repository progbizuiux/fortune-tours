import Link from "next/link";
import { cn } from "@/lib/utils";
import { FILL_SWEEP, FILL_SWEEP_INSET, LINK_UNDERLINE } from "@/lib/motion";

// The shared link primitive — every text link in the app renders through this.
//
// Deliberately carries no colour of its own: the navbar, footer and hero each
// sit on different backgrounds, so the caller passes text/hover colours through
// `className`. Only the layout-neutral bits (transition, underline animation,
// optional dividers) live here, which is what lets one component serve all of
// them without a variant explosion.
//
// Dividers are opt-in. Only the hero row and the featured-destinations CTA draw
// them, so defaulting them on would put a stray bar after every link in the app.
// `fill` and `underline` are alternatives, not additions: a 2px bar under a
// solid panel reads as a rendering bug. Passing `fill` wins and the underline
// is skipped.
export function CtaLink({
  href,
  children,
  className,
  underline = true,
  fill = false,
  withLeftDivider = false,
  withRightDivider = false,
  dividerClassName = "h-6 w-px bg-white/40",
  ...props
}) {
  return (
    <>
      {withLeftDivider && (
        <span className={dividerClassName} aria-hidden="true" />
      )}
      <Link
        href={href}
        className={cn(
          "transition-colors",
          fill && [FILL_SWEEP, FILL_SWEEP_INSET],
          !fill && underline && LINK_UNDERLINE,
          className,
        )}
        {...props}
      >
        {children}
      </Link>
      {withRightDivider && (
        <span className={dividerClassName} aria-hidden="true" />
      )}
    </>
  );
}
