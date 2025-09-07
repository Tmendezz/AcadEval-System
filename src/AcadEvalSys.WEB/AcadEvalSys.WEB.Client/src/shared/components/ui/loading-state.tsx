import { ReactNode } from "react";
import { cn } from "@infrastructure/lib/cn";

interface LoadingStateProps {
  message?: string;
  icon?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({
  message = "Cargando...",
  icon,
  className,
  size = "md",
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("text-center py-8", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-primary mx-auto mb-4",
          sizeClasses[size]
        )}
      >
        {icon}
      </div>
      <p className="text-muted-foreground">{message}</p>
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
