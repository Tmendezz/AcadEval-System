import { useQuery } from "@tanstack/react-query";
import { getCompetencies } from "@/shared/services/competency-service";

export const competenciesKeys = {
  all: ["competencies"] as const,
  lists: () => [...competenciesKeys.all, "list"] as const,
  detail: (name: string) => [...competenciesKeys.all, "detail", name] as const,
};

export const useGetCompetencies = () => {
  return useQuery({
    queryKey: competenciesKeys.lists(),
    queryFn: getCompetencies,
  });
};
