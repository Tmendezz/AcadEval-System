import { useQuery } from "@tanstack/react-query";
import { getProfessors, getProfessorById } from "@infrastructure/api/clients/professor-service";

export const professorsKeys = {
  all: ["professors"] as const,
  lists: () => [...professorsKeys.all, "list"] as const,
  list: (
    pageNumber: number,
    pageSize: number,
    searchTerm?: string,
    technicalCareerId?: string
  ) =>
    [
      ...professorsKeys.lists(),
      { pageNumber, pageSize, searchTerm, technicalCareerId },
    ] as const,
  details: () => [...professorsKeys.all, "detail"] as const,
  detail: (id: string) => [...professorsKeys.details(), id] as const,
};

export const useProfessors = (
  pageNumber = 1,
  pageSize = 50,
  searchTerm?: string,
  technicalCareerId?: string
) => {
  return useQuery({
    queryKey: professorsKeys.list(
      pageNumber,
      pageSize,
      searchTerm,
      technicalCareerId
    ),
    queryFn: () =>
      getProfessors(pageNumber, pageSize, searchTerm, technicalCareerId),
  });
};

export const useProfessorById = (id: string) => {
  return useQuery({
    queryKey: professorsKeys.detail(id),
    queryFn: () => getProfessorById(id),
    enabled: !!id,
  });
};

// Convenience: evita pasar "undefined" para searchTerm cuando solo se filtra por tecnicatura
export const useCareerProfessors = (
  technicalCareerId?: string,
  pageSize = 100
) => {
  return useProfessors(1, pageSize, undefined, technicalCareerId);
};
