import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANT_CLASSES = {
  primary: "bg-sky text-white hover:bg-[#0089b8] focus-visible:outline-sky",
  secondary:
    "bg-navy text-white hover:bg-navy/90 focus-visible:outline-navy dark:bg-cream dark:text-navy dark:hover:bg-white",
  outline:
    "border border-navy/20 text-navy hover:bg-navy/5 focus-visible:outline-navy/40 dark:border-cream/30 dark:text-cream dark:hover:bg-white/10",
  ghost:
    "text-navy hover:bg-navy/5 focus-visible:outline-navy/30 dark:text-cream dark:hover:bg-white/10",
};

const SIZE_CLASSES = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-base gap-2",
  lg: "h-12 px-8 text-lg gap-2.5",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  fullWidth = false,
  className,
  type = "button",
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!loading && rightIcon && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}
