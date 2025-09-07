import { useQuery } from "@tanstack/react-query";
import { getAllProfessorAssignments } from "../services";
import { ProfessorAssignment } from "../models";

export const professorAssignmentsKeys = {
  all: ["professor-assignments"] as const,
};

export const useGetProfessorAssignments = (enabled = true) => {
  return useQuery<ProfessorAssignment[], Error>({
    queryKey: professorAssignmentsKeys.all,
    queryFn: getAllProfessorAssignments,
    enabled,
  });
};
