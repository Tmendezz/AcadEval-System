import { api } from "@/infrastructure/query/axios";
import {
  ProfessorAssignment,
  StudentCompetencyEvaluation,
  StudentAssessmentRequest,
  StudentAssessmentResponse,
} from "@/features/professor-evaluations/models/professor-evaluation";
import type { ProfessorEvaluationAssignment } from "@/features/professor-evaluations/models/professor-evaluation";

export async function getProfessorAssignmentById(assignmentId: string) {
  const { data } = await api.get<ProfessorAssignment>(
    `/professor-assignments/${assignmentId}`
  );
  return data;
}

export async function getAssignmentStudents(assignmentId: string) {
  const { data } = await api.get<{
    subjectName: string;
    competencyName: string;
    studentEvaluations: StudentCompetencyEvaluation[];
    evaluatedStudentsCount: number;
    totalStudentsCount: number;
    progressPercentage: number;
  }>(`/professor-assignments/${assignmentId}/students`);

  return data;
}

export async function completeStudentAssessment(
  assignmentId: string,
  studentId: string,
  body: Omit<StudentAssessmentRequest, "assignmentId" | "studentId">
) {
  const { data } = await api.post<StudentAssessmentResponse>(
    `/professor-assignments/${assignmentId}/students/${studentId}/assessments`,
    {
      competencyLevel: body.competencyLevel,
      observations: body.observations,
    }
  );
  return data;
}

export async function getProfessorAssignments(params?: { evaluationInstanceId?: string }) {
  console.log("getProfessorAssignments", params);
  const { data } = await api.get<ProfessorEvaluationAssignment[]>(
    "/professor-assignments",
    { params }
  );
  console.log(data, "Ruta: /professor-assignments");
  return data;
}


