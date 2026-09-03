"use client";

import { useRef } from "react";
import Image from "next/image";


const REVIEWERS = [
  { key: "r1", src: "/credentials/user-profile/Ellipse 2.svg" },
  { key: "r2", src: "/credentials/user-profile/Ellipse 3.svg" },
  { key: "r3", src: "/credentials/user-profile/Ellipse 4.svg" },
  { key: "r4", src: "/credentials/user-profile/Ellipse 5.svg" },
  { key: "r5", src: "/credentials/user-profile/Ellipse 6.svg" },
];



const HAS_REVIEWER_PHOTOS = true;

export function AnimatedAvatars() {
  const avatarsRef = useRef(null);

  return (
    <div ref={avatarsRef} className="flex items-center">
      {REVIEWERS.slice(0, -1).map((reviewer, index) => (
        <div
          key={reviewer.key}
          className={`ring-cream bg-navy/15 relative size-10 lg:max-xl:size-7 xl:max-2xl:size-8 2xl:size-10 overflow-hidden rounded-full ring-2 cursor-pointer ${
            index > 0 ? "-ml-3 lg:max-xl:-ml-2 xl:max-2xl:-ml-2.5 2xl:-ml-3" : ""
          }`}
        >
          {HAS_REVIEWER_PHOTOS && (
            <Image
              src={reviewer.src}
              alt=""
              fill
              sizes="(min-width: 1280px) 32px, (min-width: 1024px) 28px, 40px"
              className="object-cover"
            />
          )}
        </div>
      ))}

      {/* Last avatar: profile image is the background, 13k+ overlaid on top */}
      <div className="ring-cream bg-navy/15 relative -ml-3 lg:max-xl:-ml-2 xl:max-2xl:-ml-2.5 2xl:-ml-3 size-14 lg:max-xl:size-10 xl:max-2xl:size-12 2xl:size-14 overflow-hidden rounded-full ring-2 cursor-pointer">
        {HAS_REVIEWER_PHOTOS && (
          <Image
            src={REVIEWERS[REVIEWERS.length - 1].src}
            alt=""
            fill
            sizes="(min-width: 1280px) 48px, (min-width: 1024px) 40px, 56px"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45">
          <span className="text-small lg:max-xl:text-[10px] xl:max-2xl:text-[13px] 2xl:text-small font-semibold text-white">
            13k+
          </span>
        </div>
      </div>
    </div>
  );
}
