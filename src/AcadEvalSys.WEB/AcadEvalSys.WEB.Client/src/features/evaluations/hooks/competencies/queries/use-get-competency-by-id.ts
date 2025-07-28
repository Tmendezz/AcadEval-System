import { Competency } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";
import { competenciesKeys } from "./use-get-competencies";
import { getCompetencyById } from "@/shared/services/competency-service";

export const useGetCompetencyById = (id: string) => {
  return useQuery({
    queryKey: competenciesKeys.detail(id),
    queryFn: async (): Promise<Competency | null> => {
      return await getCompetencyById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
