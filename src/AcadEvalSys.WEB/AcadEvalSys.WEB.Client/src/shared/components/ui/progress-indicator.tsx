import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@infrastructure/lib/cn";

interface ProgressIndicatorProps {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressIndicator({
  value,
  showLabel = true,
  size = "md",
  className,
}: ProgressIndicatorProps) {
  const sizeClasses = {
    sm: "h-1 w-16",
    md: "h-2 w-24",
    lg: "h-3 w-32",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Progress value={value} className={sizeClasses[size]} />
      {showLabel && <span className="text-sm font-medium">{value}%</span>}
    </div>
  );
}
