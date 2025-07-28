import { CareerYear } from "./enums";

export interface Evaluation {
  id: string;
  title: string;
  description: string;
  periodFrom: string;
  periodTo: string;
  careerAssignments: EvaluationCareerAssignment[];
}

export interface EvaluationCareerAssignment {
  technicalCareerId: string;
  technicalCareerName: string;
  assignmentsByYear: AssignmentsByYear;
  totalAssignments: number;
  totalProfessors: number;
  totalCompetencies: number;
  activeYears: string[];
}

export type AssignmentsByYear = {
  [key in CareerYear]: EvaluationAssignment[];
};

export interface EvaluationAssignment {
  assignmentId: string;
  year: string;
  competencyId: string;
  competencyName: string;
  competencyDescription: string;
  competencyType: string;
  professorId: string;
  professorName: string;
  professorEmail: string;
}
