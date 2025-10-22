import { useMutation, useQueryClient } from "@tanstack/react-query";
import { technicalCareerService } from "../services/technical-career-service";
import { CreateStudentRequest } from "@/features/careers/models/student";
import { toast } from "sonner";
import { getErrorMessage } from "@shared/utils/error-handler";

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
    onSuccess: (_, variables) => {
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
      const message = getErrorMessage(error as Error);
      toast.error("❌ Error al crear estudiante: " + message);
    },
  });
};
