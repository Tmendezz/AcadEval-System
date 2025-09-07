import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search, Plus, X } from "lucide-react";

interface CompetencyFiltersProps {
  searchTerm: string;
  selectedType: "all" | "Soft" | "Technical";
  onSearchChange: (term: string) => void;
  onTypeChange: (type: "all" | "Soft" | "Technical") => void;
  onClearFilters: () => void;
  onCreateNew: () => void;
}

export function CompetencyFilters({
  searchTerm,
  selectedType,
  onSearchChange,
  onTypeChange,
  onClearFilters,
  onCreateNew,
}: CompetencyFiltersProps) {
  const hasActiveFilters = searchTerm !== "" || selectedType !== "all";

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
      {/* Búsqueda */}
      <div className="relative w-full md:w-auto flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar competencia..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filtro por tipo */}
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Todos los tipos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
          <SelectItem value="Soft">Competencias Blandas</SelectItem>
          <SelectItem value="Technical">Competencias Técnicas</SelectItem>
        </SelectContent>
      </Select>

      {/* Botón limpiar filtros */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Limpiar
        </Button>
      )}

      {/* Botón nueva competencia */}
      <Button onClick={onCreateNew} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Nueva Competencia
      </Button>
    </div>
  );
}
