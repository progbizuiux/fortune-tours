import { cn } from "@/lib/utils";


const VARIANT_CLASSES = {
  chip: {
    base: "h-[43px] w-[125px] border-x border-white font-heading text-[22px] leading-none tracking-[-0.01em]",
    idle: "text-white hover:bg-white hover:text-black",
    active: "bg-white text-black",
  },
  rail: {
    base: "text-body border-x px-2.5 py-2",
    idle: "border-black/20 text-black hover:border-transparent hover:bg-black hover:text-white dark:border-cream/20 dark:text-cream dark:hover:bg-cream dark:hover:text-navy",
    active: "border-transparent bg-black text-white dark:bg-cream dark:text-navy",
  },
};

export function FrameButton({
  children,
  variant = "chip",
  active = false,
  className,
  type = "button",
  ...props
}) {
  const styles = VARIANT_CLASSES[variant];

  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center transition-colors duration-300",
        "focus-visible:outline-sky focus-visible:outline-2 focus-visible:outline-offset-2",
        styles.base,
        active ? styles.active : styles.idle,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
