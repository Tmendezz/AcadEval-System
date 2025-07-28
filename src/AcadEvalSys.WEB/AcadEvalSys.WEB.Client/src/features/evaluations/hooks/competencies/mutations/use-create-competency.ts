import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCompetency } from "@/shared/services/competency-service";
import { CompetencyFormData } from "../../../schemas/competency";
import { competenciesKeys } from "../queries/use-get-competencies";

export const useCreateCompetency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompetencyFormData) => createCompetency(data),
    onSuccess: () => {
      // Invalida la lista de competencias para que se recargue automáticamente
      return queryClient.invalidateQueries({
        queryKey: competenciesKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("Error al crear competencia:", error);
    },
  });
};
