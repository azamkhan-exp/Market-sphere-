"use client";

import * as React from "react";
import Image, { ImageProps } from "next/image";

export interface ProductImageProps extends Omit<ImageProps, "src" | "alt" | "onError"> {
  src?: string | null;
  alt?: string | null;
  fallbackSrc?: string;
  containerClassName?: string;
}

const DEFAULT_FALLBACK = "/images/product-placeholder.svg";

export function ProductImage({
  src,
  alt = "MarketSphere Product",
  fallbackSrc = DEFAULT_FALLBACK,
  className = "",
  containerClassName = "",
  fill,
  width,
  height,
  priority = false,
  sizes,
  ...props
}: ProductImageProps) {
  const resolvedInitialSrc = (src && src.trim() !== "") ? src : fallbackSrc;
  const [currentSrc, setCurrentSrc] = React.useState<string>(resolvedInitialSrc);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  // Sync state if incoming src prop changes
  React.useEffect(() => {
    const valid = (src && src.trim() !== "") ? src : fallbackSrc;
    setCurrentSrc(valid);
    setHasError(false);
    setIsLoading(true);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const isSvgFallback = currentSrc === DEFAULT_FALLBACK;

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 ${
        fill ? "w-full h-full" : ""
      } ${containerClassName}`}
    >
      {/* Loading Shimmer Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse z-10" />
      )}

      <Image
        src={currentSrc}
        alt={alt || "MarketSphere Product Image"}
        fill={fill}
        width={!fill ? width || 400 : undefined}
        height={!fill ? height || 400 : undefined}
        priority={priority}
        sizes={sizes || (fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined)}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${isSvgFallback ? "object-contain p-2" : "object-cover"} ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={isSvgFallback}
        {...props}
      />
    </div>
  );
}
