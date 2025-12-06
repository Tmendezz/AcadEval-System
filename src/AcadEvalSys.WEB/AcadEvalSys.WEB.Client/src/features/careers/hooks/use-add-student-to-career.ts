import { useQueryClient } from "@tanstack/react-query";
import { technicalCareerService } from "../services/technical-career-service";
import { CreateStudentRequest } from "@/features/careers/models/student";
import { toast } from "sonner";
import { useOptimisticMutation } from "@/shared/lib/query-utils";

interface AddStudentToCareerParams {
  careerId: string;
  student: CreateStudentRequest;
}

export const useAddStudentToCareer = () => {
  const queryClient = useQueryClient();

  return useOptimisticMutation<string, AddStudentToCareerParams>({
    mutationFn: ({ careerId, student }) =>
      technicalCareerService.addStudentToCareer(careerId, student),
    messages: {
      // Mensaje personalizado en callback
      success: "",
      error: "Error al crear estudiante",
    },
    onSuccessCallback: (_, variables) => {
      toast.success(`Estudiante "${variables.student.name}" creado exitosamente`);

      queryClient.invalidateQueries({
        queryKey: ["technical-career", variables.careerId],
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["available-students"] });
    },
  });
};
