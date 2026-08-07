import { cn } from "@/lib/utils";
import styles from "./Container.module.css";

export function Container({
  children,
  className,
  as: Tag = "div",
  spacing = false,
  ...props
}) {
  return (
    <Tag
      className={cn(styles.container, spacing && styles.spacing, className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
