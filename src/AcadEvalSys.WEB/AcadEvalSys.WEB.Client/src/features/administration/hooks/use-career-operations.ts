import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { technicalCareerService } from "../services/technical-career-service";
import type {
  TechnicalCareer,
  UpdateTechnicalCareerRequest,
} from "../types/technical-career";
import { navigate } from "wouter/use-browser-location";
import { toast } from "sonner";

export function useCareerOperations() {
  const queryClient = useQueryClient();

  // Query para obtener carreras técnicas
  const { data: careers = [], isLoading: isLoadingCareers } = useQuery({
    queryKey: ["technical-careers"],
    queryFn: () => technicalCareerService.getAll(),
  });

  // Mutation para actualizar carreras
  const updateCareer = useMutation({
    mutationFn: async ({
      id,
      career,
    }: {
      id: string;
      career: UpdateTechnicalCareerRequest;
    }) => technicalCareerService.update(id, career),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: ["technical-careers"] });
      await queryClient.invalidateQueries({
        queryKey: ["technical-career", id],
      });
      toast.success("Carrera actualizada exitosamente");
    },
    onError: (error) => {
      console.error("Error al actualizar carrera:", error);
      toast.error("Error al actualizar la carrera");
    },
  });

  // Mutation para eliminar carreras
  const deleteCareer = useMutation({
    mutationFn: async (id: string) => technicalCareerService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["technical-careers"] });
      toast.success("Carrera eliminada exitosamente");
    },
    onError: (error) => {
      console.error("Error al eliminar carrera:", error);
      toast.error("Error al eliminar la carrera");
    },
  });

  // Handlers para operaciones de carreras
  const handleEditCareer = (career: TechnicalCareer) => {
    navigate(`/tecnicaturas/${career.id}/editar`);
  };

  const handleViewCareer = (career: TechnicalCareer) => {
    navigate(`/tecnicaturas/${career.id}/asignaturas`);
  };

  const handleDeleteCareer = (career: TechnicalCareer) => {
    deleteCareer.mutate(career.id);
  };

  return {
    // State
    careers,
    isLoadingCareers,

    // Mutations
    updateCareer,
    deleteCareer,

    // Handlers
    handleEditCareer,
    handleViewCareer,
    handleDeleteCareer,
  };
}
