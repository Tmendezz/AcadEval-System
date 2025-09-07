import { Link } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { DataSection } from "@/shared/components/ui/data-section";
import { evaluationColumns } from "./evaluation-columns";
import { EvaluationListItem } from "@infrastructure/api/clients/evaluation-service";
import { Plus } from "lucide-react";

interface EvaluationListProps {
  evaluations: EvaluationListItem[];
  isLoading: boolean;
}

export function EvaluationList({ evaluations, isLoading }: EvaluationListProps) {
  return (
    <DataSection
      title="Lista de Evaluaciones"
      description="Evaluaciones por competencias disponibles en el sistema."
      data={evaluations}
      columns={evaluationColumns}
      isLoading={isLoading}
      emptyMessage="No se encontraron evaluaciones."
      extraHeaderContent={
        <Link href="/evaluaciones/nueva">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Evaluación
          </Button>
        </Link>
      }
    />
  );
}