/**
 * Tipos auxiliares para evaluaciones
 * Nota: Los tipos principales están en ./evaluation.ts y ./evaluation-form.ts
 */

// Simplified Career interface
export interface Career {
  id: string;
  name: string;
}

// Year types
export type CareerYear = "First" | "Second" | "Third" | "Fourth";

export type CompetencyLevel = "Inicial" | "Intermedio" | "Avanzado" | "Experto";

// Assignment types for display
export interface EvaluationAssignment {
  id: string;
  competencyName: string;
  subjectName: string;
  professorName: string;
  status: "Pending" | "InProgress" | "Completed";
}

export interface EvaluationCareerAssignment {
  careerId: string;
  careerName: string;
  year: CareerYear;
  assignments: EvaluationAssignment[];
}

export type AssignmentsByYear = {
  [key in CareerYear]: EvaluationAssignment[];
};
