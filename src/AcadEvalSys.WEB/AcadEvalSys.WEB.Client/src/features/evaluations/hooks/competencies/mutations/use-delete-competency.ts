import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCompetency } from "@/shared/services/competency-service";
import { competenciesKeys } from "../queries/use-get-competencies";

export const useDeleteCompetency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCompetency(id),
    onSuccess: () => {
      // Invalida la lista de competencias para que se recargue automáticamente
      return queryClient.invalidateQueries({
        queryKey: competenciesKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("Error al eliminar competencia:", error);
    },
  });
};
