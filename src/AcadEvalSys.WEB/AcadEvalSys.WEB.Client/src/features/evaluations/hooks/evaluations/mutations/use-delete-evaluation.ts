import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteEvaluation } from "@/features/evaluations/services/evaluation-service";
import { evaluationsKeys } from "../queries/use-get-evaluations";

export const useDeleteEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteEvaluation(id);
    },
    onSuccess: () => {
      // Invalidar las queries relacionadas
      queryClient.invalidateQueries({ queryKey: evaluationsKeys.lists() });
      toast.success("Evaluación eliminada correctamente");
    },
    onError: (error) => {
      console.error("Error al eliminar evaluación:", error);
      toast.error("Error al eliminar la evaluación");
    },
  });
};
