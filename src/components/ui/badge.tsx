import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "accent" | "success" | "danger" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-surface-2 text-text-muted border-border",
    accent: "bg-accent/15 text-accent border-accent/30",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    danger: "bg-danger/15 text-danger border-danger/30",
    outline: "text-text border-border",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
