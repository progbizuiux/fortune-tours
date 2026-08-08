import Image from "next/image";
import { FaInstagram } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import styles from "./PolaroidGallery.module.css";
import { AnimateIn } from "@/components/common/AnimateIn";

/* Rotation, vertical offset (% of card height) and stacking order are tuned
   per card to match the scattered Figma composition. Cards 2 and 4 drop out
   below md / lg so the strip keeps the same look with 3 or 4 photos. */
const POLAROIDS = [
  {
    src: "/home/image-2.jpg",
    alt: "Family posing at the Hong Kong Disneyland Resort entrance",
    handle: "fortunetours",
    rotate: "10deg",
    offsetY: "18%",
    z: 5,
  },
  {
    src: "/home/image-5.png",
    alt: "Bell tower rising over sunlit rooftops in Florence",
    handle: "fortunetours",
    rotate: "-6deg",
    offsetY: "5%",
    z: 4,
    className: "hidden md:block",
  },
  {
    src: "/home/image-4.png",
    alt: "Traveller in a white dress on the wooden deck of a river cruiser",
    handle: "fortunetours",
    rotate: "9deg",
    offsetY: "27%",
    z: 3,
  },
  {
    src: "/home/image-3.png",
    alt: "Waterside breakfast table set with ceramics and fresh flowers",
    handle: "fortunetours",
    rotate: "-5deg",
    offsetY: "13%",
    z: 2,
    className: "hidden lg:block",
  },
  {
    src: "/home/image-1.png",
    alt: "Sunset over the deck of a sailing river cruise ship",
    handle: "fortunetours",
    rotate: "3.5deg",
    offsetY: "10%",
    z: 1,
  },
];

export function PolaroidGallery() {
  return (
    <section
      aria-label="Travel moments from our journeys"
      className="bg-cream overflow-hidden pt-[17vw] md:pt-[10vw] lg:pt-[8.5vw]"
    >
      {/* <ul className={styles.strip}> */}
      <AnimateIn
                as="ul"
                stagger={0.12}
                className={styles.strip}>
        {POLAROIDS.map((shot) => (
          <li
            key={shot.src}
            className={cn(styles.card, shot.className)}
            style={{ "--r": shot.rotate, "--y": shot.offsetY, "--z": shot.z }}
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
                <FaInstagram aria-hidden="true" className="size-4" />
                {shot.handle}
              </figcaption>
            </figure>
          </li>
        ))}
      </AnimateIn>
    </section>
  );
}
