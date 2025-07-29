import { DataSection } from "@/shared/components/ui/data-section";
import { Competency } from "@/shared/types";
import { competencyColumns } from "../../columns";

interface CompetenciesDataSectionProps {
  competencies: Competency[];
  isLoading: boolean;
  onRowClick?: (competency: Competency) => void;
}

export function CompetenciesDataSection({
  competencies,
  isLoading,
  onRowClick,
}: CompetenciesDataSectionProps) {
  return (
    <DataSection
      title="Lista de Competencias"
      description="Gestiona las competencias disponibles para evaluaciones"
      data={competencies}
      columns={competencyColumns}
      isLoading={isLoading}
      emptyMessage="No se encontraron competencias"
      emptyIcon="Target"
      onRowClick={
        onRowClick
          ? (id) => {
              const competency = competencies.find((c) => c.id === id);
              if (competency) onRowClick(competency);
            }
          : undefined
      }
    />
  );
}
