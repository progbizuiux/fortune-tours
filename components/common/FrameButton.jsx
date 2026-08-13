import { cn } from "@/lib/utils";
import { FILL_SWEEP } from "@/lib/motion";

// Every button in the app renders through this component — add a variant here
// rather than styling a bare <button> at the call site, so the shared base
// (focus ring, transition, cursor, hover fill) can never drift between sections.
//
// `fill: false` opts a variant out of FILL_SWEEP — only for buttons with no
// frame of their own, where a full-bleed panel has nothing to sit inside.
const VARIANT_CLASSES = {
  chip: {
    base: "h-[43px] w-[125px] border-x border-white font-heading text-[22px] leading-none tracking-[-0.01em]",
    idle: "text-white",
    active: "bg-white text-black",
  },
  rail: {
    base: "text-body border-x px-2.5 py-2",
    idle: "border-black/20 text-black hover:border-transparent dark:border-cream/20 dark:text-cream",
    active: "border-transparent bg-black text-white dark:bg-cream dark:text-navy",
  },
  // Departures month selector. Steps up in size at every breakpoint, so the
  // sizing lives in the variant rather than being passed in per call site.
  month: {
    base: "whitespace-nowrap border-x text-[12px] px-3 py-1.5 sm:text-[14px] sm:px-4 sm:py-2 lg:text-[16px] lg:px-5 lg:py-2.5 xl:text-[18px] xl:px-7 xl:py-3",
    idle: "border-black/20 text-black/80 dark:border-cream/20 dark:text-cream/80",
    active: "border-transparent bg-black text-white",
  },
  // Category tabs on the dark FeaturedDestinations panel — outlined boxes that
  // flip to solid white when selected.
  tab: {
    base: "text-nav max-sm:text-[11px] max-sm:px-3 max-sm:py-2 whitespace-nowrap border px-5 py-3.5",
    idle: "border-white/25 border-y-transparent text-white/90",
    active: "border-white bg-white text-navy",
  },
  // Square icon button (carousel arrows). Deliberately size-less: the desktop
  // and mobile controls use the same treatment at size-15 and size-10, so the
  // caller passes the size through className.
  icon: {
    base: "border border-white/30",
    idle: "text-white",
    active: "bg-white text-navy",
  },
  // Icon toggle with no frame of its own (navbar menu button). Colour is
  // context-dependent, so it comes from the call site. Opted out of the fill:
  // it is a bare round glyph, so a square sky panel has no frame to fill.
  bare: {
    base: "rounded-full p-2",
    idle: "",
    active: "",
    fill: false,
  },
};

export function FrameButton({
  children,
  variant = "chip",
  active = false,
  className,
  type = "button",
  ...props
}) {
  const styles = VARIANT_CLASSES[variant];

  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center transition-colors duration-300",
        "focus-visible:outline-sky focus-visible:outline-2 focus-visible:outline-offset-2",
        styles.fill !== false && FILL_SWEEP,
        styles.base,
        active ? styles.active : styles.idle,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
