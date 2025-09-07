import { useQuery } from "@tanstack/react-query";
import { getStudentReceivedEvaluations, StudentReceivedEvaluation } from "@infrastructure/api/clients/student-evaluation-service";

export const studentReceivedEvaluationsKeys = {
  all: ["student-received-evaluations"] as const,
  byStudent: (studentId: string) =>
    [...studentReceivedEvaluationsKeys.all, "student", studentId] as const,
};

export const useStudentReceivedEvaluations = (enabled = true) => {
  return useQuery({
    queryKey: studentReceivedEvaluationsKeys.all,
    queryFn: getStudentReceivedEvaluations,
    enabled,
  });
};
