import { useQuery } from "@tanstack/react-query";
import { getProfessorAssignments } from "@/features/professor-evaluations/services/professor-evaluations-service";

export function useProfessorAssignments(evaluationInstanceId?: string) {
  return useQuery({
    queryKey: ["professor-assignments", evaluationInstanceId ?? null],
    queryFn: () => getProfessorAssignments({ evaluationInstanceId }),
  });
}


