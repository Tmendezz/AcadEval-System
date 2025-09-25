import { useQuery } from "@tanstack/react-query";
import { getAssignmentStudents } from "@/features/professor-evaluations/services/professor-evaluations-service";

export function useAssignmentStudents(assignmentId: string) {
  return useQuery({
    queryKey: ["assignment-students", assignmentId],
    queryFn: () => getAssignmentStudents(assignmentId),
    enabled: Boolean(assignmentId),
  });
}


