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
    base: "max-sm:h-[32px] sm:h-[43px] lg:max-xl:h-[32px] lg:max-xl:w-[84px] lg:max-xl:text-[13px] xl:max-2xl:h-[36px] xl:max-2xl:w-[94px] xl:max-2xl:text-[16.5px] 2xl:h-[38px] 2xl:w-[100px] 2xl:text-[18px] max-sm:w-[77px] sm:w-[125px] border-x border-white font-heading max-sm:text-[14px] sm:text-[22px] leading-none tracking-[-0.01em]",
    idle: "bg-transparent text-white border-transparent",
    active: "bg-white text-navy border-transparent",
  },
  rail: {
    base: "text-body lg:max-xl:text-[13px] lg:max-xl:px-4 lg:max-xl:py-1.5 xl:max-2xl:text-[16px] xl:max-2xl:px-4.5 xl:max-2xl:py-2 2xl:text-body 2xl:px-5 2xl:py-2 border-x px-5 py-2",
    idle: "border-black/20 text-black hover:border-transparent dark:border-cream/20 dark:text-cream",
    active:
      "border-transparent bg-black text-white dark:bg-cream dark:text-navy",
  },
  // Departures month selector. Steps up in size at every breakpoint, so the
  // sizing lives in the variant rather than being passed in per call site.
  month: {
    base: "whitespace-nowrap border-x text-[12px] px-3 py-1.5 sm:text-[14px] sm:px-4 sm:py-2 lg:max-xl:text-[13px] lg:max-xl:px-4 lg:max-xl:py-2 xl:max-2xl:text-[16px] xl:max-2xl:px-5 xl:max-2xl:py-2.5 2xl:text-[18px] 2xl:px-7 2xl:py-3",
    idle: "border-black/20 text-black/80 dark:border-cream/20 dark:text-cream/80",
    active: "border-transparent bg-black text-white",
  },
  // Category tabs on the dark FeaturedDestinations panel — outlined boxes that
  // flip to solid white when selected.
  tab: {
    base: "text-nav lg:max-xl:text-[13px] lg:max-xl:px-4 lg:max-xl:py-2.5 xl:max-2xl:text-[16px] xl:max-2xl:px-4.5 xl:max-2xl:py-3 2xl:text-nav 2xl:px-5 2xl:py-3.5 max-sm:text-[11px] max-sm:px-3 max-sm:py-2 whitespace-nowrap border px-5 py-3.5",
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
  // ── Filter bar (/search) ────────────────────────────────────────────────
  // The four below all opt out of FILL_SWEEP. It is the treatment for the one
  // primary action in a view; a toolbar is a row of equal, repeated controls,
  // and sweeping a sky panel across each on hover reads as the page flashing.
  //
  // Dropdown trigger. Cell in a divided rail, so it carries only its left rule
  // and the rail draws the closing one. `active` = this group has a value.
  filter: {
    base: "border-navy/20 text-body border-l max-lg:border-[0.7px] max-lg:border-black/50 px-5 max-lg:px-[14px] py-3 max-lg:py-[8px] max-lg:h-[34px] gap-2 max-lg:gap-[6px] max-lg:text-[12px] max-lg:leading-[100%] max-lg:font-normal max-lg:tracking-[0px] max-lg:text-black whitespace-nowrap",
    idle: "text-navy/90 hover:text-sky",
    active: "text-navy font-medium",
    fill: false,
  },
  // Removable active-filter chip. Full box of its own, since these sit loose
  // on the page rather than in a rail.
  filterChip: {
    base: "border-navy/20 gap-2 border px-3 py-1.5 text-[13px]",
    idle: "text-navy hover:border-navy/50",
    active: "border-navy/50 text-navy",
    fill: false,
  },
  // Row inside an open dropdown. Left-aligned against the base's centring —
  // cn() runs twMerge, so the justify-start passed at the call site wins.
  filterOption: {
    base: "w-full justify-start px-5 py-2.5 text-left text-[15px]",
    idle: "text-navy/80 hover:bg-navy/5",
    active: "bg-navy/5 text-navy font-medium",
    fill: false,
  },
  // Text action with an icon (Reset filters) — no frame at all, so nothing to
  // fill and no padding that would push it out of line with the chips.
  // min-h-11 buys the 44px touch target it otherwise lacks entirely: with no
  // padding and no border its box was just the 13px line box, 19.5px tall. The
  // negative margin gives that height back to the layout, so the control still
  // sits on the same line as the chips beside it.
  textAction: {
    base: "-my-3 min-h-11 gap-1.5 text-[13px]",
    idle: "text-navy/80 hover:text-sky",
    active: "text-sky",
    fill: false,
  },
  // The bar's menu button (Navbar → site menu sheet): a square with the
  // hamburger glyph. Like `bare`, its colour is context-dependent — the bar is
  // see-through over the hero and solid white after — so the fill comes from
  // the call site in brand colours (white rule over the video, navy once
  // solid). Opted out of the sky sweep: it is a filled block already.
  menu: {
    base: "size-10 shrink-0 border",
    idle: "",
    active: "",
    fill: false,
  },
  // ── Plan-my-trip wizard (components/plan-my-trip/) ──────────────────────
  // Answer chip on the dark full-screen form: the `chip` treatment — white
  // side rules, solid white once chosen — but content-sized, because the
  // labels run from "Solo" to "I'm open to suggestions". The active state
  // re-pins hover text to black: FILL_SWEEP's hover:text-white paints behind
  // the chip's own white fill, which would leave white-on-white on hover.
  // The footer's Back/Continue reuse this with dimmer rules via className.
  // Figma: 187×47 chips; longer labels grow past the min-width. The footer's
  // Back/Continue reuse the variant with `sm:min-w-0` since they size to
  // their label in the design.
  option: {
    base: "text-body lg:max-xl:text-[13px] lg:max-xl:px-4 lg:max-xl:py-2 lg:max-xl:min-w-[140px] lg:max-xl:h-[38px] xl:max-2xl:text-[16px] xl:max-2xl:px-5 xl:max-2xl:py-2.5 xl:max-2xl:min-w-[160px] xl:max-2xl:h-[42px] 2xl:text-body 2xl:px-6 2xl:py-2.5 2xl:min-w-[187px] 2xl:h-[47px] min-h-11 whitespace-nowrap border-x border-white px-6 py-2.5 max-sm:px-4 sm:h-[47px] sm:min-w-[187px]",
    idle: "text-white",
    active: "bg-white text-black hover:text-black",
  },
  // ── Mobile drill-down menu (components/layout/navbar/MobileMenu.jsx) ───
  // A row that opens a sub-list. Same size and 44px touch height as the links
  // it sits between, spread so the chevron sits at the far edge. No fill: it
  // is navigation, not an action, and a sky panel sweeping across a menu row
  // reads as a mis-tap.
  menuRow: {
    base: "text-body flex min-h-11 w-full justify-between gap-2 text-left",
    idle: "text-navy/80 dark:text-cream/80",
    active: "text-sky",
    fill: false,
  },
  // "Back" at the top of a sub-list. Text with a leading chevron; the
  // negative margin lets the chevron sit on the list's left edge so the label
  // lines up with the rows below.
  menuBack: {
    base: "text-small -ml-1 min-h-11 gap-1",
    idle: "text-navy/70 dark:text-cream/70 hover:text-navy dark:hover:text-cream",
    active: "text-navy dark:text-cream",
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
