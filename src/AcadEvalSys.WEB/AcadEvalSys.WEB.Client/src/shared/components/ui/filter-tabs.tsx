import { Button } from "@/shared/components/ui/button";
import { cn } from "@infrastructure/lib/cn";

interface FilterOption {
  value: string | number;
  label: string;
  count?: number;
  active?: boolean;
}

interface FilterTabsProps {
  options: FilterOption[];
  onFilterChange: (value: string | number) => void;
  className?: string;
  showCount?: boolean;
}

export function FilterTabs({
  options,
  onFilterChange,
  className,
  showCount = true,
}: FilterTabsProps) {
  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <span className="text-sm font-medium">Filtrar por:</span>
      <div className="flex space-x-2">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={option.active ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
            {showCount && option.count !== undefined && (
              <span className="ml-1">({option.count})</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
