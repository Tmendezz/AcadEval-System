
export type EvaluationStatus = "Pending" | "Draft" | "Published" | "Completed" | "Archived";
export type ProfessorAssignmentStatus = "Pending" | "InProgress" | "Completed";
export type Semester = "First" | "Second";

export interface CompetencyAssignmentDto {
  assignmentId: string;
  competencyName: string;
  subjectName: string;
  professorName: string;
  status: ProfessorAssignmentStatus;
}

export interface CompetencyAssignmentByCareerYearDto {
  careerName: string;
  careerId: string;
  assignments: Record<string, CompetencyAssignmentDto[]>;
}

export interface Evaluation {
  id: string;
  title: string;
  description: string;
  periodFrom: string;
  periodTo: string;
  assignmentsByCareer: CompetencyAssignmentByCareerYearDto[];
  totalProfessorAssignmentsCount: number;
  completedProfessorAssignmentsCount: number;
  overallProgressPercentage: number;
  status: EvaluationStatus;
  createdAt: string;
  createdByUserId?: string;
  semester: Semester;
}

