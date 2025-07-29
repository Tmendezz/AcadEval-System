import { useQuery } from "@tanstack/react-query";
import { getEvaluations } from "../../../services/evaluation-service";

export const evaluationsKeys = {
  all: ["evaluations"] as const,
  lists: () => [...evaluationsKeys.all, "list"] as const,
  detail: (name: string) => [...evaluationsKeys.all, "detail", name] as const,
};

export const useGetEvaluations = () => {
  return useQuery({
    queryKey: evaluationsKeys.lists(),
    queryFn: getEvaluations,
  });
};
