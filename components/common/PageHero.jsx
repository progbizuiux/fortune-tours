"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";
import { Container } from "@/components/common/Container";
import { CtaLink } from "@/components/common/CtaLink";
import { BookingCtaButton } from "@/components/packages/BookingCtaButton";
import { gsap, useGSAP } from "@/lib/gsap";
import { HERO_BODY, HERO_CTA, HERO_HEADING } from "@/lib/typography";
import { cn } from "@/lib/utils";

/* The full-bleed opening hero: a background that fills the frame, a centred
 * stack of eyebrow / title / body / CTA row over it, pinned while the page
 * scrolls up and over it.
 *
 * Lifted out of components/home/HeroSection.jsx verbatim — geometry, scrim and
 * entrance timeline unchanged — the moment a second page needed the same frame.
 * The destination pages (/africa and its siblings) draw this exact section and
 * only the background and the copy differ, so the alternative was a second copy
 * that would drift from the first. Callers own the content; this owns the frame.
 *
 * Carries no copy of its own on purpose. Each page's defaults belong with that
 * page — see components/home/HeroSection.jsx and lib/strapi/destination.js —
 * so nothing here has to know which section it is standing in for.
 *
 * The background is either a looping video (the home page) or a still (every
 * destination page). One of `video` / `image`, not both: they occupy the same
 * box, so a caller passing each would stack two backgrounds. `video` wins if
 * both arrive.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  /* A second, emphasised line under the description — the package detail
     frame's "From INR 44,900 per person" sitting under its inclusions line.
     Optional and unset everywhere else, so the home and destination heroes
     render exactly as before. */
  note,
  ctas = [],
  video,
  image,
  imageAlt = "",
  /* Optional modal props for packages opening enquiry dialog from banner */
  formTitle,
  formDescription,
  formImage,
  formImageAlt,
  packageName,
  /* Only the home page's video is above the fold on first paint today. A still
     that is genuinely the LCP element should pass `priority` — see the
     destination pages, which do. */
  priority = false,
  /* The scrim over the background. Left unset, the hero draws the three-layer
     scrim below, which is what the home and destination frames specify. A page
     whose frame states a different one passes it as a single class — /about-us
     draws a flat #000000 at 20%, straight off its Figma panel — and that one
     layer replaces the trio rather than stacking on top of it. */
  overlayClassName,
  className,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  // Mirrors the video's own muted state so the corner button's icon always
  // matches what the viewer is actually hearing — the autoplay logic below and
  // the visibility observer both flip `muted` on their own, so the button
  // listens to the element rather than owning the state.
  const [muted, setMuted] = useState(true);
  // Tracks whether the viewer muted the video themselves, so the
  // autoplay/visibility logic below — which otherwise unmutes on every
  // scroll or click — knows to leave it alone until they unmute again.
  const userMutedRef = useRef(false);

  useEffect(() => {
    if (!video) return;
    const videoEl = videoRef.current;
    const container = containerRef.current;
    if (!videoEl || !container) return;

    let isVisible = true;

    setMuted(videoEl.muted);
    const onVolumeChange = () => setMuted(videoEl.muted);
    videoEl.addEventListener("volumechange", onVolumeChange);

    /* Playback never stops — the clip keeps looping whether or not the hero is
       on screen; only the audio follows visibility. Autoplay with sound is
       blocked until the page has been engaged with, so start muted (which is
       always allowed), immediately try to lift it, and keep retrying on every
       user gesture until the browser lets the sound through. */
    const unmute = () => {
      if (!isVisible || userMutedRef.current) return;
      videoEl.muted = false;
      const played = videoEl.play();
      if (played) {
        played.catch(() => {
          videoEl.muted = true;
          videoEl.play().catch(() => {});
        });
      }
    };

    videoEl.muted = true;
    videoEl.play().catch(() => {});
    unmute();

    const handleInteraction = () => {
      unmute();
    };

    const events = ["click", "touchstart", "touchend", "scroll", "keydown", "wheel", "pointerdown"];
    const removeListeners = () => {
      events.forEach((ev) => {
        window.removeEventListener(ev, handleInteraction, { capture: true });
      });
    };

    events.forEach((ev) => {
      window.addEventListener(ev, handleInteraction, { capture: true, passive: true });
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting && entry.intersectionRatio > 0.05;
        if (isVisible) {
          unmute();
        } else {
          videoEl.muted = true;
        }
      },
      { threshold: [0, 0.05, 0.25, 0.5] }
    );

    observer.observe(container);

    return () => {
      removeListeners();
      observer.disconnect();
      videoEl.removeEventListener("volumechange", onVolumeChange);
    };
  }, [video]);

  // The corner control: flips the video's sound on or off. Unmuting counts as
  // the user gesture browsers require, so a play() nudge follows it.
  const toggleMute = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.muted = !videoEl.muted;
    userMutedRef.current = videoEl.muted;
    if (!videoEl.muted) videoEl.play().catch(() => {});
    setMuted(videoEl.muted);
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // The image is only scaled, never faded: useGSAP runs after hydration, so
      // fading it from 0 would blank the already-painted hero. Text elements
      // ship as opacity-0 in the markup so their start state matches the tween.
      tl.from(".hero-image", { scale: 1.08, duration: 1.2 })
        .fromTo(
          ".hero-eyebrow",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.9",
        )
        .fromTo(
          ".hero-heading",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4",
        )
        .fromTo(
          ".hero-description",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.5",
        )
        .fromTo(
          ".hero-cta",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4",
        );
    },
    { scope: containerRef },
  );

  // Pinned to the top while the rest of the page scrolls up over it. z-0 keeps
  // it at the bottom of the stacking order; every following block is z-10 so it
  // paints on top rather than sliding underneath.
  return (
    <section
      ref={containerRef}
      className={cn(
        "sticky top-0 z-0 flex min-h-screen items-center justify-center overflow-hidden",
        className,
      )}
    >
      {/* Without JS the entrance tweens never run, so reveal the copy up front. */}
      <noscript>
        <style>{`.hero-eyebrow,.hero-heading,.hero-description,.hero-cta{opacity:1 !important}`}</style>
      </noscript>

      <div className="hero-image absolute inset-0">
        {video ? (
          /* Hero background video — falls back to the poster image */
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none select-none [&::-webkit-media-controls]:hidden! [&::-webkit-media-controls-start-playback-button]:hidden! [&::-webkit-media-controls-play-button]:hidden! [&::-webkit-media-controls-panel]:hidden!"
            src={video}
            poster={image || undefined}
            autoPlay
            muted
            loop
            playsInline
            webkit-playsinline="true"
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            aria-hidden="true"
          />
        ) : (
          image && (
            <Image
              className="object-cover object-center"
              src={image}
              alt={imageAlt}
              fill
              sizes="100vw"
              priority={priority}
            />
          )
        )}
        {overlayClassName ? (
          <div aria-hidden="true" className={cn("absolute inset-0", overlayClassName)} />
        ) : (
          <>
            {/* Scrim tuned so white/90 copy clears WCAG AA over the brightest
                areas of the photo, including the sky band on tall viewports. */}
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/20 to-transparent" />
          </>
        )}
      </div>

      <Container className="relative flex flex-col items-center max-md:gap-4 gap-6 pt-20 text-center">
        <span className="hero-eyebrow font-top max-md:text-[13px] text-h4 text-white/90 opacity-0">
          {eyebrow}
        </span>

        <h1
          // lg to 2xl: a narrower measure so the title holds two lines, and
          // the h2 token instead of HERO_HEADING's 52px step — the next size
          // down that already exists in the scale, so nothing new is invented
          // for this band. Below lg and from 2xl up are untouched.
          /* whitespace-pre-line honours a deliberate break in the title — the
             package frame sets its two lines explicitly — and still wraps on
             overflow, so the single-line home and region titles are unaffected. */
          className={`hero-heading ${HERO_HEADING} whitespace-pre-line max-md:max-w-[400px] max-w-4xl lg:max-2xl:max-w-[620px] text-white opacity-0`}
        >
          {title}
        </h1>

        <p
          className={`hero-description ${HERO_BODY} max-md:max-w-[400px] max-w-3xl max-md:text-white/80 text-white/90 opacity-0 max-md:px-4`}
        >
          {description}
        </p>

        {note && (
          /* Shares the description's entrance class so the two lines arrive
             together rather than as two separate beats. */
          <p
            className={`hero-description ${HERO_BODY} max-md:max-w-[313px] max-w-lg font-medium text-white opacity-0 max-md:px-4 -mt-4 max-md:-mt-2`}
          >
            {note}
          </p>
        )}

        {/* Wraps rather than nowrap. Held on one line, a narrow phone
            squeezed each control until its own label broke over two lines —
            "Book Your Seat" over 64px of button — which stops reading as a
            button at all. Wrapping only engages when the row genuinely does not
            fit, so the single-CTA and short-label heroes are unchanged. */}
        <div className="hero-cta mt-4 flex flex-wrap items-center justify-center max-md:gap-4 gap-x-6 gap-y-3 max-md:text-[13px] max-md:leading-6 text-body text-white/90 opacity-0">
          {ctas.map((link, index) =>
            link.opensForm ? (
              <BookingCtaButton
                key={link.label}
                href={link.href}
                label={link.label}
                withLeftDivider={index > 0}
                dividerClassName="h-6 w-px bg-white/40 max-sm:hidden"
                className={`${HERO_CTA} border-white/40 text-white inline-flex items-center justify-center whitespace-nowrap`}
                modalTitle={formTitle ?? link.formTitle}
                modalDescription={formDescription ?? link.formDescription}
                image={formImage ?? link.formImage ?? image}
                imageAlt={formImageAlt ?? link.formImageAlt ?? imageAlt}
                packageName={packageName ?? link.packageName ?? title?.replace(/\n/g, " ")}
              />
            ) : (
              <CtaLink
                key={link.label}
                href={link.href}
                fill
                className={`${HERO_CTA} border-white/40 whitespace-nowrap`}
              >
                {link.label}
              </CtaLink>
            )
          )}
        </div>
      </Container>

      {/* Sound toggle for the background video, pinned to the banner's
          bottom-left corner. Only rendered when a video is playing. */}
      {video && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          aria-pressed={!muted}
          className="absolute bottom-5 left-5 z-20 flex items-center justify-center text-white transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 max-md:bottom-10 max-md:left-4"
        >
          {muted ? (
            <VolumeX className="h-7 w-7 drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]" strokeWidth={1.25} aria-hidden="true" />
          ) : (
            <Volume2 className="h-7 w-7 drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]" strokeWidth={1.25} aria-hidden="true" />
          )}
        </button>
      )}
    </section>
  );
}
