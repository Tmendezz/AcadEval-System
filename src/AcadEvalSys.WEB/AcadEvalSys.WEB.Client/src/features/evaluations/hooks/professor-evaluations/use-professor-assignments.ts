import { useQuery } from "@tanstack/react-query";
import { getProfessorAssignments } from "../../services/professor-evaluation-service";
import { ProfessorEvaluationFilters } from "../../types/professor-evaluation";

export const professorAssignmentsKeys = {
  all: ["professor-assignments"] as const,
  byEvaluation: (evaluationId: string, filters?: ProfessorEvaluationFilters) =>
    [
      ...professorAssignmentsKeys.all,
      "evaluation",
      evaluationId,
      filters,
    ] as const,
};

export const useGetProfessorAssignments = (
  evaluationId: string,
  filters?: ProfessorEvaluationFilters,
  enabled = true
) => {
  return useQuery({
    queryKey: professorAssignmentsKeys.byEvaluation(evaluationId, filters),
    queryFn: () => getProfessorAssignments(evaluationId, filters),
    enabled: enabled && !!evaluationId,
  });
};
