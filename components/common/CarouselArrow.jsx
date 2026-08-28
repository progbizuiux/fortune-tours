import { ChevronLeft, ChevronRight } from "lucide-react";
import { FrameButton } from "@/components/common/FrameButton";
import { cn } from "@/lib/utils";

/* The frosted carousel arrow (Figma, curated places: 62×70 box, 0.7px white
   rule on all sides, 15px backdrop blur, 18px white chevron). One component
   serves both sides so the pair can never drift apart — the caller passes
   `direction` plus its own positioning and aria-label. Builds on FrameButton's
   `icon` variant, so hover/focus behave like every other framed control. */
export function CarouselArrow({ direction = "next", className, ...props }) {
  const Chevron = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <FrameButton
      variant="icon"
      className={cn(
        "h-[70px] w-[62px] border-[0.7px] border-white backdrop-blur-[15px]",
        className,
      )}
      {...props}
    >
      <Chevron className="size-[18px] lg:max-xl:size-[14px] xl:max-2xl:size-[16px] 2xl:size-[18px]" strokeWidth={1.5} aria-hidden="true" />
    </FrameButton>
  );
}
