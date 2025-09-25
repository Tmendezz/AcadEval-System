import { useQuery } from "@tanstack/react-query";
import {
  getSubjectsByCareer,
  getSubjectById,
} from "@/features/careers/services/subject-service";

export const subjectsKeys = {
  all: ["subjects"] as const,
  lists: () => [...subjectsKeys.all, "list"] as const,
  list: (careerId: string, year?: string) =>
    [...subjectsKeys.lists(), { careerId, year }] as const,
  details: () => [...subjectsKeys.all, "detail"] as const,
  detail: (careerId: string, subjectId: string) =>
    [...subjectsKeys.details(), careerId, subjectId] as const,
};

export const useSubjectsByCareer = (
  careerId: string,
  year?: string,
  includeEnrolledStudents = false
) => {
  return useQuery({
    queryKey: subjectsKeys.list(careerId, year),
    queryFn: () =>
      getSubjectsByCareer(
        careerId,
        year as "First" | "Second" | "Third" | undefined,
        includeEnrolledStudents
      ),
    enabled: !!careerId,
  });
};

export const useSubjectById = (
  careerId: string,
  subjectId: string,
  includeEnrolledStudents = false
) => {
  return useQuery({
    queryKey: subjectsKeys.detail(careerId, subjectId),
    queryFn: () => getSubjectById(careerId, subjectId, includeEnrolledStudents),
    enabled: !!careerId && !!subjectId,
  });
};
