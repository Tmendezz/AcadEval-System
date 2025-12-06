import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as subjectService from "../services/subject-service";
import type { UnenrollStudentsResult as UnenrollStudentsApiResult } from "../models";
import { useOptimisticMutation } from "@/shared/lib/query-utils";

interface UnenrollStudentParams {
  careerId: string;
  subjectId: string;
  studentId: string;
}

interface UnenrollStudentsParams {
  careerId: string;
  subjectId: string;
  studentIds: string[];
}

export const useUnenrollStudent = () => {
  const queryClient = useQueryClient();

  return useOptimisticMutation<boolean, UnenrollStudentParams>({
    mutationFn: ({ careerId, subjectId, studentId }) =>
      subjectService.unenrollStudent(careerId, subjectId, studentId),
    messages: {
      success: "Estudiante desinscrito exitosamente",
      error: "Error al desinscribir estudiante",
    },
    onSuccessCallback: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["subject", variables.subjectId, variables.careerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-students", variables.careerId, variables.subjectId],
      });
    },
  });
};

export const useUnenrollStudents = () => {
  const queryClient = useQueryClient();

  return useOptimisticMutation<UnenrollStudentsApiResult, UnenrollStudentsParams>({
    mutationFn: ({ careerId, subjectId, studentIds }) =>
      subjectService.unenrollStudents(careerId, subjectId, studentIds),
    messages: {
      // Se maneja en onSuccessCallback con lógica personalizada
      success: "",
      error: "Error al desinscribir estudiantes",
    },
    onSuccessCallback: (data, variables) => {
      const { studentsUnenrolled, errors } = data;

      // Mensaje personalizado basado en resultados
      if (errors.length === 0) {
        toast.success(`${studentsUnenrolled} estudiante(s) desinscrito(s) exitosamente`);
      } else {
        toast.warning(
          `${studentsUnenrolled} estudiantes desinscritos, ${errors.length} errores`
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["subject", variables.subjectId, variables.careerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-students", variables.careerId, variables.subjectId],
      });
    },
  });
};
