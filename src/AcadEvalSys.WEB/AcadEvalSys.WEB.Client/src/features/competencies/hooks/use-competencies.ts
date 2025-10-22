import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCompetencies,
  getCompetencyById,
  createCompetency,
  updateCompetency,
  deleteCompetency,
} from "@/features/competencies/services/competency-service";

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

// MUTATIONS
export const useCreateCompetency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompetencyFormData) => createCompetency(data),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: competenciesKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("Error al crear competencia:", error);
    },
  });
};

export const useUpdateCompetency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateCompetencyParams) =>
      updateCompetency(id, data),
    onSuccess: (_, { id }) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: competenciesKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: competenciesKeys.detail(id),
        }),
      ]);
    },
    onError: (error) => {
      console.error("Error al actualizar competencia:", error);
    },
  });
};

export const useDeleteCompetency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCompetency(id),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: competenciesKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("Error al eliminar competencia:", error);
    },
  });
};
