import { createEvaluation } from "@/features/evaluations/services/evaluation-service";
import { EvaluationFormData } from "../models/evaluation-form";
import { evaluationsKeys } from "./use-get-evaluations";
import { navigate } from "wouter/use-browser-location";
import { useOptimisticMutation } from "@/shared/lib/query-utils";

export const useCreateEvaluation = () => {
  return useOptimisticMutation<string, EvaluationFormData>({
    mutationFn: createEvaluation,
    messages: {
      success: "Evaluación creada exitosamente",
      error: "Error al crear la evaluación. Intente nuevamente.",
    },
    invalidateKeys: [evaluationsKeys.lists()],
    onSuccessCallback: () => {
      navigate("/evaluaciones");
    },
  });
};
