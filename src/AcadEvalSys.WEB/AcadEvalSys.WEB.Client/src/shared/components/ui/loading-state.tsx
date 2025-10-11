import { ReactNode } from "react";
import { cn } from "@infrastructure/lib/cn";
import { PageLoader } from "./page-loader";

interface LoadingStateProps {
  message?: string;
  icon?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * @deprecated Use PageLoader or skeleton components instead
 * This component is kept for backward compatibility
 */
export function LoadingState({
  message = "Cargando...",
  icon,
  className,
  size = "md",
}: LoadingStateProps) {
  return (
    <div className={className}>
      <PageLoader />
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-8", className)}>
      {icon && (
        <div className="mx-auto mb-4 text-muted-foreground opacity-50">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      {action && action}
    </div>
  );
}
