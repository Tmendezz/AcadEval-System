import { Competency, Subject, TechnicalCareer } from "@/shared/types";

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
  careerId?: string;
  year?: number;
}

export interface CareerAssignment {
  careerId: string;
  year: number;
  assignments: Assignment[];
}

// Re-export shared types for convenience
export type { Competency, Subject, TechnicalCareer };
