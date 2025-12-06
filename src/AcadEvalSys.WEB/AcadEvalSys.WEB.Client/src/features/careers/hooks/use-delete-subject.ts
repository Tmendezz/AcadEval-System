import { useQueryClient } from "@tanstack/react-query";
import { deleteSubject } from "../services/subject-service";
import { subjectsKeys } from "./use-subjects-by-year";
import { useOptimisticMutation } from "@/shared/lib/query-utils";

interface DeleteSubjectParams {
  careerId: string;
  subjectId: string;
}

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useOptimisticMutation<void, DeleteSubjectParams>({
    mutationFn: ({ careerId, subjectId }) => deleteSubject(careerId, subjectId),
    messages: {
      success: "Asignatura eliminada exitosamente",
      error: "Error al eliminar la asignatura. Intente nuevamente.",
    },
    // Invalidación dinámica basada en variables
    onSuccessCallback: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: subjectsKeys.lists(variables.careerId),
      });
    },
  });
};
