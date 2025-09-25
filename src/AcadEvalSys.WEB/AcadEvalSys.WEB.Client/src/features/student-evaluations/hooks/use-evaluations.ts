import { useQuery } from "@tanstack/react-query";
import { StudentReceivedEvaluation } from "../models";
import { studentEvaluationsApi } from "../services/student-evaluations-service";

export function useEvaluations(evaluationInstanceId?: string) {
  return useQuery<StudentReceivedEvaluation[], Error>({
    queryKey: ["student-evaluations", evaluationInstanceId],
    queryFn: () => studentEvaluationsApi.getReceivedEvaluations(),
    enabled: !!evaluationInstanceId,
  });
}
