import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCompetencyLevels } from "../services";
import { toast } from "sonner";

export const useUpdateCompetencyLevels = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      competencyId,
      levels,
    }: {
      competencyId: string;
      levels: { level: string; description: string }[];
    }) => updateCompetencyLevels(competencyId, levels),
    onSuccess: (_, { competencyId }) => {
      queryClient.invalidateQueries({
        queryKey: ["competency-levels", competencyId],
      });
      queryClient.invalidateQueries({ queryKey: ["competencies"] });
      toast.success("Niveles de competencia actualizados correctamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar los niveles de competencia");
      console.error("Error updating competency levels:", error);
    },
  });
};
