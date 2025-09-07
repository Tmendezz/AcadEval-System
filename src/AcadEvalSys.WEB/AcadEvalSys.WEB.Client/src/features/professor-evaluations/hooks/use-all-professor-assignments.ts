import { useQuery } from "@tanstack/react-query";
import { getAllProfessorAssignments } from "../services";
import { ProfessorAssignment } from "../models";

export const useGetAllProfessorAssignments = () => {
  return useQuery<ProfessorAssignment[], Error>({
    queryKey: ["professor-assignments"],
    queryFn: getAllProfessorAssignments,
  });
};
