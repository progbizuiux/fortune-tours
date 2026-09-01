import { cn } from "@/lib/utils";

/* The markup half of the masked image reveal in lib/gsap/useMaskReveal.js. The
   hook finds these by their data attributes, which is the whole contract
   between the two:

     <section ref={useMaskReveal({ onLoad: true })}>
       <MaskRevealNoScript />
       <MaskFrame className="absolute inset-0">
         <MaskImage><Image fill … /></MaskImage>
         <MaskScrim />
       </MaskFrame>
       <MaskLine as="h1" className="…">{title}</MaskLine>
       <MaskLine as="p"  className="…">{description}</MaskLine>
     </section>

   Deliberately not a server/client boundary, the same way
   components/common/CascadeText.jsx is not: it is markup and nothing else, so a
   server component that uses it stays one.

   These carry the animation's start state as inline styles, and that is their
   real job — the reason this is a component rather than four className strings.
   The state has to be in the server HTML. Applied from a layout effect instead,
   the picture paints at full size and full brightness for however long
   hydration takes, then snaps shut before it opens; a flash of the image before
   its own reveal is the one thing this animation cannot survive. Inline is also
   why it survives Tailwind: an inline `clip-path` outranks anything in a class,
   in either order, without an `!important` arms race.

   Everything here rests at its natural value, so clearProps is enough to finish
   the animation and nothing has to be set at the end. The scrim is the case
   that shows why the direction matters: it rests at `opacity-0` in its class
   list and starts at `opacity: 1` inline, because clearProps can only remove
   the inline value — the resting one has to be the one already in CSS. Written
   the other way round, the scrim would flash back to opaque the instant its
   tween landed. */

const FROM = {
  // Bottom edge pinned, top edge collapsed onto it: a window with no opening,
  // so 0% of the picture is visible rather than a thin strip of it.
  frame: { clipPath: "inset(100% 0% 0% 0%)" },
  // Pushed down inside that window and oversized, so it has somewhere to travel
  // from and something to settle out of. 18% against the frame's full height is
  // the ratio that makes the two read as parallax — see the hook.
  image: { transform: "translateY(18%) scale(1.2)" },
  scrim: { opacity: 1 },
  // Past 100%, so a descender that hangs below the line box is still clear of
  // the mask's edge at rest.
  line: { transform: "translateY(110%)", opacity: 0 },
};

/* The window. Needs to establish a containing block for the fill image inside
   it, so pass `relative` or `absolute` in className. */
export function MaskFrame({ as: Tag = "div", className, children, ...props }) {
  return (
    <Tag
      data-mask-frame=""
      style={FROM.frame}
      className={cn("overflow-hidden", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* What moves behind the window. A wrapper rather than the image itself, so the
   picture keeps its own transform: GSAP pins `translate`, `rotate` and `scale`
   to `none` on anything it moves, and in Tailwind v4 a `group-hover:scale-*`
   compiles to exactly those properties — animating the <Image> directly is how
   a card's hover zoom dies quietly. lib/gsap/useReveal.js has the full account.
   Keeping the two on separate elements means the question never arises. */
export function MaskImage({ className, children }) {
  return (
    <div
      data-mask-image=""
      style={FROM.image}
      className={cn("absolute inset-0", className)}
    >
      {children}
    </div>
  );
}

/* The dark that lifts off the picture as it settles. Semi-transparent by
   design: opaque, and the mask would be opening onto nothing for most of its
   travel, which throws away the reveal it exists to perform. */
export function MaskScrim({ className }) {
  return (
    <div
      data-mask-scrim=""
      style={FROM.scrim}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 bg-black/60 opacity-0",
        className,
      )}
    />
  );
}

/* One line of type rising out from behind its own edge, on the same timeline as
   the picture. Two elements, because the thing being moved has to be separate
   from the thing clipping it: the outer masks, the inner is what the hook
   translates. That mask is what turns a short nudge into type lifting off its
   own baseline rather than a block sliding into place.

   The padding/negative-margin pair is CascadeText's, for CascadeText's reason:
   type set at a tight leading would have the tail of a "g" or a "y" shaved off
   by a mask flush to the line box, so the clipping edge drops a fifth of an em
   and the same comes back off the outside. Nothing moves, the descenders live.

   Wrap the text, not the block. A mask that also enclosed a heading's margin
   would leave the rise nothing to hide behind, the margin being the very room
   the type travels through. */
export function MaskLine({ as: Tag = "span", className, children }) {
  return (
    <Tag
      className={cn("block overflow-hidden pb-[0.2em] -mb-[0.2em]", className)}
    >
      <span className="block" data-mask-line="" style={FROM.line}>
        {children}
      </span>
    </Tag>
  );
}

/* The start state above ships in the server HTML on purpose, which means a
   visitor whose JavaScript never arrives would be left looking at a clipped
   window and no type. This hands them the finished state instead. Render it
   once inside any section that uses the reveal.

   The hook covers the other half of the same problem — prefers-reduced-motion,
   where the script does run and must not animate — by clearing these same
   properties itself. */
export function MaskRevealNoScript() {
  return (
    <noscript>
      <style>
        {"[data-mask-frame]{clip-path:none!important}" +
          "[data-mask-image]{transform:none!important}" +
          "[data-mask-scrim]{opacity:0!important}" +
          "[data-mask-line]{transform:none!important;opacity:1!important}"}
      </style>
    </noscript>
  );
}
