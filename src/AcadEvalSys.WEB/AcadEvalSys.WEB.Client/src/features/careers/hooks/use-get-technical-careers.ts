import { useQuery } from "@tanstack/react-query";
import { technicalCareerService } from "../services/technical-career-service";

export const technicalCareersKeys = {
  all: ["technical-careers"] as const,
  lists: () => [...technicalCareersKeys.all, "list"] as const,
  list: () => [...technicalCareersKeys.lists()] as const,
};

export const useGetTechnicalCareers = () => {
  return useQuery({
    queryKey: technicalCareersKeys.list(),
    queryFn: () => technicalCareerService.getAll(),
  });
};
