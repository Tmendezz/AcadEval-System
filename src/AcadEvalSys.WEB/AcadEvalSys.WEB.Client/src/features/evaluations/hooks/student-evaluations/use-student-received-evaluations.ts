import { useQuery } from "@tanstack/react-query";
import { studentEvaluationsApi } from "@/features/student-evaluations/services/student-evaluations-service";
import type { StudentReceivedEvaluation } from "@/features/student-evaluations/models";

export const studentReceivedEvaluationsKeys = {
  all: ["student-received-evaluations"] as const,
  byStudent: (studentId: string) =>
    [...studentReceivedEvaluationsKeys.all, "student", studentId] as const,
};

export const useStudentReceivedEvaluations = (enabled = true) => {
  return useQuery<StudentReceivedEvaluation[], Error>({
    queryKey: studentReceivedEvaluationsKeys.all,
    queryFn: () => studentEvaluationsApi.getReceivedEvaluations(),
    enabled,
  });
};
