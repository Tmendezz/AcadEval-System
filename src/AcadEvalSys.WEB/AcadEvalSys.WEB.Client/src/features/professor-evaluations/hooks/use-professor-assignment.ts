import { useQuery } from "@tanstack/react-query";
import { getProfessorAssignmentById } from "../services";
import { ProfessorAssignment } from "../models";

export const useProfessorAssignment = (assignmentId: string) => {
  return useQuery<ProfessorAssignment, Error>({
    queryKey: ["professor-assignment", assignmentId],
    queryFn: () => getProfessorAssignmentById(assignmentId),
    enabled: !!assignmentId,
  });
};
