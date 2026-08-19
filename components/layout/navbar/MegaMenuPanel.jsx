import { forwardRef } from "react";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

/* The white sheet every navbar dropdown renders inside.
 *
 * Positioning, background, entrance and the vertical rhythm live here so the
 * Destinations and Experiences panels can never drift apart — each of them only
 * fills the sheet with columns. It hangs from the bottom edge of the fixed
 * <header> (top-full), so it moves with the bar and inherits its z-index.
 *
 * Desktop only. The triggers that open it sit in the lg+ nav, and below lg the
 * hamburger menu is the only navigation, so the sheet is `hidden lg:block`
 * rather than relying on the triggers alone to keep it closed.
 *
 * max-h / overflow-y: the Destinations sheet is ~740px tall on the 1920 frame.
 * On a 768px-tall laptop that runs off the bottom of the viewport, so the sheet
 * scrolls internally instead of being cut. */
export const MegaMenuPanel = forwardRef(function MegaMenuPanel(
  { id, label, className, children, onNavigate, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      id={id}
      role="region"
      aria-label={label}
      // Navbar's pointer handlers (keep-open while hovered, close on leave)
      // arrive through the rest props — the sheet is the hover target.
      {...props}
      // Lenis (providers/LenisProvider.jsx) captures the wheel for the page
      // and does not hand it to nested scrollers by default, so without this
      // a wheel over the sheet scrolls the document behind it and the sheet's
      // own overflow can never be reached on a short viewport.
      data-lenis-prevent
      // Any link inside the sheet closes it — delegated here so the menus do
      // not have to thread a handler onto every <Link>. Navbar needs this
      // because a pathname change alone misses query-string-only navigations.
      onClick={(event) => {
        if (onNavigate && event.target.closest("a[href]")) onNavigate();
      }}
      className={cn(
        // dvh, not vh: the sheet is capped to the *visible* viewport, which is
        // what matters when it has to scroll.
        // animate-menu-drop is the same entrance the mobile panel uses on the
        // hamburger — one motion for every menu in the bar.
        "motion-safe:animate-menu-drop absolute inset-x-0 top-full hidden max-h-[calc(100dvh-80px)] overflow-y-auto border-t border-black/10 bg-white lg:block",
        // Soft drop under the sheet. The header's own shadow-sm hugs the bar's
        // 80px box — the sheet paints over it — so without one of its own the
        // open menu would end in a hard edge against the page.
        "shadow-[0_24px_40px_-24px_rgba(12,34,51,0.28)]",
        className,
      )}
    >
      <Container className="py-12">{children}</Container>
    </div>
  );
});

/* Column headings inside a sheet — "Destinations", "Curated For You", "Choose
   your Experience" — are bare <h4>s. The element carries the full spec from
   the design-system base styles (Spartan, the h4 size, weight, leading), so the
   menus add colour and spacing only and never restate typography. */
