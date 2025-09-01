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
  competencyLevel?:
    | "Inicial"
    | "Intermedio"
    | "Avanzado"
    | "Excelente"
    | "Ninguno";
  assessmentDate?: string;
  dueDate?: string;
  observations?: string;
  evaluationInstanceTitle: string;
  evaluationInstanceDescription: string;
}

export interface StudentEvaluationDetail {
  evaluationId: string;
  evaluationTitle: string;
  evaluationDescription: string;
  status: "Pending" | "InProgress" | "Completed";
  periodFrom: string;
  periodTo: string;
  subjectsCount: number;
  competenciesCount: number;
  professorsCount: number;
  completedCompetencies: number;
  averageLevel: string;
  completionPercentage: number;
  competencies: {
    competencyName: string;
    competencyDescription: string;
    subjectName: string;
    careerName: string;
    careerYear: string;
    level: "Inicial" | "Intermedio" | "Avanzado" | "Excelente" | "Ninguno";
    observations?: string;
  }[];
}

export const getStudentReceivedEvaluations = async (): Promise<
  StudentReceivedEvaluation[]
> => {
  const { data } = await api.get(
    `${STUDENT_EVALUATIONS_API_URL}/received-evaluations`
  );
  return data;
};

export const getStudentEvaluationDetail = async (
  evaluationId: string
): Promise<StudentEvaluationDetail> => {
  const { data } = await api.get(
    `${STUDENT_EVALUATIONS_API_URL}/evaluation-detail/${evaluationId}`
  );
  return data;
};
