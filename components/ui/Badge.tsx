import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "destructive" | "warning" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-indigo-600 text-white",
    secondary: "bg-slate-100 text-slate-800",
    success: "bg-emerald-100 text-emerald-800",
    destructive: "bg-red-100 text-red-800",
    warning: "bg-amber-100 text-amber-800",
    outline: "text-slate-800 border border-slate-300",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
