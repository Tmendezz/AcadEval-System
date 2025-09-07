import { useQuery } from "@tanstack/react-query";
import { getStudentsForAssignment } from "../services";
import { StudentForEvaluation } from "../models";

export const studentsForAssignmentKeys = {
  all: ["students-for-assignment"] as const,
  byAssignment: (assignmentId: string) =>
    [...studentsForAssignmentKeys.all, "assignment", assignmentId] as const,
};

export const useGetStudentsForAssignment = (
  assignmentId: string,
  enabled = true
) => {
  return useQuery<StudentForEvaluation[], Error>({
    queryKey: studentsForAssignmentKeys.byAssignment(assignmentId),
    queryFn: () => getStudentsForAssignment(assignmentId),
    enabled: enabled && !!assignmentId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
