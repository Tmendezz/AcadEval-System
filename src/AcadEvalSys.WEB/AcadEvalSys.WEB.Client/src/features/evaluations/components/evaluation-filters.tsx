import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface EvaluationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  careerFilter: string;
  onCareerFilterChange: (value: string) => void;
  className?: string;
}

export const EvaluationFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  careerFilter,
  onCareerFilterChange,
  className,
}: EvaluationFiltersProps) => {
  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center ${className}`}
    >
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar evaluación..."
          className="pl-8"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="active">En progreso</SelectItem>
          <SelectItem value="completed">Completadas</SelectItem>
          <SelectItem value="upcoming">Próximas</SelectItem>
        </SelectContent>
      </Select>

      <Select value={careerFilter} onValueChange={onCareerFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filtrar por carrera" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las carreras</SelectItem>
          <SelectItem value="computer-science">
            Ingeniería en Computación
          </SelectItem>
          <SelectItem value="information-systems">
            Ingeniería en Sistemas
          </SelectItem>
          <SelectItem value="software-engineering">
            Ingeniería de Software
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
