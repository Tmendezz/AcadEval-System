import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useTechnicalCareers } from "@/shared/hooks/use-technical-careers";

interface EvaluationFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  careerFilter: string;
  onCareerFilterChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  className?: string;
}

export const EvaluationFilters = ({
  statusFilter,
  onStatusFilterChange,
  careerFilter,
  onCareerFilterChange,
  sortBy,
  onSortByChange,
  className,
}: EvaluationFiltersProps) => {
  const { data: careers = [], isLoading: isLoadingCareers } =
    useTechnicalCareers();

  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center ${className}`}
    >
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
          {isLoadingCareers ? (
            <SelectItem value="loading" disabled>
              Cargando carreras...
            </SelectItem>
          ) : (
            careers.map((career) => (
              <SelectItem key={career.id} value={career.id}>
                {career.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sin ordenar</SelectItem>
          <SelectItem value="createdAtDesc">Más recientes primero</SelectItem>
          <SelectItem value="createdAt">Más antiguas primero</SelectItem>
          <SelectItem value="title">Por título</SelectItem>
          <SelectItem value="periodFrom">Por fecha de inicio</SelectItem>
          <SelectItem value="periodTo">Por fecha de fin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
