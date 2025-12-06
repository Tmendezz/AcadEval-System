import { useQuery } from "@tanstack/react-query";
import { getEvaluations } from "@/features/evaluations/services/evaluation-service";

export const evaluationsKeys = {
  all: ["evaluations"] as const,
  lists: () => [...evaluationsKeys.all, "list"] as const,
  list: () => [...evaluationsKeys.lists()] as const,
  detail: (id: string) => [...evaluationsKeys.all, "detail", id] as const,
};

export const useGetEvaluations = () => {
  return useQuery({
    queryKey: evaluationsKeys.list(),
    queryFn: getEvaluations,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
