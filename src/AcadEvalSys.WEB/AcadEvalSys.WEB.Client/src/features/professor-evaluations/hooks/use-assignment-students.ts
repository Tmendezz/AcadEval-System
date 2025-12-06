import { useQuery } from "@tanstack/react-query";
import { getAssignmentStudents } from "@/features/professor-evaluations/services/professor-evaluations-service";

// Query keys centralizados para assignment students
export const assignmentStudentsKeys = {
  all: ["assignment-students"] as const,
  byAssignment: (assignmentId: string) =>
    [...assignmentStudentsKeys.all, assignmentId] as const,
};

export function useAssignmentStudents(assignmentId: string) {
  return useQuery({
    queryKey: assignmentStudentsKeys.byAssignment(assignmentId),
    queryFn: () => getAssignmentStudents(assignmentId),
    enabled: Boolean(assignmentId),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}
