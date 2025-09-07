import { useQuery } from "@tanstack/react-query";
import {
  getStudentReceivedEvaluations,
  StudentReceivedEvaluation,
} from "@infrastructure/api/clients/student-evaluation-service";

export function useEvaluations(evaluationInstanceId?: string) {
  return useQuery<StudentReceivedEvaluation[], Error>({
    queryKey: ["student-evaluations", evaluationInstanceId],
    queryFn: () => getStudentReceivedEvaluations(),
    enabled: !!evaluationInstanceId,
  });
}
