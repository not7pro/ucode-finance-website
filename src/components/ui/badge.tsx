import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "rush" | "success" | "warning";
}

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  const variantClasses = {
    default:
      "bg-primary/10 text-primary border-primary/20",
    secondary:
      "bg-secondary text-secondary-foreground border-transparent",
    outline:
      "text-foreground border-border",
    rush:
      "bg-red-500/10 text-red-500 border-red-500/20 font-semibold",
    success:
      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-semibold",
    warning:
      "bg-amber-500/10 text-amber-500 border-amber-500/20 font-semibold",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
