import { useQuery } from "@tanstack/react-query";
import { getEvaluations } from "@/features/evaluations/services";

export const evaluationsKeys = {
  all: ["evaluations"] as const,
  lists: () => [...evaluationsKeys.all, "list"] as const,
  detail: (id: string) => [...evaluationsKeys.all, "detail", id] as const,
};

export const useGetEvaluations = () => {
  return useQuery({
    queryKey: evaluationsKeys.lists(),
    queryFn: getEvaluations,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
