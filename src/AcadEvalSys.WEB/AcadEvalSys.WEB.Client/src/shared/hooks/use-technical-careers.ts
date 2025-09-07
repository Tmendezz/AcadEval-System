import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTechnicalCareers,
  getTechnicalCareerById,
  updateTechnicalCareer,
} from "@infrastructure/api/clients/technical-career-service";
import { UpdateTechnicalCareerRequest } from "@infrastructure/api/types/technical-career";
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
    queryFn: getTechnicalCareers,
  });
};

export const useTechnicalCareerById = (id: string) => {
  return useQuery({
    queryKey: technicalCareersKeys.detail(id),
    queryFn: () => getTechnicalCareerById(id),
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
    }) => updateTechnicalCareer(id, career),
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
