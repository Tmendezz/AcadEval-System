import { useQuery } from "@tanstack/react-query";
import { getProfessorAssignments } from "@/features/professor-evaluations/services/professor-evaluations-service";

// Query keys centralizados
export const professorAssignmentsKeys = {
  all: ["professor-assignments"] as const,
  list: (evaluationInstanceId?: string) =>
    [...professorAssignmentsKeys.all, evaluationInstanceId ?? null] as const,
};

export function useProfessorAssignments(evaluationInstanceId?: string) {
  return useQuery({
    queryKey: professorAssignmentsKeys.list(evaluationInstanceId),
    queryFn: () => getProfessorAssignments({ evaluationInstanceId }),
    staleTime: 0, // Siempre considerar los datos como stale para forzar refetch cuando se invalida
    gcTime: 5 * 60 * 1000, // Mantener en caché por 5 minutos pero siempre refetch si está stale
  });
}

