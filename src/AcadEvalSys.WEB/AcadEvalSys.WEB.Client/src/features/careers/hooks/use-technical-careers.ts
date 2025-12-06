import { technicalCareerService } from "../services/technical-career-service";
import { CreateTechnicalCareerRequest } from "../models/technical-career";
import {
  createQueryKeys,
  useOptimisticMutation,
  useStaleQuery,
  useEntityQuery,
} from "@/shared/lib/query-utils";

// Query keys generadas con la factory
export const technicalCareerKeys = createQueryKeys("technical-careers");

// Hooks de consulta
export const useGetTechnicalCareers = () => {
  return useStaleQuery(
    technicalCareerKeys.lists(),
    technicalCareerService.getAll,
    { staleMinutes: 5 }
  );
};

export const useGetTechnicalCareerById = (id: string) => {
  return useEntityQuery(
    technicalCareerKeys.detail(id),
    () => technicalCareerService.getById(id),
    id,
    { staleMinutes: 5 }
  );
};

// Hooks de mutación
export const useCreateTechnicalCareer = () => {
  return useOptimisticMutation<string, CreateTechnicalCareerRequest>({
    mutationFn: (career) => technicalCareerService.create(career),
    messages: {
      success: "Tecnicatura creada exitosamente",
      error: "Error al crear la tecnicatura",
    },
    invalidateKeys: [technicalCareerKeys.lists()],
  });
};

// Re-export from shared hooks to maintain compatibility
export { useUpdateTechnicalCareer } from "@/shared/hooks/use-technical-careers";

export const useDeleteTechnicalCareer = () => {
  return useOptimisticMutation<void, string>({
    mutationFn: (id) => technicalCareerService.delete(id),
    messages: {
      success: "Tecnicatura eliminada exitosamente",
      error: "Error al eliminar la tecnicatura",
    },
    invalidateKeys: [technicalCareerKeys.lists()],
  });
};
