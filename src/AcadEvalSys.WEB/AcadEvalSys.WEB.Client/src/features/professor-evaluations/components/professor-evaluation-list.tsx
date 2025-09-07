import { DataSection } from "@/shared/components/ui/data-section";
import { professorEvaluationColumns } from "./professor-evaluation-columns";
import { ProfessorAssignment } from "../models";
import { Users } from "lucide-react";

interface ProfessorEvaluationListProps {
  evaluations: ProfessorAssignment[];
  isLoading: boolean;
}

export function ProfessorEvaluationList({
  evaluations,
  isLoading,
}: ProfessorEvaluationListProps) {
  return (
    <DataSection
      title="Mis Evaluaciones"
      description="Gestiona todas tus evaluaciones de competencias asignadas"
      data={evaluations}
      columns={professorEvaluationColumns}
      isLoading={isLoading}
      emptyMessage="No tienes evaluaciones asignadas"
      emptyIcon={<Users className="w-8 h-8" />}
    />
  );
}
