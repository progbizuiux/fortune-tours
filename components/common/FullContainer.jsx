import { cn } from "@/lib/utils";

/**
 * FullContainer — full-width container with a fixed 8px horizontal padding
 * on both sides. Use this when you want content to stretch edge-to-edge with
 * just a small breathing gap (e.g. scrollable card strips).
 */
export function FullContainer({
  children,
  className,
  as: Tag = "div",
  ...props
}) {
  return (
    <Tag className={cn("w-full px-2", className)} {...props}>
      {children}
    </Tag>
  );
}
