import Link from "next/link";
import { cn } from "@/lib/utils";

export function CtaLink({
  href,
  children,
  className,
  withLeftDivider = false,
  withRightDivider = true,
  dividerClassName = "h-6 w-px bg-white/40",
  ...props
}) {
  return (
    <>
      {withLeftDivider && (
        <span className={dividerClassName} aria-hidden="true" />
      )}
      <Link href={href} className={cn("hover:text-sky transition-colors", className)} {...props}>
        {children}
      </Link>
      {withRightDivider && (
        <span className={dividerClassName} aria-hidden="true" />
      )}
    </>
  );
}
