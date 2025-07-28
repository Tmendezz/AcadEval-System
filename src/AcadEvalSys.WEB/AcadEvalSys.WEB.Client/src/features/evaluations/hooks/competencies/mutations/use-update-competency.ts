import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCompetency } from "@/shared/services/competency-service";
import { CompetencyFormData } from "../../../schemas/competency";
import { competenciesKeys } from "../queries/use-get-competencies";

interface UpdateCompetencyParams {
  id: string;
  data: CompetencyFormData;
}

export const useUpdateCompetency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateCompetencyParams) =>
      updateCompetency(id, data),
    onSuccess: (_, { id }) => {
      // Invalida tanto la lista como el detalle de la competencia actualizada
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: competenciesKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: competenciesKeys.all,
        }),
      ]);
    },
    onError: (error) => {
      console.error("Error al actualizar competencia:", error);
    },
  });
};
