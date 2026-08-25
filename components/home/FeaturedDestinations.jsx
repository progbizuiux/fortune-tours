"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { CtaLink } from "@/components/common/CtaLink";
import { SectionHeading } from "@/components/common/SectionHeading";
import { FrameButton } from "@/components/common/FrameButton";
import { gsap, useGSAP, Flip, SplitText } from "@/lib/gsap";

// Tab casing follows the design frame verbatim.
const CATEGORIES = [
  { key: "featured", label: "Featured" },
  { key: "international", label: "international" },
  { key: "india", label: "India" },
  { key: "kerala", label: "Kerala" },
  { key: "pilgrimage", label: "Pilgrimage" },
  { key: "cruises", label: "Cruises" },
];

// Images are placeholders from elsewhere in the site — drop the real shots
// into public/ and update `image` per slide; everything else stays put.
const SLIDES = [
  {
    key: "cappadocia",
    location: "Cappadocia, Türkiye.",
    title: "Hot air balloon at sunrise.",
    description:
      "Drift peacefully above breathtaking landscapes as the first rays of sunlight paint the sky in vibrant shades of gold and orange. A sunrise hot air balloon ride offers unforgettable panoramic views and a truly magical start to your day.",
    image: "/home/image-1.png",
    categories: ["featured", "international"],
  },
  {
    key: "thailand",
    location: "Thailand, Vibrant Cities.",
    title: "Streets that never sleep.",
    description:
      "Weave through night markets, temple courtyards and neon-lit lanes where every corner serves something new. Thailand's cities reward the curious with flavour, colour and life at all hours.",
    image: "/experiance/beach-escape.png",
    categories: ["featured", "international"],
  },
  {
    key: "osaka",
    location: "Japan, Osaka",
    title: "Spring under the blossoms.",
    description:
      "Time your journey with the sakura and watch the city soften into pink. From castle gardens to riverside promenades, Osaka in bloom is a season worth crossing the world for.",
    image: "/destination/japan.avif",
    categories: ["featured", "international"],
  },
  {
    key: "kerala",
    location: "Kerala, India.",
    title: "Backwaters at their own pace.",
    description:
      "Board a houseboat and let the palm-lined canals set the rhythm. Kerala's backwaters trade itineraries for stillness — village life, birdsong and water that mirrors the sky.",
    image: "/destination/india.avif",
    categories: ["featured", "india", "kerala", "pilgrimage"],
  },
  {
    key: "swiss",
    location: "Switzerland, Alps.",
    title: "Wake up above the clouds.",
    description:
      "Ride cliff-hugging trains to villages where the air is thin and the views are not. The Alps deliver postcard mornings — snow peaks, still lakes and slow breakfasts.",
    image: "/destination/switzerland.avif",
    categories: ["featured", "international"],
  },
  {
    key: "norway",
    location: "Norway, Fjords.",
    title: "Chase the northern lights.",
    description:
      "Sail deep into the fjords where waterfalls drop from the mist and winter skies put on their green show. Norway is nature at full scale, best seen from the water.",
    image: "/destination/norway.avif",
    categories: ["international", "cruises"],
  },
];

// How many cards the rail shows. The rail lists what is coming NEXT, never the
// slide already on screen — the whole transition is the leading card growing
// into the backdrop, so it has to hold the incoming destination.
const RAIL_LENGTH = 3;

// Timing read off the reference clip, by summing frame-to-frame difference
// across a transition and normalising it into a progress curve:
//
//   t     0.0   0.1   0.2   0.3   0.4   0.5   0.7   0.9   1.0
//   done  .02   .06   .14   .29   .53   .69   .89   .99  1.00
//
// One second, and an S — it eases in as well as out. A plain ease-out was tried
// first and is wrong at both ends: it leaves at full speed instead of gathering,
// and it arrives so early that the last third of the run covers nothing.
const DURATION = 1;

// cubic-bezier solved by Newton's method, so the curve here is exactly the one
// the rest of the section already used and the clip above measures out to.
// Solving x for t converges in a couple of steps on a curve this well-behaved.
const cubicBezier = (x1, y1, x2, y2) => {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const x = (t) => ((ax * t + bx) * t + cx) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;

  return (p) => {
    let t = p;
    for (let i = 0; i < 8; i++) {
      const err = x(t) - p;
      if (Math.abs(err) < 1e-5) break;
      const slope = dx(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= err / slope;
    }
    return ((ay * t + by) * t + cy) * t;
  };
};

// One duration and one ease for every part of the section — backdrop, rail and
// copy travel as one piece, and any drift between them opens a seam.
const EASE = cubicBezier(0.4, 0, 0.2, 1);

// Follower card plus the rail's gap at its largest: how far one step of the rail
// travels, and so how far outside the frame an arriving card starts. Only a
// fallback — the real distance is measured off the rail, since the cards now
// scale with viewport height and this was already wrong at tablet widths, where
// they are 280px rather than 318px.
const RAIL_STEP_FALLBACK = 318 + 13;

// The outgoing slide swells very slightly as it is replaced. Measured off the
// clip by tracking the height of the copy's bright pixels through a transition:
// 211px -> 220px, growing about its own centre (top edge up 3px, bottom down 6).
// Its opacity holds almost full over the same stretch and then falls away in
// roughly 150ms, which is why the fade is eased in rather than run flat.
const EXIT_SCALE = 1.043;

// Seconds the section rests before stepping itself on. The clip starts a
// transition at 0.6s, 4.3s and 8.1s — one every ~3.75s — and each takes about a
// second, which leaves this much of the cycle sitting still.
const AUTOPLAY_REST = 2.7;

/* Content comes from the `sections.featured-destinations` block via
   lib/strapi/home.js — heading, tabs, slides and the view-all link. The
   CATEGORIES and SLIDES above are the fallback for a CMS entry whose tabs
   carry no slides: the carousel filters slides by category key, so taking
   tabs without their slides would render every tab empty. */
export function FeaturedDestinations({
  eyebrow = "Chapter 05 — Signature",
  title = "Where will your next journey?",
  description = "Explore curated destinations that match your travel dreams and create lasting memories.",
  categories = CATEGORIES,
  slides: slideData = SLIDES,
  viewAllLabel = "",
  viewAllHref = "",
}) {
  const [category, setCategory] = useState(categories[0]?.key);
  const [index, setIndex] = useState(0);

  // Set for the length of a transition, then cleared. `prev` is the slide being
  // left behind: it has to stay rendered so it can fade out (going forward it
  // also stays as the backdrop, since the incoming image arrives by growing on
  // top of it rather than by cutting).
  const [anim, setAnim] = useState(null);

  // Autoplay holds off while the pointer is over the section or something inside
  // it has focus, so it cannot step the slide out from under someone reading it
  // or tabbing through the controls. `inView` starts false: nothing should be
  // advancing before the section has been scrolled to.
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  const stageRef = useRef(null);
  const railRef = useRef(null);
  const backdropRef = useRef(null);
  const expanderRef = useRef(null);
  const expanderImageRef = useRef(null);
  const outgoingCopyRef = useRef(null);
  const incomingCopyRef = useRef(null);
  const copyWrapRef = useRef(null);
  // Rail geometry captured before React re-renders, replayed by Flip after.
  const railStateRef = useRef(null);
  // The title's line boxes, which have to be unwrapped again before the element
  // goes back to being ordinary text.
  const splitRef = useRef(null);
  const busyRef = useRef(false);

  const slides = slideData.filter((slide) =>
    slide.categories.includes(category),
  );
  const count = slides.length;
  const active = slides[index % count];
  const canNavigate = count > 1;

  // Math.min keeps every entry distinct when a category holds fewer slides than
  // the rail has room for — repeats would collide on the Flip id below.
  const upcoming = Array.from(
    { length: Math.min(RAIL_LENGTH, count) },
    (_, i) => slides[(index + 1 + i) % count],
  );

  // Forward: the new slide grows out of the leading card, so the backdrop must
  // hold the OLD image until the growth finishes. Backward: the old slide
  // shrinks back into the card, so the backdrop is already the new image and
  // the shrinking panel is what carries the outgoing one.
  const backdrop = anim && anim.dir > 0 ? anim.prev : active;
  const panel = anim ? (anim.dir > 0 ? active : anim.prev) : null;

  const go = (delta) => {
    if (!canNavigate || busyRef.current) return;
    busyRef.current = true;

    // Captured before the state change so Flip has the rail's outgoing layout.
    const cards = railRef.current?.querySelectorAll("[data-flip-id]");
    railStateRef.current = cards?.length ? Flip.getState(cards) : null;

    // The copy block's resting height, before the new slide's text replaces it.
    // Descriptions differ in length — measured across the set they span 164px to
    // 212px at tablet width — and below lg the copy stacks above the rail, so
    // that difference lands straight on the section's height and it snaps taller
    // the instant the text swaps. Recording it here lets the effect grow the box
    // over the transition instead.
    const copyHeight =
      copyWrapRef.current?.getBoundingClientRect().height ?? null;

    setAnim({ prev: active, dir: delta, copyHeight });
    setIndex((i) => (i + delta + count) % count);
  };

  // Autoplay. `go` is rebuilt every render and closes over the current slide, so
  // the timer below reaches it through a ref rather than capturing a stale one.
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  });

  // Only runs while the section is actually on screen. Left to itself it would
  // step through the whole list against an empty viewport and be part way into
  // some other slide by the time anyone scrolled down to it.
  useEffect(() => {
    const el = stageRef.current;

    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // One timer per resting slide: it is set when a transition finishes (`anim`
  // back to null) and cleared the moment anything else moves the section on, so
  // clicking never leaves a stray step queued behind it.
  useEffect(() => {
    if (!canNavigate || anim || paused || !inView) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const id = window.setTimeout(() => goRef.current(1), AUTOPLAY_REST * 1000);

    return () => window.clearTimeout(id);
  }, [index, category, anim, paused, inView, canNavigate]);

  const selectCategory = (key) => {
    if (key === category || busyRef.current) return;
    setCategory(key);
    setIndex(0);
    // A category switch is not a step through the rail — nothing grows or
    // shrinks, the section just cuts to the new set.
    setAnim(null);
  };

  useGSAP(
    () => {
      if (!anim) return;

      const finish = () => {
        // Unwrap the title before React is told the transition is over, so the
        // heading is plain text again by the time anything re-reads the DOM.
        splitRef.current?.revert();
        splitRef.current = null;
        // The backdrop is the one element here that outlives the transition, so
        // its swell has to be wound back or the next slide would open already
        // enlarged. The panel is covering it at this point, so this is unseen.
        if (backdropRef.current) {
          gsap.set(backdropRef.current, { clearProps: "transform" });
        }
        busyRef.current = false;
        setAnim(null);
      };

      const stage = stageRef.current;
      const lead = railRef.current?.querySelector("[data-lead]");
      const expander = expanderRef.current;
      const image = expanderImageRef.current;

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced || !stage || !lead || !expander || !image) {
        // Nothing grows here, so the incoming photo has to be on screen at once.
        // Going forward the backdrop is still holding the OUTGOING slide and
        // only the panel carries the new one, so the panel is snapped to full
        // bleed rather than hidden. Hiding it left the previous photo standing
        // under the new copy until the swap — the one case where the background
        // genuinely did not match the slide being described. Going back the
        // backdrop already holds the incoming slide, so the panel just goes.
        if (expander) {
          if (anim.dir > 0) {
            gsap.set(expander, {
              clipPath: "inset(0px 0px 0px 0px)",
              opacity: 1,
            });
            if (image) gsap.set(image, { scale: 1, x: 0, y: 0 });
          } else {
            gsap.set(expander, { opacity: 0 });
          }
        }

        if (outgoingCopyRef.current) {
          gsap.set(outgoingCopyRef.current, { opacity: 0 });
        }

        gsap.fromTo(
          incomingCopyRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, onComplete: finish },
        );
        return;
      }

      // The leading card's resting box, in stage coordinates. Measured after the
      // re-render, which is correct in both directions: the slot's geometry does
      // not depend on which slide is sitting in it, and by now the rail has been
      // laid out in its final arrangement.
      const s = stage.getBoundingClientRect();
      const c = lead.getBoundingClientRect();
      const top = c.top - s.top;
      const left = c.left - s.left;
      const inset = `inset(${top}px ${s.width - left - c.width}px ${
        s.height - top - c.height
      }px ${left}px)`;
      const full = "inset(0px 0px 0px 0px)";

      // The panel is a full-bleed image revealed through a growing window. The
      // window alone would just uncover a backdrop-sized photo through a card-
      // sized hole — the card's own framing would never appear — so the image
      // scales with it, from the size that covers the card up to its own. The
      // scale is uniform, so the photo never distorts while the window changes
      // aspect ratio around it.
      const scale = Math.max(c.width / s.width, c.height / s.height);
      // Centred on the card while small, on the stage once grown.
      const x = left + c.width / 2 - s.width / 2;
      const y = top + c.height / 2 - s.height / 2;

      // Distance between two follower slots — one step of the rail. Read while
      // the rail is still at rest, which it is until Flip.from runs at the very
      // end of this effect.
      const railCards = railRef.current
        ? [...railRef.current.querySelectorAll("[data-flip-id]")]
        : [];
      const step =
        railCards.length > 2
          ? railCards[2].getBoundingClientRect().left -
            railCards[1].getBoundingClientRect().left
          : RAIL_STEP_FALLBACK;

      const forward = anim.dir > 0;
      const tl = gsap.timeline({
        defaults: { duration: DURATION, ease: EASE },
        onComplete: finish,
      });

      tl.fromTo(
        expander,
        { clipPath: forward ? inset : full },
        { clipPath: forward ? full : inset },
        0,
      ).fromTo(
        image,
        forward ? { scale, x, y } : { scale: 1, x: 0, y: 0 },
        forward ? { scale: 1, x: 0, y: 0 } : { scale, x, y },
        0,
      );

      // The outgoing slide recedes as a whole: the backdrop photo and the copy
      // standing on it swell together, so the old slide reads as being pushed
      // back rather than the text leaving on its own. Going back this runs the
      // other way, settling the incoming backdrop down onto its resting size.
      if (backdropRef.current) {
        tl.fromTo(
          backdropRef.current,
          { scale: forward ? 1 : EXIT_SCALE },
          { scale: forward ? EXIT_SCALE : 1 },
          0,
        );
      }

      if (outgoingCopyRef.current) {
        tl.fromTo(
          outgoingCopyRef.current,
          { scale: 1 },
          { scale: EXIT_SCALE, duration: DURATION * 0.45 },
          0,
        ).to(
          outgoingCopyRef.current,
          // Nearly full through the swell, then gone quickly — matches the
          // measured drop rather than a flat cross-fade.
          { opacity: 0, duration: DURATION * 0.32, ease: "power2.in" },
          0,
        );
      }

      // Grow the copy box from the height it held to the height the new text
      // needs, rather than letting it snap on the swap. Only when the two differ
      // — most steps land on the same number of lines and an identity tween on
      // height would still cost a layout pass per frame for nothing.
      //
      // clearProps hands the box back to the layout at the end, so it stays
      // auto-height and keeps reflowing with the viewport afterwards.
      if (copyWrapRef.current && anim.copyHeight != null) {
        const to = copyWrapRef.current.getBoundingClientRect().height;

        if (Math.abs(to - anim.copyHeight) > 1) {
          tl.fromTo(
            copyWrapRef.current,
            { height: anim.copyHeight },
            { height: to, clearProps: "height" },
            0,
          );
        }
      }

      // The incoming copy assembles itself over the new photo, in the order the
      // clip plays it: the eyebrow first, then the title a line at a time, then
      // the paragraph and the link. It is held until the panel has taken the
      // copy's corner of the stage so the lines never arrive over the old shot.
      const inCopy = incomingCopyRef.current;

      if (inCopy) {
        const eyebrow = inCopy.querySelector(".fd-eyebrow");
        const title = inCopy.querySelector(".fd-title");
        const desc = inCopy.querySelector(".fd-desc");
        const cta = inCopy.querySelector(".fd-cta");
        const rise = { duration: DURATION * 0.4, ease: "power3.out" };

        if (eyebrow) {
          tl.fromTo(
            eyebrow,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, ...rise },
            DURATION * 0.45,
          );
        }

        // The signature move. Each line of the title is wrapped in its own
        // clipped box and slid up from underneath it, so the letters wipe into
        // view from the top down instead of fading — in the clip the second line
        // is still only a sliver of its capitals while the first is most of the
        // way up, which is the stagger below.
        if (title) {
          splitRef.current = SplitText.create(title, {
            type: "lines",
            mask: "lines",
          });

          tl.from(
            splitRef.current.lines,
            {
              yPercent: 115,
              // Faded as well as wiped. The mask alone gives a hard edge as each
              // line clears its box; carrying the opacity up with it softens the
              // arrival and matches the rest of the block, which all fades in.
              opacity: 0,
              duration: DURATION * 0.5,
              ease: "power3.out",
              stagger: 0.09,
            },
            DURATION * 0.52,
          );
        }

        if (desc) {
          tl.fromTo(
            desc,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, ...rise },
            DURATION * 0.72,
          );
        }

        if (cta) {
          tl.fromTo(
            cta,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, ...rise },
            DURATION * 0.8,
          );
        }
      }

      // Rail: every card animates from where it just was to where it now is, so
      // the promotion into the wider leading slot is a resize rather than a cut.
      if (railStateRef.current) {
        Flip.from(railStateRef.current, {
          duration: DURATION,
          ease: EASE,
          // Resize by transform, not by width. Letting Flip animate the real
          // width reflows the rail: the promoted card spends the whole run
          // narrower than its slot, and the flex row pulls every card after it
          // in by the difference — measured at 66px, which is enough to walk the
          // arriving card on top of its neighbour before both snap into place at
          // the end. Scaling costs nothing here because the two card sizes are
          // the same shape (384x494 and 318x410 are both 1:1.29), so a uniform
          // scale carries one to the other with no distortion to correct.
          scale: true,
          // The card leaving the rail is the one growing into the backdrop, and
          // the panel starts life exactly over its box — so dropping it on the
          // first frame is invisible and saves animating a detached node.
          onLeave: (els) => gsap.set(els, { opacity: 0 }),
          // Arrivals have no previous box for Flip to work back from, so they
          // would otherwise appear in place. Send it in from beyond the rail's
          // trailing edge, which is where the reference brings it in from.
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { opacity: 0, x: step },
              { opacity: 1, x: 0, duration: DURATION, ease: EASE },
            ),
        });
        railStateRef.current = null;
      }

      // Belt and braces for a run that never reaches `finish` — a category
      // switch or an unmount part way through. The line wrappers have to come
      // off, and the copy box must not be left frozen at an inline height that
      // would stop it reflowing.
      return () => {
        splitRef.current?.revert();
        splitRef.current = null;

        if (copyWrapRef.current) {
          gsap.set(copyWrapRef.current, { clearProps: "height" });
        }
      };
    },
    { scope: stageRef, dependencies: [anim] },
  );

  return (
    <section className="relative z-10">
      <div className="bg-background">
        {/* Padding tracks viewport height above lg so a short laptop screen
            gives up whitespace before the section gives up the fold, and returns
            to its original spacing at 2xl along with the cards. */}
        <Container className="max-md:pt-0 md:pt-16 pb-10 lg:pt-[min(4rem,6vh)] lg:pb-[min(2.5rem,4vh)] 2xl:pt-24 2xl:pb-16">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </Container>
      </div>

      <div
        ref={stageRef}
        className="bg-navy relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* Active slide echoed as the dimmed full-bleed backdrop.
            Every slide in the category stays mounted and the swap is a pure
            opacity crossfade. Keying a single layer on the active slide instead
            made React tear the old image out and mount a fresh one at opacity 0,
            so the navy behind flashed through and the change stalled on the new
            file decoding.
            `isolate` keeps the z-indexes below contained: this wrapper stays at
            z-auto so the Container after it still paints on top. */}
        <div
          ref={backdropRef}
          className="absolute inset-0 isolate will-change-transform"
          aria-hidden="true"
        >
          {slides.map((slide) => (
            <div
              key={slide.key}
              className={cn(
                "absolute inset-0",
                slide.key === backdrop.key ? "z-10" : "z-0 opacity-0",
              )}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
          {/* Above every layer, so the dim never fades along with the swap. */}
          <div className="absolute inset-0 z-20 bg-black/55" />
        </div>

        {/* The growing (or shrinking) panel. It sits above the backdrop and the
            copy but below the rail, which is the order the reference uses: the
            cards and controls ride over the panel the whole way while the copy
            underneath is swallowed by it. */}
        {panel && (
          <div
            ref={expanderRef}
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden will-change-[clip-path]"
            aria-hidden="true"
          >
            <div
              ref={expanderImageRef}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src={panel.image}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
            {/* Matches the backdrop's dim so the handover at the end of the
                animation lands on identical pixels and nothing flickers. */}
            <div className="absolute inset-0 bg-black/55" />
          </div>
        )}

        {/* No min-height on the stage. Pinning it to the viewport left ~115px of
            slack that mt-auto simply spread out, and stacked under the heading
            block it pushed the section 338px past the fold on a 900px screen.
            Height now comes from the content, which the card sizing below caps
            against the viewport — so the whole section fits on one screen. */}
        <Container className="relative flex flex-col pt-10 pb-10 max-lg:min-h-0 lg:pt-[min(2.5rem,4vh)] lg:pb-[min(2rem,3.5vh)] 2xl:pt-14 2xl:pb-11">
          {/* Category tabs — individually outlined boxes with small gaps;
              the active tab flips to solid white, as in the design. */}
          <div className="relative z-30 flex flex-wrap gap-3 max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden lg:justify-end">
            {categories.map((tab) => (
              <FrameButton
                key={tab.key}
                variant="tab"
                active={tab.key === category}
                onClick={() => selectCategory(tab.key)}
              >
                {tab.label}
              </FrameButton>
            ))}
          </div>

          {/* mt-auto drops the content block to the section's bottom edge;
              items-end aligns the copy's CTA with the card bottoms. */}
          <div className="flex flex-col max-lg:mt-10 max-lg:gap-8 max-lg:pt-0 lg:mt-auto lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:gap-14 lg:pt-[min(2rem,3.5vh)] 2xl:pt-14">
            {/* Active destination copy.
                z-30 puts it above the panel, which is where the clip has it: the
                new title wipes in over the photo that has just arrived. Under the
                panel none of that is visible — the lines would reveal themselves
                behind an opaque image and only appear when it was removed.
                The outgoing block is layered on top of the incoming one for the
                length of the transition so the two can cross rather than cut;
                it is out of flow so it cannot change the section's height as it
                leaves. */}
            <div
              ref={copyWrapRef}
              className="relative z-30 shrink-0 max-lg:mx-auto lg:pb-[88px]"
            >
              {anim && (
                <div
                  ref={outgoingCopyRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 max-w-[452px] max-lg:flex max-lg:flex-col max-lg:items-center max-lg:text-center"
                >
                  <SlideCopy slide={anim.prev} />
                </div>
              )}

              <div
                ref={incomingCopyRef}
                key={`copy-${active.key}`}
                className="max-w-[452px] max-lg:flex max-lg:flex-col max-lg:items-center max-lg:text-center"
              >
                <SlideCopy slide={active} />
              </div>
            </div>

            {/* Card rail + controls. The negative margin cancels the container's
                right padding so the last card bleeds to the viewport edge like
                the design; the bottom bar adds it back so "View all" stays on
                the container grid. */}
            <div className="relative z-30 flex min-w-0 flex-col lg:-mr-20">
              {/* items-end keeps card bottoms aligned so the lead card rises
                  above the other two. The rail always clips at the viewport
                  edge (scrollable, scrollbar hidden) — on narrower desktops the
                  fixed-size cards would otherwise spill into a page-wide
                  horizontal scroll. */}
              <div
                ref={railRef}
                className="flex items-end gap-[13px] overflow-x-auto max-lg:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {upcoming.map((slide, i) => (
                  <figure
                    key={slide.key}
                    // Flip matches cards between layouts on this id, so it has
                    // to be the slide — not the slot — or a card sliding one
                    // place left reads as two unrelated elements swapping.
                    data-flip-id={slide.key}
                    {...(i === 0 ? { "data-lead": "" } : {})}
                    className={cn(
                      "relative shrink-0 overflow-hidden",
                      // lg:max-w-none is required, not cosmetic: max-w-[300px] is
                      // the mobile cap, and without lifting it the lead card
                      // stays clamped to 300px on desktop — narrower than the
                      // 318px followers, so it sinks below them instead of
                      // rising above as the design intends.
                      // Widths are capped against viewport height as well as
                      // held to their old maximums, so on a short screen the
                      // rail shrinks instead of pushing the section past the
                      // fold. The cards are the tallest thing in the stage, so
                      // they are what has to give. Height follows from the
                      // aspect ratio, hence the vh figures being the width the
                      // ratio needs rather than the height itself.
                      //
                      // From 2xl the cap is loosened until the pixel maximum is
                      // what bites: 384px needs 46vh, which any monitor at this
                      // width has (1536x864 upward), so large screens get the
                      // original sizes back. The vh term is still there only to
                      // catch a wide-but-short window, where fixed sizes would
                      // push the rail off the bottom again.
                      //
                      // Every pair keeps the 318:384 relationship between a
                      // follower and the lead — 24.8/30 and 38/46 are both
                      // 0.828 — which matters because Flip scales one into the
                      // other. Let them drift and the promotion stops being a
                      // uniform scale and starts squashing the photo.
                      i === 0
                        ? "aspect-424/545 w-full max-w-[300px] max-sm:aspect-[300/384] sm:w-[340px] lg:w-[min(384px,30vh)] lg:max-w-none 2xl:w-[min(384px,46vh)]"
                        : "aspect-352/454 w-[230px] max-lg:hidden sm:w-[280px] lg:w-[min(318px,24.8vh)] 2xl:w-[min(318px,38vh)]",
                    )}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.location}
                      fill
                      sizes="(min-width: 1024px) 424px, 340px"
                      className="object-cover"
                    />
                    {/* Hide the inner text block on mobile since the location is already shown in the copy block */}
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-6 max-lg:hidden">
                      <span className="font-top text-h4 text-white">
                        {slide.location}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>

              {/* Desktop Controls */}
              <div className="mt-7 flex items-center justify-between gap-6 max-lg:hidden lg:pr-20">
                <div className="flex gap-4">
                  <FrameButton
                    variant="icon"
                    className="size-15"
                    onClick={() => go(-1)}
                    disabled={!canNavigate}
                    aria-label="Previous destination"
                  >
                    <ChevronLeft
                      className="size-6"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </FrameButton>
                  <FrameButton
                    variant="icon"
                    className="size-15"
                    onClick={() => go(1)}
                    disabled={!canNavigate}
                    aria-label="Next destination"
                  >
                    <ChevronRight
                      className="size-6"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </FrameButton>
                </div>

                <div className="text-body flex items-center gap-4 text-white/95">
                  <CtaLink
                    href={viewAllHref || "/destinations"}
                    fill
                    className="border-x border-white/40 px-5 hover:text-white"
                  >
                    {viewAllLabel || "View all destinations"}
                  </CtaLink>
                </div>
              </div>

              {/* Mobile Controls */}
              <div className="mx-auto mt-7 flex w-full max-w-[300px] items-center justify-between gap-4 lg:hidden">
                <FrameButton
                  variant="icon"
                  className="size-10"
                  onClick={() => go(-1)}
                  disabled={!canNavigate}
                  aria-label="Previous destination"
                >
                  <ChevronLeft
                    className="size-5"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </FrameButton>

                <FrameButton
                  variant="rail"
                  className="px-4 text-white/95 max-sm:text-[12px] max-sm:font-light"
                >
                  Explore the destination
                </FrameButton>

                <FrameButton
                  variant="icon"
                  className="size-10"
                  onClick={() => go(1)}
                  disabled={!canNavigate}
                  aria-label="Next destination"
                >
                  <ChevronRight
                    className="size-5"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </FrameButton>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

// Split out so the outgoing and incoming blocks are guaranteed to render the
// same markup — they overlap during a transition and any difference between
// them would show up as the two crossing.
//
// The fd-* classes are what the entrance timeline hangs off: each part comes in
// on its own beat, and fd-title is additionally cut into lines and masked.
function SlideCopy({ slide }) {
  return (
    <>
      <p className="fd-eyebrow font-top text-h4 text-white/95 max-sm:text-[12px] max-sm:leading-none">
        {slide.location}
      </p>

      <h2 className="fd-title font-heading text-h3 mt-8 leading-none text-white max-sm:mt-4 max-sm:text-[25px] max-sm:tracking-[-0.01em] lg:text-[2.5rem]">
        {slide.title}
      </h2>

      <p className="fd-desc text-body mt-5 text-white/80 max-sm:text-[12px] max-sm:leading-[120%] max-sm:font-light">
        {slide.description}
      </p>

      <div className="fd-cta text-body mt-16 flex items-center gap-4 text-white/95 max-lg:hidden">
        <CtaLink
          href="/destinations"
          fill
          className="border-x border-white/40 px-5 hover:text-white"
        >
          Explore the destination
        </CtaLink>
      </div>
    </>
  );
}
