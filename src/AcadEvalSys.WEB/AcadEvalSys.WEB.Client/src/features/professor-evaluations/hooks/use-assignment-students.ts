import { useQuery } from "@tanstack/react-query";
import { getStudentsForAssignment } from "../services";
import { StudentForEvaluation } from "../models";

export const useAssignmentStudents = (assignmentId: string) => {
  return useQuery<StudentForEvaluation[], Error>({
    queryKey: ["assignment-students", assignmentId],
    queryFn: () => getStudentsForAssignment(assignmentId),
    enabled: !!assignmentId,
  });
};
