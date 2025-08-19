import { useMutation, useQueryClient } from "@tanstack/react-query";
import { finalizeEvaluation } from "../../../services/evaluation-service";
import { toast } from "sonner";

interface FinalizeEvaluationParams {
  evaluationId: string;
  forceClose?: boolean;
}

export function useFinalizeEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ evaluationId, forceClose = false }: FinalizeEvaluationParams) =>
      finalizeEvaluation(evaluationId, forceClose),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Evaluación finalizada exitosamente");
        // Invalidar las queries relacionadas para refrescar los datos
        queryClient.invalidateQueries({ queryKey: ["evaluation", variables.evaluationId] });
        queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      } else {
        toast.error(data.message || "Error al finalizar la evaluación");
      }
    },
    onError: (error: any) => {
      console.error("Error finalizing evaluation:", error);
      toast.error(
        error.response?.data?.message || 
        "Error al finalizar la evaluación. Por favor, intenta nuevamente."
      );
    },
  });
}