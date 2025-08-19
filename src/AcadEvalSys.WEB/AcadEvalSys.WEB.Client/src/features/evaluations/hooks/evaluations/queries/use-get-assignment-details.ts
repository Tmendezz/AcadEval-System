import { useQuery } from "@tanstack/react-query";
import { getCareerYearAssignmentDetails } from "../../../services/evaluation-service";

export const assignmentDetailsKeys = {
  all: ["assignment-details"] as const,
  careerYear: (evaluationId: string, careerId: string, year: string) => 
    [...assignmentDetailsKeys.all, "career-year", evaluationId, careerId, year] as const,
};

export const useGetCareerYearAssignmentDetails = (
  evaluationId: string,
  careerId: string,
  year: string,
  enabled = true
) => {
  return useQuery({
    queryKey: assignmentDetailsKeys.careerYear(evaluationId, careerId, year),
    queryFn: () => getCareerYearAssignmentDetails(evaluationId, careerId, year),
    enabled: enabled && !!evaluationId && !!careerId && !!year,
  });
};