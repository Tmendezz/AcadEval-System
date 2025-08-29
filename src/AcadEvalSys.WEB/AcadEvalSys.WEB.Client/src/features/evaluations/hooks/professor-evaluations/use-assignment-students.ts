import { useQuery } from "@tanstack/react-query";
import { getStudentsByAssignment } from "@/shared/services/professor-service";

export const assignmentStudentsKeys = {
  all: ["assignment-students"] as const,
  byAssignment: (assignmentId: string) =>
    [...assignmentStudentsKeys.all, "assignment", assignmentId] as const,
};

export const useGetAssignmentStudents = (
  assignmentId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: assignmentStudentsKeys.byAssignment(assignmentId),
    queryFn: () => getStudentsByAssignment(assignmentId),
    enabled: enabled && !!assignmentId,
  });
};
