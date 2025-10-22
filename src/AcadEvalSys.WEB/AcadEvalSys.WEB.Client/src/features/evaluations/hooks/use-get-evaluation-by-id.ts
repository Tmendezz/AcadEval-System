import { useQuery } from "@tanstack/react-query";
import { getEvaluationById } from "@/features/evaluations/services/evaluation-service";
import { Evaluation } from "@/features/evaluations/models";

export const useGetEvaluationById = (evaluationId: string) => {
  // Solo hacer fetch si hay un ID válido y no es una ruta especial
  const isValidId = Boolean(
    evaluationId && 
    evaluationId !== "nueva" && 
    evaluationId !== "dashboard"
  );
    
  return useQuery<Evaluation>({
    queryKey: ["evaluation", evaluationId],
    queryFn: () => getEvaluationById(evaluationId),
    enabled: isValidId,
  });
};
