import { useMutation, useQueryClient } from "@tanstack/react-query";
import { technicalCareerService } from "../services/technical-career-service";
import { CreateStudentRequest } from "../types";
import { toast } from "sonner";

interface AddStudentToCareerParams {
  careerId: string;
  student: CreateStudentRequest;
}

export const useAddStudentToCareer = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, AddStudentToCareerParams>({
    mutationFn: async ({ careerId, student }) => {
      return await technicalCareerService.addStudentToCareer(careerId, student);
    },
    onSuccess: (studentId, variables) => {
      toast.success(
        `✅ Estudiante "${variables.student.name}" creado exitosamente`
      );

      // Invalidar cache para refrescar datos
      queryClient.invalidateQueries({
        queryKey: ["technical-career", variables.careerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-students"],
      });
    },
    onError: (error) => {
      console.error("❌ Error adding student to career:", error);
      toast.error("❌ Error al crear estudiante: " + error.message);
    },
  });
};
