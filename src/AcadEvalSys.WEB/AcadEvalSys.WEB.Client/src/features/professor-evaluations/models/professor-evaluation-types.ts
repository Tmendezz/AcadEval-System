export interface StudentForEvaluation {
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: "Pending" | "Evaluated";
  competencyLevel?: string;
  assessmentDate?: string;
  observations?: string;
  observation?: string;
}

export interface ProfessorAssignment {
  id: string;
  competencyName: string;
  subjectName: string;
  careerName: string;
  careerYear: number;
  professorName: string;
  dueDate: string;
  status: "Active" | "Completed" | "Expired";
}

export interface StudentAssessmentRequest {
  assignmentId: string;
  studentId: string;
  competencyLevel: string;
  observations?: string;
}

export type CompetencyLevel =
  | "Sin evaluar"
  | "Inicial"
  | "Intermedio"
  | "Avanzado"
  | "Excelente";
