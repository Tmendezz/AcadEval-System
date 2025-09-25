import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvaluation } from "@/features/evaluations/services/evaluation-service";
import { EvaluationFormData } from "../models/evaluation-form";
import { evaluationsKeys } from "./use-get-evaluations";
import { toast } from "sonner";
import { navigate } from "wouter/use-browser-location";

export const useCreateEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (evaluationData: EvaluationFormData) => createEvaluation(evaluationData),
    onSuccess: () => {
      toast.success("Evaluación creada exitosamente");
      queryClient.invalidateQueries({ queryKey: evaluationsKeys.lists() });
      navigate("/evaluaciones");
    },
    onError: (error) => {
      console.error("Error al crear la evaluación:", error);
      toast.error("Error al crear la evaluación. Intente nuevamente.");
    },
  });
};
