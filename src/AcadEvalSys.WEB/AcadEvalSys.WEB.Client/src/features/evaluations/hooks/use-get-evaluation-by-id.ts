import { useQuery } from "@tanstack/react-query";
import { getEvaluationById } from "@/features/evaluations/services/evaluation-service";
import { Evaluation } from "@/features/evaluations/models";
import { evaluationsKeys } from "./use-get-evaluations";

// IDs especiales que no deben hacer fetch
const RESERVED_IDS = new Set(["nueva", "dashboard", "crear"]);

export const useGetEvaluationById = (evaluationId: string) => {
  const isValidId = Boolean(evaluationId && !RESERVED_IDS.has(evaluationId));
    
  return useQuery<Evaluation>({
    queryKey: evaluationsKeys.detail(evaluationId),
    queryFn: () => getEvaluationById(evaluationId),
    enabled: isValidId,
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
};
