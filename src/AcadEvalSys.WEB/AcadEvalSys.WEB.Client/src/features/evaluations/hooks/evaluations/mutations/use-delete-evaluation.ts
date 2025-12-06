import { deleteEvaluation } from "@/features/evaluations/services/evaluation-service";
import { evaluationsKeys } from "../queries/use-get-evaluations";
import { useOptimisticMutation } from "@/shared/lib/query-utils";

export const useDeleteEvaluation = () => {
  return useOptimisticMutation<void, string>({
    mutationFn: (id) => deleteEvaluation(id),
    messages: {
      success: "Evaluación eliminada correctamente",
      error: "Error al eliminar la evaluación",
    },
    invalidateKeys: [evaluationsKeys.lists()],
  });
};
