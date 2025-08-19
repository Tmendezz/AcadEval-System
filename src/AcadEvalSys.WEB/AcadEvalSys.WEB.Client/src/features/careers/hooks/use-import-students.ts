import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImportStudentsResult } from "@/features/careers/types/import";
import * as technicalCareerService from "@/shared/services/technical-career-service";
import { toast } from "sonner";

interface ImportStudentsParams {
  careerId: string;
  subjectId: string;
  file: File;
}

export const useImportStudents = () => {
  const queryClient = useQueryClient();

  return useMutation<ImportStudentsResult, Error, ImportStudentsParams>({
    mutationFn: async ({ careerId, subjectId, file }) => {
      return await technicalCareerService.importStudents(careerId, file);
    },
    onSuccess: (data, variables) => {
      // Mostrar resultados
      const {
        usersCreated,
        studentsEnrolled,
        studentsAlreadyEnrolled,
        errors,
      } = data;

      if (errors.length === 0) {
        toast.success(
          `✅ Importación exitosa: ${usersCreated} usuarios creados, ${studentsEnrolled} estudiantes inscritos`
        );
      } else {
        toast.warning(
          `⚠️ Importación parcial: ${studentsEnrolled} estudiantes inscritos, ${errors.length} errores`
        );
      }

      // Invalidar cache para refrescar la lista de estudiantes
      queryClient.invalidateQueries({
        queryKey: ["subject", variables.subjectId, variables.careerId],
      });
    },
    onError: (error) => {
      console.error("❌ Error importing students:", error);
      toast.error("❌ Error al importar estudiantes: " + error.message);
    },
  });
};
