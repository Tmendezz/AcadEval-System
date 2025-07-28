import { useQuery } from "@tanstack/react-query";
import {
  getTechnicalCareers,
  getTechnicalCareerById,
} from "../services/technical-career-service";
import { TechnicalCareer } from "@/shared/types";

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
