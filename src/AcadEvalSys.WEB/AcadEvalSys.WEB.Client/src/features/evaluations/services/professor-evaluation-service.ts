import { api } from "@/shared/config/axios";
import {
  ProfessorEvaluationAssignment,
  StudentForEvaluation,
  StudentAssessmentRequest,
  StudentAssessmentResponse,
  ProfessorEvaluationFilters,
  ProfessorAssignmentFromApi,
} from "../types/professor-evaluation";

const PROFESSOR_EVALUATIONS_API_URL = "professors";

export const getProfessorAssignments = async (
  evaluationId: string,
  filters?: ProfessorEvaluationFilters
): Promise<ProfessorEvaluationAssignment[]> => {
  const { data } = await api.get(
    `${PROFESSOR_EVALUATIONS_API_URL}/${evaluationId}/professor-assignments`,
    { params: filters }
  );
  return data;
};

export const getProfessorAssignmentById = async (
  assignmentId: string
): Promise<ProfessorAssignmentFromApi> => {
  const { data } = await api.get(
    `${PROFESSOR_EVALUATIONS_API_URL}/assignments/${assignmentId}`
  );
  return data;
};

export const getStudentsForAssignment = async (
  assignmentId: string
): Promise<StudentForEvaluation[]> => {
  const { data } = await api.get(
    `${PROFESSOR_EVALUATIONS_API_URL}/assignments/${assignmentId}/students`
  );

  // El backend devuelve un objeto con studentEvaluations, necesitamos extraer el array
  if (
    data &&
    data.studentEvaluations &&
    Array.isArray(data.studentEvaluations)
  ) {
    return data.studentEvaluations.map((student: any) => ({
      studentId: student.studentId,
      studentName: student.studentName,
      studentEmail: student.studentEmail,
      status: student.status === "Completed" ? "Evaluated" : "Pending",
      competencyLevel: student.competencyLevel,
      assessmentDate: undefined,
      observations: undefined,
    }));
  }

  return [];
};

export const assessStudent = async (
  assessment: StudentAssessmentRequest
): Promise<StudentAssessmentResponse> => {
  const { data } = await api.post(
    `${PROFESSOR_EVALUATIONS_API_URL}/assignments/${assessment.assignmentId}/students/${assessment.studentId}/evaluate`,
    assessment
  );
  return data;
};

export const updateStudentAssessment = async (
  assessment: StudentAssessmentRequest
): Promise<StudentAssessmentResponse> => {
  const { data } = await api.post(
    `${PROFESSOR_EVALUATIONS_API_URL}/assignments/${assessment.assignmentId}/students/${assessment.studentId}/evaluate`,
    assessment
  );
  return data;
};

export const getAssignmentProgress = async (
  assignmentId: string
): Promise<{
  totalStudents: number;
  evaluatedStudents: number;
  progressPercentage: number;
}> => {
  const { data } = await api.get(
    `${PROFESSOR_EVALUATIONS_API_URL}/assignments/${assignmentId}/progress`
  );
  return data;
};
