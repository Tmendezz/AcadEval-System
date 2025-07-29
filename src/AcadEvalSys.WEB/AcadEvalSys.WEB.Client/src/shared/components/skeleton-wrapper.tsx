import { ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";

interface SkeletonWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  fallback?: ReactNode;
  variant?: "default" | "grid" | "list";
  className?: string;
}

export function SkeletonWrapper({
  children,
  isLoading,
  fallback,
  variant = "default",
  className,
}: SkeletonWrapperProps) {
  if (isLoading) {
    if (fallback) {
      return <div className={className}>{fallback}</div>;
    }

    switch (variant) {
      case "grid":
        return (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${
              className || ""
            }`}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        );

      case "list":
        return (
          <div className={`space-y-3 ${className || ""}`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        );

      default:
        return (
          <div className={className}>
            <Skeleton className="h-32 w-full" />
          </div>
        );
    }
  }

  return <>{children}</>;
}
