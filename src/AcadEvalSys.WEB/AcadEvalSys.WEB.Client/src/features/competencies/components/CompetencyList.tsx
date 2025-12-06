import { memo, useMemo } from "react";
import { DataSection } from "@/shared/components/ui/data-section";
import { createCompetencyColumns } from "./competency-columns";
import { Competency } from "@infrastructure/api/types/competency";

interface CompetencyListProps {
  competencies: Competency[];
  isLoading: boolean;
  onRowClick?: (competency: Competency) => void;
  onEditClick?: (competency: Competency) => void;
  onDeleteClick?: (competencyId: string) => void;
}

export const CompetencyList = memo(function CompetencyList({
  competencies,
  isLoading,
  onEditClick,
  onDeleteClick,
}: CompetencyListProps) {
  const columns = useMemo(
    () => createCompetencyColumns({ onEditClick, onDeleteClick }),
    [onEditClick, onDeleteClick]
  );

  return (
    <DataSection
      title="Lista de Competencias"
      description="Competencias generales y específicas evaluadas en el sistema."
      data={competencies}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No se encontraron competencias."
    />
  );
});
