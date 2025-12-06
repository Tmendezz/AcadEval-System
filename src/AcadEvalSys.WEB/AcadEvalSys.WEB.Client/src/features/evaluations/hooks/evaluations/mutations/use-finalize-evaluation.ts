import { useQueryClient } from "@tanstack/react-query";
import { finalizeEvaluation } from "@/features/evaluations/services/evaluation-service";
import { useOptimisticMutation } from "@/shared/lib/query-utils";
import { evaluationsKeys } from "../queries/use-get-evaluations";

interface FinalizeEvaluationParams {
  evaluationId: string;
  forceClose?: boolean;
}

export function useFinalizeEvaluation() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<void, FinalizeEvaluationParams>({
    mutationFn: ({ evaluationId, forceClose = false }) =>
      finalizeEvaluation(evaluationId, forceClose),
    messages: {
      success: "Evaluación finalizada exitosamente. Los reportes se están generando en segundo plano.",
      error: "Error al finalizar la evaluación. Por favor, intenta nuevamente.",
    },
    invalidateKeys: [evaluationsKeys.lists()],
    onSuccessCallback: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: evaluationsKeys.detail(variables.evaluationId),
      });
    },
  });
}
