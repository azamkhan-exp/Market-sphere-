import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  totalStars = 5,
  size = "md",
  showNumber = true,
  reviewCount,
  className,
}: StarRatingProps) {
  const sizeMap = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={cn("inline-flex items-center space-x-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: totalStars }).map((_, index) => {
          const fillPercentage = Math.max(0, Math.min(1, rating - index));
          return (
            <div key={index} className="relative">
              <Star className={cn(sizeMap[size], "text-slate-200 fill-slate-200")} />
              {fillPercentage > 0 && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercentage * 100}%` }}
                >
                  <Star className={cn(sizeMap[size], "text-amber-400 fill-amber-400")} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-slate-700 ml-1">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-slate-500 ml-0.5">({reviewCount})</span>
      )}
    </div>
  );
}
