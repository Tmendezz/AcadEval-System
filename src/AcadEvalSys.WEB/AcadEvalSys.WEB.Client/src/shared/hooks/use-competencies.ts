import { useQuery } from "@tanstack/react-query";
import {
  getCompetencies,
  getCompetencyById,
} from "../services/competency-service";
import { Competency } from "@/shared/types";

export const competenciesKeys = {
  all: ["competencies"] as const,
  lists: () => [...competenciesKeys.all, "list"] as const,
  list: (filters: string) =>
    [...competenciesKeys.lists(), { filters }] as const,
  details: () => [...competenciesKeys.all, "detail"] as const,
  detail: (id: string) => [...competenciesKeys.details(), id] as const,
};

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
  });
};
