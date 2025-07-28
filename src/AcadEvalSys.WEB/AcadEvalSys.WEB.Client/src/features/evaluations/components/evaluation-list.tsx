import { DataSection } from "@/shared/components/ui/data-section";
import { Evaluation } from "../types/types";
import { evaluationColumns } from "../columns";

interface EvaluationListProps {
  evaluations: Evaluation[];
  isLoading: boolean;
  onEvaluationClick?: (evaluation: Evaluation) => void;
  className?: string;
}

export const EvaluationList = ({
  evaluations,
  isLoading,
  onEvaluationClick,
  className,
}: EvaluationListProps) => {
  return (
    <DataSection
      title="Lista de Evaluaciones"
      description="Gestiona las evaluaciones por competencias"
      data={evaluations}
      columns={evaluationColumns}
      isLoading={isLoading}
      emptyMessage="No se encontraron evaluaciones"
      emptyIcon="FileBarChart"
      onRowClick={
        onEvaluationClick
          ? (id) => {
              const evaluation = evaluations.find((e) => e.id === id);
              if (evaluation) onEvaluationClick(evaluation);
            }
          : undefined
      }
      className={className}
    />
  );
};
