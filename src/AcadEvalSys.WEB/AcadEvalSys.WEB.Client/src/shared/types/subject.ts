import { CareerYear } from "./enums";

export interface Subject {
  id: string;
  name: string;
  description: string;
  year: "First" | "Second" | "Third";
  professorId?: string;
  professorName?: string;
  enrolledStudents?: EnrolledStudent[];
}

export type SubjectRequest = Pick<Subject, "name" | "description" | "year"> & {
  professorId?: string;
};
export type CreateSubjectRequest = SubjectRequest;
export type UpdateSubjectRequest = SubjectRequest;

export interface EnrolledStudent {
  studentId: string;
  studentName: string;
  studentEmail: string;
}

export interface SubjectAssignment {
  subjectId: string;
  professorId?: string;
  studentIds: string[];
}

export interface CareerYearData {
  year: CareerYear;
  subjects: Subject[];
  totalSubjects: number;
  totalStudents: number;
  assignedProfessors: number;
}

export interface CareerData {
  id: string;
  name: string;
  years: CareerYearData[];
  totalStudents: number;
  totalSubjects: number;
}
