import { useQuery } from "@tanstack/react-query";
import { getEvaluationById } from "@infrastructure/api/clients/evaluation-service";

export const useGetEvaluationById = (evaluationId: string) => {
  return useQuery({
    queryKey: ["evaluation", evaluationId],
    queryFn: () => getEvaluationById(evaluationId),
    enabled: !!evaluationId,
  });
};
