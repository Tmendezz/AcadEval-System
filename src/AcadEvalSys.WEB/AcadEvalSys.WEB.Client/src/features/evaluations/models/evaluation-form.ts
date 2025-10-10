/**
 * Tipos para el formulario de creación de evaluaciones
 */

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

// Tipos simplificados para entities usadas en el wizard
export interface Competency {
  id: string;
  name: string;
  description: string;
  type: "Soft" | "Technical";
}

export interface Subject {
  id: string;
  name: string;
  year: number;
  technicalCareer?: string;
  technicalCareerId?: string;
  professorName?: string;
  professorId?: string;
}

export interface TechnicalCareer {
  id: string;
  name: string;
  totalStudents?: number;
  totalProfessors?: number;
}

export interface AssignmentWithSubject extends Assignment {
  subject: Subject;
}

export interface CareerAssignment {
  careerId: string;
  year: number;
  assignments: Assignment[];
}
