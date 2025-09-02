import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { technicalCareerService } from "../services/technical-career-service";
import type { TechnicalCareer } from "../types/technical-career";
import { navigate } from "wouter/use-browser-location";

export function useCareerOperations() {
  const queryClient = useQueryClient();

  // Query para obtener carreras técnicas
  const { data: careers = [], isLoading: isLoadingCareers } = useQuery({
    queryKey: ["technical-careers"],
    queryFn: () => technicalCareerService.getAll(),
  });

  // Mutation para eliminar carreras
  const deleteCareer = useMutation({
    mutationFn: async (id: string) => technicalCareerService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["technical-careers"] });
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
    deleteCareer,
    
    // Handlers
    handleEditCareer,
    handleViewCareer,
    handleDeleteCareer,
  };
}


