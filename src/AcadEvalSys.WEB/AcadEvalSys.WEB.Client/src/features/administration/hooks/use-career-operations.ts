import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { technicalCareerService } from "../services/technical-career-service";
import type {
  TechnicalCareer,
  UpdateTechnicalCareerRequest,
} from "@infrastructure/api/types/technical-career";
import { navigate } from "wouter/use-browser-location";
import {
  createQueryKeys,
  useOptimisticMutation,
  useStaleQuery,
} from "@/shared/lib/query-utils";

// ============================================
// QUERY KEYS
// ============================================

export const careerKeys = createQueryKeys("technical-careers");

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useCareerOperations() {
  const queryClient = useQueryClient();

  // Query para obtener carreras técnicas
  const { data, isLoading: isLoadingCareers } = useStaleQuery(
    careerKeys.lists(),
    () => technicalCareerService.getAll(),
    { staleMinutes: 5 }
  );

  const careers = useMemo(() => data || [], [data]);

  // Mutations
  const updateCareer = useOptimisticMutation<
    void,
    { id: string; career: UpdateTechnicalCareerRequest }
  >({
    mutationFn: ({ id, career }) => technicalCareerService.update(id, career),
    messages: {
      success: "Carrera actualizada exitosamente",
      error: "Error al actualizar la carrera",
    },
    invalidateKeys: [careerKeys.lists()],
    onSuccessCallback: async (_, { id }) => {
      await queryClient.invalidateQueries({
        queryKey: careerKeys.detail(id),
      });
    },
  });

  const deleteCareer = useOptimisticMutation<void, string>({
    mutationFn: (id) => technicalCareerService.delete(id),
    messages: {
      success: "Carrera eliminada exitosamente",
      error: "Error al eliminar la carrera",
    },
    invalidateKeys: [careerKeys.lists()],
  });

  // Handlers con useCallback
  const handleEditCareer = useCallback((career: TechnicalCareer) => {
    navigate(`/carreras/${career.id}/editar`);
  }, []);

  const handleViewCareer = useCallback((career: TechnicalCareer) => {
    navigate(`/carreras/${career.id}`);
  }, []);

  const handleDeleteCareer = useCallback(
    (career: TechnicalCareer) => {
      deleteCareer.mutate(career.id);
    },
    [deleteCareer]
  );

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
