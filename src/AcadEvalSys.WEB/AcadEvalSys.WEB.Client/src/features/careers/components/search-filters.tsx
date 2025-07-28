import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search } from "lucide-react";
import { CareerYear, CareerYearLabels } from "@/shared/types/enums";
import { TechnicalCareer } from "../types/technical-career";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedYear: CareerYear | "all";
  onYearChange: (value: string) => void;
  selectedCareer: string;
  onCareerChange: (value: string) => void;
  careers: TechnicalCareer[];
  className?: string;
}

export const SearchFilters = ({
  searchTerm,
  onSearchChange,
  selectedYear,
  onYearChange,
  selectedCareer,
  onCareerChange,
  careers,
  className = "flex flex-col sm:flex-row gap-4 mb-6",
}: SearchFiltersProps) => {
  return (
    <div className={className}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedYear.toString()} onValueChange={onYearChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All years</SelectItem>
          <SelectItem value={CareerYear.First.toString()}>
            {CareerYearLabels[CareerYear.First]}
          </SelectItem>
          <SelectItem value={CareerYear.Second.toString()}>
            {CareerYearLabels[CareerYear.Second]}
          </SelectItem>
          <SelectItem value={CareerYear.Third.toString()}>
            {CareerYearLabels[CareerYear.Third]}
          </SelectItem>
        </SelectContent>
      </Select>
      <Select value={selectedCareer} onValueChange={onCareerChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by career" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All careers</SelectItem>
          {careers.map((career) => (
            <SelectItem key={career.id} value={career.id}>
              {career.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
