import { useQuery } from "@tanstack/react-query";
import { getProfessorAssignmentById } from "@/features/professor-evaluations/services/professor-evaluations-service";

// Query keys centralizados para profesor assignments
export const professorAssignmentKeys = {
  all: ["professor-assignment"] as const,
  detail: (assignmentId: string) =>
    [...professorAssignmentKeys.all, assignmentId] as const,
};

export function useProfessorAssignment(assignmentId: string) {
  return useQuery({
    queryKey: professorAssignmentKeys.detail(assignmentId),
    queryFn: () => getProfessorAssignmentById(assignmentId),
    enabled: Boolean(assignmentId),
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
}
