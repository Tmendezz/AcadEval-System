import { useQuery } from "@tanstack/react-query";
import { getProfessors, getProfessorById } from "../services/professor-service";
import { Professor } from "@/shared/types";

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
