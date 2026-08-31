"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

/* The app's dialog primitive — portalled, focus-trapped, Esc- and
 * backdrop-dismissable.
 *
 * Hand-built rather than pulled from a headless library: this is the first
 * overlay in the project, and the whole contract is a portal, a focus trap and
 * a scroll lock. What it does carry that a naive implementation misses:
 *
 *   - Lenis is stopped while it is open, not just `overflow: hidden` on the
 *     body. Lenis drives the scroll position itself, so a CSS-only lock leaves
 *     the page scrolling behind the panel and the reader lands somewhere else
 *     when it closes (see lib/lenis.js).
 *   - The scrollbar's width is given back as padding, so locking the body does
 *     not shift the fixed navbar and the page under the overlay sideways.
 *   - Focus moves into the panel on open and returns to whatever opened it on
 *     close, and Tab cycles inside the panel rather than walking the page
 *     behind it.
 *
 * Renders nothing when closed — the panel is not in the DOM at all, so a form
 * inside it starts fresh each time rather than holding a half-filled draft.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  labelledBy,
  className,
  closeLabel = "Close",
  children,
}) {
  const panelRef = useRef(null);
  // Whatever had focus when the dialog opened, so it can be handed back.
  const openerRef = useRef(null);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      // Wrap at both ends. Without this the next Tab from the last control
      // lands on the browser chrome and then on the page behind the overlay.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement;
    const lenis = getLenis();
    lenis?.stop();

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    // The gap the scrollbar leaves behind when the body stops scrolling. 0 on
    // overlay-scrollbar platforms, ~15px on desktop Windows.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    // Focus the first control rather than the panel itself, so a screen reader
    // starts on the form and not on an empty container.
    const focusable = panelRef.current?.querySelector(FOCUSABLE);
    (focusable ?? panelRef.current)?.focus({ preventScroll: true });

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      lenis?.start();
      // Only take focus back if it is still inside the panel being removed —
      // a close that itself moved focus somewhere deliberate keeps it.
      if (
        openerRef.current instanceof HTMLElement &&
        (!document.activeElement || document.activeElement === document.body)
      ) {
        openerRef.current.focus({ preventScroll: true });
      }
    };
  }, [open]);

  // Portalled to the body: inside the section markup the panel would inherit
  // the page's stacking contexts — the sticky hero is one — and a z-index high
  // enough to clear them locally still loses to the next one down the page.
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-6"
      onKeyDown={handleKeyDown}
    >
      {/* The backdrop is a sibling, not a parent: a click handler on a wrapper
          would also fire for clicks inside the panel. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 motion-safe:animate-menu-drop"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full max-h-full overflow-y-auto bg-white shadow-2xl outline-none motion-safe:animate-menu-drop sm:max-w-[900px]",
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="focus-visible:outline-sky absolute top-3 right-3 z-20 inline-flex size-11 cursor-pointer items-center justify-center bg-white/80 text-black transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 sm:top-4 sm:right-4"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        {children}
      </div>
    </div>,
    document.body,
  );
}
