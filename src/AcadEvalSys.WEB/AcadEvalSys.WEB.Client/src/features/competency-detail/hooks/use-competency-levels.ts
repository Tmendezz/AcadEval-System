import { useQuery } from "@tanstack/react-query";
import { getCompetencyLevels } from "../services";

export const useCompetencyLevels = (competencyId: string) => {
  return useQuery({
    queryKey: ["competency-levels", competencyId],
    queryFn: () => getCompetencyLevels(competencyId),
    enabled: !!competencyId,
  });
};
