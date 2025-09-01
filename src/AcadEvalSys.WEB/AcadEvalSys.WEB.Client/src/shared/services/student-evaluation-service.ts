import { api } from "@/shared/config/axios";

const STUDENT_EVALUATIONS_API_URL = "/api/student-evaluations";

export interface StudentReceivedEvaluation {
  id: string;
  competencyName: string;
  subjectName: string;
  careerName: string;
  year: string;
  professorName: string;
  status: "Pending" | "InProgress" | "Completed";
  competencyLevel?: "Inicial" | "Intermedio" | "Avanzado" | "Excelente" | "Ninguno";
  assessmentDate?: string;
  dueDate?: string;
  observations?: string;
  evaluationInstanceTitle: string;
  evaluationInstanceDescription: string;
}

export const getStudentReceivedEvaluations = async (): Promise<StudentReceivedEvaluation[]> => {
  const { data } = await api.get(`${STUDENT_EVALUATIONS_API_URL}/received-evaluations`);
  return data;
};
