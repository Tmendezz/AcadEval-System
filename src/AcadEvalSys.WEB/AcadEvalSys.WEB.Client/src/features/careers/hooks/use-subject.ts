import { useQuery } from "@tanstack/react-query";
import { getSubjectById } from "@/shared/services/subject-service";

export const useSubject = (subjectId: string, careerId: string) => {
  const { data: subject, isLoading: isLoadingSubject } = useQuery({
    queryKey: ["subject", subjectId, careerId],
    queryFn: async () => {
      if (!subjectId || !careerId) return null;
      return await getSubjectById(careerId, subjectId, true);
    },
    enabled: !!subjectId && !!careerId,
  });

  return { subject, isLoadingSubject };
};
