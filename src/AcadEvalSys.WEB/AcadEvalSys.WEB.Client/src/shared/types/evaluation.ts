import { CareerYear } from "./enums";

export interface Evaluation {
  id: string;
  title: string;
  description: string;
  periodFrom: string;
  periodTo: string;
  semester: Semester;
  assignmentsByCareer: CompetencyAssignmentByCareerYearDto[];
  totalProfessorAssignmentsCount: number;
  completedProfessorAssignmentsCount: number;
  overallProgressPercentage: number;
  status: EvaluationStatus;
  createdAt: string;
  createdByUserId?: string;
}

type Semester = "First" | "Second";

export type EvaluationStatus = "Pending" | "Completed";

export interface CompetencyAssignmentByCareerYearDto {
  careerName: string;
  assignments: AssignmentsByYear;
}

export type AssignmentsByYear = {
  [key in CareerYear]: CompetencyAssignmentDto[];
};

export interface CompetencyAssignmentDto {
  assignmentId: string;
  competencyName: string;
  subjectName: string;
  professorName: string;
  status: ProfessorAssignmentStatus;
}

export type ProfessorAssignmentStatus = "Pending" | "Completed";
