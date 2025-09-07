import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { CareerYear } from "@infrastructure/api/types/enums";

interface YearFilterTabsProps {
  selectedYear: CareerYear;
  onYearChange: (year: CareerYear) => void;
}

export function YearFilterTabs({
  selectedYear,
  onYearChange,
}: YearFilterTabsProps) {
  const years = [CareerYear.First, CareerYear.Second, CareerYear.Third];

  return (
    <Tabs value={selectedYear.toString()}>
      <TabsList>
        {years.map((year) => (
          <TabsTrigger
            key={year}
            value={year.toString()}
            onClick={() => onYearChange(year)}
          >
            {year}º Año
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
