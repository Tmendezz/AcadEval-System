import { useQuery } from "@tanstack/react-query";
import { getEvaluationById } from "@/features/evaluations/services/evaluation-service";

export const useGetEvaluationById = (evaluationId: string) => {
  return useQuery({
    queryKey: ["evaluation", evaluationId],
    queryFn: () => getEvaluationById(evaluationId),
    enabled: !!evaluationId,
  });
};
