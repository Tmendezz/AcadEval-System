import { CareerYear } from "./enums";

export type EvaluationStatus = "Pending" | "Completed" | "Closed";

export interface Evaluation {
  semester: Semester;
  id: string;
  title: string;
  description: string;
  periodFrom: string;
  periodTo: string;
  status: EvaluationStatus;
  careerAssignments: EvaluationCareerAssignment[];
  progress: number;
}

type Semester = "First" | "Second";

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
