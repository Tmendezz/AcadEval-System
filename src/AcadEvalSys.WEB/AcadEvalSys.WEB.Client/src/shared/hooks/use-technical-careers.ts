import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { technicalCareerService } from "@/features/careers/services/technical-career-service";
import type { UpdateTechnicalCareerRequest } from "@/features/careers/models";
import { toast } from "sonner";

export const technicalCareersKeys = {
  all: ["technical-careers"] as const,
  lists: () => [...technicalCareersKeys.all, "list"] as const,
  list: (filters: string) =>
    [...technicalCareersKeys.lists(), { filters }] as const,
  details: () => [...technicalCareersKeys.all, "detail"] as const,
  detail: (id: string) => [...technicalCareersKeys.details(), id] as const,
};

export const useTechnicalCareers = () => {
  return useQuery({
    queryKey: technicalCareersKeys.lists(),
    queryFn: () => technicalCareerService.getAll(),
  });
};

export const useTechnicalCareerById = (id: string) => {
  return useQuery({
    queryKey: technicalCareersKeys.detail(id),
    queryFn: () => technicalCareerService.getById(id),
    enabled: !!id,
  });
};

export const useUpdateTechnicalCareer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      career,
    }: {
      id: string;
      career: UpdateTechnicalCareerRequest;
    }) => technicalCareerService.update(id, career),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: technicalCareersKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: technicalCareersKeys.detail(id),
      });
      toast.success("Tecnicatura actualizada exitosamente");
    },
    onError: (error) => {
      console.error("Error al actualizar tecnicatura:", error);
      toast.error("Error al actualizar la tecnicatura");
    },
  });
};
