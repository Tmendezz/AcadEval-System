import { useQuery } from "@tanstack/react-query";
import { getAllProfessorAssignments } from "../services";
import { ProfessorAssignment } from "../models";
import { useAuthStore } from "@/features/auth/store";

export const useGetAllProfessorAssignments = () => {
  const { user } = useAuthStore();
  return useQuery<ProfessorAssignment[], Error>({
    queryKey: ["professor-assignments", user?.id],
    queryFn: getAllProfessorAssignments,
    enabled: !!user?.id,
  });
};
