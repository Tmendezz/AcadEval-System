import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSubject } from "@infrastructure/api/clients/subject-service";
import { toast } from "sonner";
import { subjectsKeys } from "./use-subjects-by-year";

interface DeleteSubjectParams {
  careerId: string;
  subjectId: string;
}

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ careerId, subjectId }: DeleteSubjectParams) =>
      deleteSubject(careerId, subjectId),
    onSuccess: (_, variables) => {
      toast.success("Asignatura eliminada exitosamente");
      queryClient.invalidateQueries({
        queryKey: subjectsKeys.lists(variables.careerId),
      });
    },
    onError: (error) => {
      console.error("Error al eliminar la asignatura:", error);
      toast.error("Error al eliminar la asignatura. Intente nuevamente.");
    },
  });
};
