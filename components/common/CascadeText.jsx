import { cn } from "@/lib/utils";

/* One line of type that rises into place as part of the card cascade
   (lib/gsap/useCardCascade.js). Wrap the text a card wants animated:

     <h3 className="…"><CascadeText part="title">{title}</CascadeText></h3>
     <p  className="…"><CascadeText part="subtitle">{meta}</CascadeText></p>

   Deliberately not a server/client boundary: it is markup and nothing else, so
   a server component that uses it stays one. The hook finds these by their
   data attribute, which is the whole contract between the two.

   Two spans, because the element being moved has to be separate from the one
   clipping it: the outer masks, the inner is what the hook translates. That
   mask is what makes a 30px nudge read as type lifting off its own baseline
   rather than a block sliding — the reference does the same, wrapping its pair
   in an `overflow: hidden` head.

   The padding/negative-margin pair is the one liberty taken over the reference:
   type set at a tight leading — the package card's meta line is leading-[1] —
   would have the descenders shaved off a "g" or a "y" by a mask flush to the
   line box. This drops the clipping edge a fifth of an em and takes the same
   back off the outside, so nothing moves and the tails survive.

   Wrap the text, not the block: a mask that also enclosed a heading's own
   margin would leave the rise nothing to hide behind, since the margin is
   already the room the type would travel through. */
export function CascadeText({ part = "title", className, children }) {
  return (
    <span
      className={cn("block overflow-hidden pb-[0.2em] -mb-[0.2em]", className)}
    >
      <span className="block" {...{ [`data-cascade-${part}`]: "" }}>
        {children}
      </span>
    </span>
  );
}
