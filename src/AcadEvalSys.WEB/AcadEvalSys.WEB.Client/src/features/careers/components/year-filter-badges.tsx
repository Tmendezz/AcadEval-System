import { Badge } from "@/shared/components/ui/badge";
import { CareerYear, CareerYearLabels } from "@/shared/types/enums";

interface YearFilterBadgesProps {
  selectedYear: CareerYear | null;
  onYearChange: (year: CareerYear) => void;
}

export function YearFilterBadges({
  selectedYear,
  onYearChange,
}: YearFilterBadgesProps) {
  const years = [
    { value: CareerYear.First, label: CareerYearLabels[CareerYear.First] },
    { value: CareerYear.Second, label: CareerYearLabels[CareerYear.Second] },
    { value: CareerYear.Third, label: CareerYearLabels[CareerYear.Third] },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">
        Filtrar por año:
      </span>
      <div className="flex gap-1">
        {years.map((year) => (
          <Badge
            key={year.value}
            variant={selectedYear === year.value ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/10 transition-colors px-3 py-1"
            onClick={() => onYearChange(year.value)}
          >
            {year.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
