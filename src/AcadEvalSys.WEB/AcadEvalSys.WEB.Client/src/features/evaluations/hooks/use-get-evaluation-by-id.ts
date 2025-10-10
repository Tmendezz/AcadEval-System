import { useQuery } from "@tanstack/react-query";
import { getEvaluationById } from "@/features/evaluations/services/evaluation-service";
import type { Evaluation } from "@infrastructure/api/types/evaluation";

export const useGetEvaluationById = (evaluationId: string) => {
  // Solo hacer fetch si hay un ID válido y no es una ruta especial
  const isValidId = evaluationId && 
    evaluationId !== "nueva" && 
    evaluationId !== "dashboard";
    
  return useQuery<Evaluation>({
    queryKey: ["evaluation", evaluationId],
    queryFn: () => getEvaluationById(evaluationId),
    enabled: isValidId,
  });
};
