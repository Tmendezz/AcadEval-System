import { Competency } from "@infrastructure/api/types/competency";
import { Subject } from "@infrastructure/api/types/subject";
import { TechnicalCareer } from "@infrastructure/api/types/technical-career";

export interface EvaluationFormData {
  title: string;
  description: string;
  semester: "First" | "Second";
  periodFrom: string;
  periodTo: string;
  competencyAssignments: Array<{
    competencyId: string;
    subjectId: string;
  }>;
}

export interface CareerSubject {
  id: string;
  name: string;
  year: number;
  professor: string;
}

export interface WizardStep {
  id: number;
  title: string;
  description: string;
}

export interface Assignment {
  competencyId: string;
  subjectId: string;
  professorId?: string;
  careerId?: string;
  year?: number;
}

export interface AssignmentWithSubject extends Assignment {
  subject: Subject;
}

export interface CareerAssignment {
  careerId: string;
  year: number;
  assignments: Assignment[];
}

// Re-export shared types for convenience
export type { Competency, Subject, TechnicalCareer };
