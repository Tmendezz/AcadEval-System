import { useQuery } from "@tanstack/react-query";
import { getEvaluations } from "@infrastructure/api/clients/evaluation-service";

export const evaluationsKeys = {
  all: ["evaluations"] as const,
  lists: () => [...evaluationsKeys.all, "list"] as const,
  list: () => [...evaluationsKeys.lists()] as const,
};

export const useGetEvaluations = () => {
  return useQuery({
    queryKey: evaluationsKeys.list(),
    queryFn: getEvaluations,
  });
};
