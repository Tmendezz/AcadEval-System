import { useQuery } from "@tanstack/react-query";
import { getProfessorAssignments } from "@/shared/services/professor-service";
import { useAuthStore } from "@/features/auth";

export const allProfessorAssignmentsKeys = {
  all: ["all-professor-assignments"] as const,
  byProfessor: (professorId: string) =>
    [...allProfessorAssignmentsKeys.all, "professor", professorId] as const,
};

export const useGetAllProfessorAssignments = (enabled = true) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: allProfessorAssignmentsKeys.byProfessor(user?.id || ""),
    queryFn: () => getProfessorAssignments(user?.id || ""),
    enabled: enabled && !!user?.id,
  });
};
