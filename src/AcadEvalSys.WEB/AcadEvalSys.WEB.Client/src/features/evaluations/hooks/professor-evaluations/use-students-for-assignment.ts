import { useQuery } from "@tanstack/react-query";
import { getStudentsForAssignment } from "../../services/professor-evaluation-service";

export const studentsForAssignmentKeys = {
  all: ["students-for-assignment"] as const,
  byAssignment: (assignmentId: string) =>
    [...studentsForAssignmentKeys.all, "assignment", assignmentId] as const,
};

export const useGetStudentsForAssignment = (
  assignmentId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: studentsForAssignmentKeys.byAssignment(assignmentId),
    queryFn: () => getStudentsForAssignment(assignmentId),
    enabled: enabled && !!assignmentId,
  });
};
