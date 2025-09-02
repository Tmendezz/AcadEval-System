import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteSubject } from "@/shared/services/subject-service";

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      careerId,
      subjectId,
    }: {
      careerId: string;
      subjectId: string;
    }) => {
      await deleteSubject(careerId, subjectId);
    },
    onSuccess: (_, { careerId }) => {
      // Invalidar las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["subjects", careerId] });
      queryClient.invalidateQueries({ queryKey: ["technical-careers"] });
      queryClient.invalidateQueries({ queryKey: ["subject"] });
      toast.success("Asignatura eliminada correctamente");
    },
    onError: (error) => {
      console.error("Error al eliminar asignatura:", error);
      toast.error("Error al eliminar la asignatura");
    },
  });
};
