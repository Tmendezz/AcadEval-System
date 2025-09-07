import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UnenrollStudentsResult as UnenrollStudentsApiResult } from "@infrastructure/api/clients/subject-service";
import * as subjectService from "@infrastructure/api/clients/subject-service";
import { toast } from "sonner";

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

  return useMutation<boolean, Error, UnenrollStudentParams>({
    mutationFn: async ({ careerId, subjectId, studentId }) => {
      return await subjectService.unenrollStudent(
        careerId,
        subjectId,
        studentId
      );
    },
    onSuccess: (_, variables) => {
      toast.success("✅ Estudiante desinscrito exitosamente");

      // Invalidar cache
      queryClient.invalidateQueries({
        queryKey: ["subject", variables.subjectId, variables.careerId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "available-students",
          variables.careerId,
          variables.subjectId,
        ],
      });
    },
    onError: (error) => {
      console.error("❌ Error unenrolling student:", error);
      toast.error("❌ Error al desinscribir estudiante: " + error.message);
    },
  });
};

export const useUnenrollStudents = () => {
  const queryClient = useQueryClient();

  return useMutation<UnenrollStudentsApiResult, Error, UnenrollStudentsParams>({
    mutationFn: async ({ careerId, subjectId, studentIds }) => {
      return await subjectService.unenrollStudents(
        careerId,
        subjectId,
        studentIds
      );
    },
    onSuccess: (data, variables) => {
      const { studentsUnenrolled, errors } = data;

      if (errors.length === 0) {
        toast.success(
          `✅ ${studentsUnenrolled} estudiante desinscrito exitosamente`
        );
      } else {
        toast.warning(
          `⚠️ ${studentsUnenrolled} estudiantes desinscritos, ${errors.length} errores`
        );
      }

      // Invalidar cache
      queryClient.invalidateQueries({
        queryKey: ["subject", variables.subjectId, variables.careerId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "available-students",
          variables.careerId,
          variables.subjectId,
        ],
      });
    },
    onError: (error) => {
      console.error("❌ Error bulk unenrolling students:", error);
      toast.error("❌ Error al desinscribir estudiantes: " + error.message);
    },
  });
};
