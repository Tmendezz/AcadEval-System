import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImportStudentsResult } from "../types";
import * as technicalCareerService from "@infrastructure/api/clients/technical-career-service";

interface ImportStudentsToCareerParams {
  careerId: string;
  file: File;
}

export const useImportStudentsToCareer = () => {
  const queryClient = useQueryClient();

  return useMutation<ImportStudentsResult, Error, ImportStudentsToCareerParams>(
    {
      mutationFn: async ({ careerId, file }) => {
        return await technicalCareerService.importStudents(careerId, file);
      },
      onSuccess: (data, variables) => {
        const { usersCreated, studentsEnrolled, errors } = data;

        if (errors.length === 0) {
          toast.success(
            `✅ Importación exitosa: ${usersCreated} usuarios creados, ${studentsEnrolled} estudiantes inscritos`
          );
        } else {
          toast.warning(
            `⚠️ Importación parcial: ${studentsEnrolled} estudiantes inscritos, ${errors.length} errores`
          );
        }

        queryClient.invalidateQueries({
          queryKey: ["technical-career", variables.careerId],
        });
        queryClient.invalidateQueries({
          queryKey: ["students"],
        });
      },
      onError: (error) => {
        console.error("❌ Error importing students to career:", error);
        toast.error("❌ Error al importar estudiantes: " + error.message);
      },
    }
  );
};
