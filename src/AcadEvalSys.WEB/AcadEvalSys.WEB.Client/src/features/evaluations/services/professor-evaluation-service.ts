import { api } from "@/shared/config/axios";
import {
  ProfessorEvaluationAssignment,
  StudentForEvaluation,
  StudentAssessmentRequest,
  StudentAssessmentResponse,
  ProfessorEvaluationFilters,
} from "../types/professor-evaluation";

const PROFESSOR_EVALUATIONS_API_URL = "/evaluation-instances";

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
): Promise<ProfessorEvaluationAssignment> => {
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
  return data;
};

export const assessStudent = async (
  assessment: StudentAssessmentRequest
): Promise<StudentAssessmentResponse> => {
  const { data } = await api.post(
    `${PROFESSOR_EVALUATIONS_API_URL}/assignments/${assessment.assignmentId}/students/${assessment.studentId}/assess`,
    {
      competencyLevel: assessment.competencyLevel,
      observations: assessment.observations,
    }
  );
  return data;
};

export const updateStudentAssessment = async (
  assignmentId: string,
  studentId: string,
  assessment: Partial<StudentAssessmentRequest>
): Promise<StudentAssessmentResponse> => {
  const { data } = await api.put(
    `${PROFESSOR_EVALUATIONS_API_URL}/assignments/${assignmentId}/students/${studentId}/assess`,
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
