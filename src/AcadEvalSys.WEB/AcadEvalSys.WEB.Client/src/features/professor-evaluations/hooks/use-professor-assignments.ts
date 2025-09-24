import { useQuery } from "@tanstack/react-query";
import { getAllProfessorAssignments } from "../services";
import { ProfessorAssignment } from "../models";
import { useAuthStore } from "@/features/auth/store";

export const professorAssignmentsKeys = {
  all: ["professor-assignments"] as const,
};

export const useGetProfessorAssignments = (enabled = true) => {
  const { user } = useAuthStore();
  return useQuery<ProfessorAssignment[], Error>({
    queryKey: [
      ...professorAssignmentsKeys.all,
      user?.id,
    ],
    queryFn: getAllProfessorAssignments,
    enabled: enabled && !!user?.id,
  });
};
