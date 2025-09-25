import { useQuery } from "@tanstack/react-query";
import { studentEvaluationsApi } from "../services/student-evaluations-service";
import type { StudentReceivedEvaluation } from "../models";

export function useReceivedEvaluations() {
  return useQuery<StudentReceivedEvaluation[], Error>({
    queryKey: ["student", "received-evaluations"],
    queryFn: () => studentEvaluationsApi.getReceivedEvaluations(),
    staleTime: 1000 * 60, // 1 min
  });
}
