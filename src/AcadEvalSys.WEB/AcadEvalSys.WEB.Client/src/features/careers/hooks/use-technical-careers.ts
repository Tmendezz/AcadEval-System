import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { technicalCareerService } from "../services/technical-career-service";
import { CreateTechnicalCareerRequest } from "../models/technical-career";

// Query keys
export const technicalCareerKeys = {
  all: ["technical-careers"] as const,
  lists: () => [...technicalCareerKeys.all, "list"] as const,
  list: (filters: string) =>
    [...technicalCareerKeys.lists(), { filters }] as const,
  details: () => [...technicalCareerKeys.all, "detail"] as const,
  detail: (id: string) => [...technicalCareerKeys.details(), id] as const,
};

// Hooks
export const useGetTechnicalCareers = () => {
  return useQuery({
    queryKey: technicalCareerKeys.lists(),
    queryFn: technicalCareerService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useGetTechnicalCareerById = (id: string) => {
  return useQuery({
    queryKey: technicalCareerKeys.detail(id),
    queryFn: () => technicalCareerService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useCreateTechnicalCareer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (career: CreateTechnicalCareerRequest) =>
      technicalCareerService.create(career),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: technicalCareerKeys.lists() });
      toast.success("Tecnicatura creada exitosamente");
    },
    onError: (error) => {
      console.error("Error al crear tecnicatura:", error);
      toast.error("Error al crear la tecnicatura");
    },
  });
};

// Re-export from shared hooks to maintain compatibility
export { useUpdateTechnicalCareer } from "@/shared/hooks/use-technical-careers";

export const useDeleteTechnicalCareer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => technicalCareerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: technicalCareerKeys.lists() });
      toast.success("Tecnicatura eliminada exitosamente");
    },
    onError: (error) => {
      console.error("Error al eliminar tecnicatura:", error);
      toast.error("Error al eliminar la tecnicatura");
    },
  });
};
