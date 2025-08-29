import { useQuery } from "@tanstack/react-query";
import { getProfessorAssignments } from "@/shared/services/professor-service";
import { useAuthStore } from "@/features/auth";
import { ProfessorAssignmentFromApi } from "../../types/professor-evaluation";

export const allProfessorAssignmentsKeys = {
  all: ["all-professor-assignments"] as const,
  byProfessor: (professorId: string) =>
    [...allProfessorAssignmentsKeys.all, "professor", professorId] as const,
};

export const useGetAllProfessorAssignments = (enabled = true) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: allProfessorAssignmentsKeys.byProfessor(user?.id || ""),
    queryFn: async () => {
      const data = await getProfessorAssignments(user?.id || "");
      // Mapear los datos de la API al formato esperado por el frontend
      return data.map((assignment: ProfessorAssignmentFromApi) => ({
        assignmentId: assignment.assignmentId,
        competencyName: assignment.competencyName,
        subjectName: assignment.subjectName,
        careerName: "Tecnicatura en Informática", // Por ahora hardcodeado
        careerYear: 1, // Por ahora hardcodeado
        status: assignment.status,
        totalStudents: assignment.totalStudentsCount,
        evaluatedStudents: assignment.evaluatedStudentsCount,
        progressPercentage: assignment.progressPercentage,
      }));
    },
    enabled: enabled && !!user?.id,
  });
};
