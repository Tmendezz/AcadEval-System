import { useQuery } from "@tanstack/react-query";
import { getAvailableStudentsForSubject } from "../services/subject-service";

interface UseAvailableStudentsParams {
  careerId: string;
  subjectId: string;
  year?: "First" | "Second" | "Third";
  enabled?: boolean;
}

export const useAvailableStudents = ({
  careerId,
  subjectId,
  year,
  enabled = true,
}: UseAvailableStudentsParams) => {
  return useQuery({
    queryKey: ["available-students", careerId, subjectId, year],
    queryFn: async () => {
      if (!careerId || !subjectId) return [];
      return await getAvailableStudentsForSubject(careerId, subjectId, year);
    },
    enabled: enabled && !!careerId && !!subjectId,
  });
};
