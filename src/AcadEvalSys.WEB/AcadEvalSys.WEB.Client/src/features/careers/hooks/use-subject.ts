import { useQuery } from "@tanstack/react-query";
import { getSubjectById } from "../services/subject-service";

// Query keys para subjects
export const subjectKeys = {
  all: () => ["subject"] as const,
  detail: (subjectId: string, careerId: string) => ["subject", subjectId, careerId] as const,
};

export const useSubject = (subjectId: string, careerId: string) => {
  const { data: subject, isLoading: isLoadingSubject } = useQuery({
    queryKey: subjectKeys.detail(subjectId, careerId),
    queryFn: () => getSubjectById(careerId, subjectId, true),
    enabled: !!subjectId && !!careerId,
    staleTime: 3 * 60 * 1000, // 3 minutos
  });

  return { subject, isLoadingSubject };
};
