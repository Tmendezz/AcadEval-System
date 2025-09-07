import { useQuery } from "@tanstack/react-query";
import { ProfessorAssignment } from "../models";
import { getProfessorAssignmentById } from "../services";

export const professorAssignmentByIdKeys = {
  all: ["professor-assignment-by-id"] as const,
  byId: (assignmentId: string) =>
    [...professorAssignmentByIdKeys.all, "assignment", assignmentId] as const,
};

export const useGetProfessorAssignmentById = (
  assignmentId: string,
  enabled = true
) => {
  return useQuery<ProfessorAssignment, Error>({
    queryKey: professorAssignmentByIdKeys.byId(assignmentId),
    queryFn: () => getProfessorAssignmentById(assignmentId),
    enabled: enabled && !!assignmentId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
