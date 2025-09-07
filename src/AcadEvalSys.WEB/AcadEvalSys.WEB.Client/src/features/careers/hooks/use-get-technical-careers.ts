import { useQuery } from "@tanstack/react-query";
import { getTechnicalCareers } from "@infrastructure/api/clients/technical-career-service";

export const technicalCareersKeys = {
  all: ["technical-careers"] as const,
  lists: () => [...technicalCareersKeys.all, "list"] as const,
  list: () => [...technicalCareersKeys.lists()] as const,
};

export const useGetTechnicalCareers = () => {
  return useQuery({
    queryKey: technicalCareersKeys.list(),
    queryFn: getTechnicalCareers,
  });
};
