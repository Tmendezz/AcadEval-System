export interface ProfessorEvaluationAssignment {
  assignmentId: string;
  evaluationId: string;
  competencyName: string;
  subjectName: string;
  careerName: string;
  careerYear: number;
  status: "Pending" | "InProgress" | "Completed";
  totalStudents: number;
  evaluatedStudents: number;
  progressPercentage: number;
}

export interface ProfessorAssignmentFromApi {
  assignmentId: string;
  competencyName: string;
  competencyDescription: string;
  subjectName: string;
  status: "Pending" | "Completed";
  totalStudentsCount: number;
  evaluatedStudentsCount: number;
  progressPercentage: number;
  studentEvaluations: any[];
}

export interface StudentForEvaluation {
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: "Pending" | "Evaluated";
  competencyLevel?: CompetencyLevel;
  assessmentDate?: string;
  observations?: string;
}

export type CompetencyLevel =
  | "Inicial"
  | "Intermedio"
  | "Avanzado"
  | "Excelente"
  | "Ninguno";

export interface StudentAssessmentRequest {
  assignmentId: string;
  studentId: string;
  competencyLevel: CompetencyLevel;
  observations?: string;
}

export interface StudentAssessmentResponse {
  success: boolean;
  message: string;
  assessmentId?: string;
}

export interface ProfessorEvaluationFilters {
  status?: "Pending" | "InProgress" | "Completed";
  competencyName?: string;
  subjectName?: string;
  careerYear?: number;
}
