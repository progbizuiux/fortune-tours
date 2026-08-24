import Image from "next/image";
import { FaInstagram } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import styles from "./PolaroidGallery.module.css";
import { AnimateIn } from "@/components/common/AnimateIn";

/* Rotation and vertical offset (% of card height) are tuned per position to
   match the scattered Figma composition, so they stay here rather than in the
   CMS — an editor picks the photographs, not the scatter. The list cycles, so
   a sixth photo reuses the first card's angle instead of stacking flat. */
const LAYOUT = [
  { rotate: "10deg", offsetY: "18%" },
  { rotate: "-6deg", offsetY: "5%" },
  { rotate: "9deg", offsetY: "27%" },
  { rotate: "-5deg", offsetY: "13%" },
  { rotate: "3.5deg", offsetY: "10%" },
];

/* Content comes from the `sections.social-gallery` block via lib/strapi/home.js
   on the home page. Any other page renders the strip with no props and gets
   these photographs. */
const POLAROIDS = [
  {
    src: "/home/image-2.jpg",
    alt: "Family posing at the Hong Kong Disneyland Resort entrance",
    handle: "fortunetours",
  },
  {
    src: "/home/image-5.png",
    alt: "Bell tower rising over sunlit rooftops in Florence",
    handle: "fortunetours",
  },
  {
    src: "/home/image-4.png",
    alt: "Traveller in a white dress on the wooden deck of a river cruiser",
    handle: "fortunetours",
  },
  {
    src: "/home/image-3.png",
    alt: "Waterside breakfast table set with ceramics and fresh flowers",
    handle: "fortunetours",
  },
  {
    src: "/home/image-1.png",
    alt: "Sunset over the deck of a sailing river cruise ship",
    handle: "fortunetours",
  },
];

export function PolaroidGallery({ items = POLAROIDS }) {
  return (
    <section
      aria-label="Travel moments from our journeys"
      className="overflow-hidden pt-[17vw] md:pt-[10vw] lg:pt-[8.5vw]"
    >
      {/* <ul className={styles.strip}> */}
      <AnimateIn
                as="ul"
                stagger={0.12}
                className={styles.strip}>
        {items.map((shot, i) => {
          const layout = LAYOUT[i % LAYOUT.length];

          return (
            <li
              key={`${i}-${shot.src}`}
              className={cn(styles.card, shot.className)}
              style={{
                "--r": layout.rotate,
                "--y": layout.offsetY,
                /* Descending, so the first card sits on top however many the
                   CMS holds — the 5,4,3,2,1 the design was drawn with. */
                "--z": items.length - i,
              }}
            >
              <figure className={styles.frame}>
                <div className={styles.photo}>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 23vw, 36vw"
                    className="object-cover"
                  />
                  <div className={styles.scrim} aria-hidden="true" />
                </div>
                <figcaption className={styles.caption}>
                  <Caption {...shot} />
                </figcaption>
              </figure>
            </li>
          );
        })}
      </AnimateIn>
    </section>
  );
}

/* The caption is the strip's one interactive element, so it carries the link
   when the CMS supplies one. It is hidden until the card is hovered, which is
   why the stylesheet also reveals it on :focus-within — otherwise the link
   would be reachable by keyboard while invisible. */
function Caption({ handle, href, icon, iconAlt }) {
  /* `unoptimized`: the optimiser refuses SVG unless next.config sets
     dangerouslyAllowSVG, and a social glyph is as likely to be uploaded as an
     SVG as a PNG. Nothing is lost — there is no work to do on a 16px mark. */
  const glyph = icon ? (
    <Image
      src={icon}
      alt={iconAlt || ""}
      width={16}
      height={16}
      unoptimized
      className="size-3 object-contain md:size-4"
    />
  ) : (
    <FaInstagram aria-hidden="true" className="size-3 md:size-4" />
  );

  if (!href) {
    return (
      <>
        {glyph}
        {handle}
      </>
    );
  }

  /* An absolute link points off-site (an Instagram post, in practice); a path
     stays in the tab. Plain <a> either way, as the footer's socials do. */
  const external = /^https?:\/\//i.test(href);

  return (
    <a
      href={href}
      className={styles.handle}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {glyph}
      {handle}
    </a>
  );
}
