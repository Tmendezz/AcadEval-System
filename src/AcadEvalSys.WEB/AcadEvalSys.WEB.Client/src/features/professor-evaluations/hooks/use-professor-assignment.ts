import { useQuery } from "@tanstack/react-query";
import { getProfessorAssignmentById } from "@/features/professor-evaluations/services/professor-evaluations-service";

export function useProfessorAssignment(assignmentId: string) {
  return useQuery({
    queryKey: ["professor-assignment", assignmentId],
    queryFn: () => getProfessorAssignmentById(assignmentId),
    enabled: Boolean(assignmentId),
  });
}


