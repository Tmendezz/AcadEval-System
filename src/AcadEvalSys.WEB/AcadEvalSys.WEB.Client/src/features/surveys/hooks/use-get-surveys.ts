import { useQuery } from "@tanstack/react-query";
import { getSurveys } from "@/features/surveys/services/survey-service";

export const surveysKeys = {
  all: ["surveys"] as const,
  lists: () => [...surveysKeys.all, "list"] as const,
  list: () => [...surveysKeys.lists()] as const,
};

export const useGetSurveys = () => {
  return useQuery({
    queryKey: surveysKeys.list(),
    queryFn: getSurveys,
  });
};
