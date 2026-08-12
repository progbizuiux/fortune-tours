// Shared hover treatments. These live here rather than inside a component so
// that buttons (FrameButton) and links (CtaLink) animate identically — the two
// render different elements but must not drift apart visually.

// Underline sweeping out from the left edge.
//
// Kept as Tailwind classes rather than a CSS rule in design-system.css because
// `@theme inline` does not emit --color-sky as a custom property — a
// hand-written rule would have to hardcode the hex and would silently drift if
// the brand colour changes.
//
// Animates `width` rather than a transform so it works on inline links without
// a wrapper element. The caller adds `after:w-full` to pin it open for the
// current page.
export const LINK_UNDERLINE =
  "relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-sky after:transition-all after:duration-300 hover:after:w-full";

// Sky panel wiping in from the left edge, behind the label.
//
// Animates `scaleX` on a pseudo-element rather than `width` so the whole thing
// runs on the compositor and never triggers layout on hover.
//
// `isolate` is load-bearing. `-z-10` puts the panel behind the element's own
// text (in-flow inline content paints above negative-z children), but without a
// stacking context that -1 would escape the element entirely and land behind the
// navbar or section background, where it is invisible.
export const FILL_SWEEP = [
  "relative isolate hover:text-white",
  "before:absolute before:inset-0 before:-z-10 before:bg-sky",
  "before:origin-left before:scale-x-0 before:transition-transform",
  "before:duration-300 before:ease-out hover:before:scale-x-100",
].join(" ");

// What inline links need that framed buttons already have.
//
// Padding, because a link has none of its own and the panel would otherwise hug
// the glyphs. And a left rule for the panel to emerge from — `before:inset-0`
// spans the padding box, so the sweep begins exactly at this line rather than
// appearing out of empty space. The button variants get the same effect from
// their own `border-x`.
//
// No border colour is set: Tailwind v4 defaults border-color to `currentColor`,
// so the rule picks up whatever text colour the caller passed and stays visible
// against both the transparent navbar over the hero and the solid white one.
export const FILL_SWEEP_INSET = "border-l px-3 py-2";
