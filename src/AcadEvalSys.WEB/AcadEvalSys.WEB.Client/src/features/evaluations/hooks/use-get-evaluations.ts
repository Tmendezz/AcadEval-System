import { useQuery } from "@tanstack/react-query";
import { getEvaluations } from "@/features/evaluations/services/evaluation-service";

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
