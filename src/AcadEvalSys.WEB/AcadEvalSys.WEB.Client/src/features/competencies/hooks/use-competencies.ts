import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCompetencies,
  getCompetencyById,
  createCompetency,
  updateCompetency,
  deleteCompetency,
} from "@/features/competencies/services/competency-service";
import { useOptimisticMutation } from "@/shared/lib/query-utils";

// Query Keys - Centralizadas y consistentes
export const competenciesKeys = {
  all: ["competencies"] as const,
  lists: () => [...competenciesKeys.all, "list"] as const,
  list: (filters?: string) =>
    filters
      ? [...competenciesKeys.lists(), { filters }]
      : competenciesKeys.lists(),
  details: () => [...competenciesKeys.all, "detail"] as const,
  detail: (id: string) => [...competenciesKeys.details(), id] as const,
};

// Types para formularios
export interface CompetencyFormData {
  name: string;
  description: string;
  type: "Soft" | "Technical";
  levels: {
    Inicial: string;
    Intermedio: string;
    Avanzado: string;
    Excelente: string;
  };
}

export interface UpdateCompetencyParams {
  id: string;
  data: CompetencyFormData;
}

// QUERIES
export const useCompetencies = () => {
  return useQuery({
    queryKey: competenciesKeys.lists(),
    queryFn: getCompetencies,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useCompetencyById = (id: string) => {
  return useQuery({
    queryKey: competenciesKeys.detail(id),
    queryFn: () => getCompetencyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// MUTATIONS - Usando useOptimisticMutation
export const useCreateCompetency = () => {
  return useOptimisticMutation<string | { id: string } | null, CompetencyFormData>({
    mutationFn: createCompetency,
    messages: {
      success: "Competencia creada correctamente",
      error: "Error al crear la competencia",
    },
    invalidateKeys: [competenciesKeys.lists()],
  });
};

export const useUpdateCompetency = () => {
  const queryClient = useQueryClient();

  return useOptimisticMutation<void, UpdateCompetencyParams>({
    mutationFn: ({ id, data }) => updateCompetency(id, data),
    messages: {
      success: "Competencia actualizada correctamente",
      error: "Error al actualizar la competencia",
    },
    invalidateKeys: [competenciesKeys.lists()],
    onSuccessCallback: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: competenciesKeys.detail(id) });
    },
  });
};

export const useDeleteCompetency = () => {
  return useOptimisticMutation<void, string>({
    mutationFn: deleteCompetency,
    messages: {
      success: "Competencia eliminada correctamente",
      error: "Error al eliminar la competencia",
    },
    invalidateKeys: [competenciesKeys.lists()],
  });
};
