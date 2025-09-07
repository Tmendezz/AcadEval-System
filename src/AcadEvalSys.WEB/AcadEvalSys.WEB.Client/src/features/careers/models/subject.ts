// Re-export types from infrastructure that are used by this feature
export type {
  Subject,
  EnrolledStudent,
  SubjectAssignment,
  CareerYearData,
  CareerData,
} from "@infrastructure/api/types/subject";

// Feature-specific types for careers
export interface CareerProfessor {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface CareerStudent {
  id: string;
  name: string;
  email: string;
  enrollmentDate: string;
  status: "Active" | "Inactive" | "Graduated";
}
