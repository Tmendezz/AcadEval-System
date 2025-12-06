// Tipos locales de subject usados por el feature
export interface EnrolledStudent {
  studentId: string;
  studentName: string;
  studentEmail: string;
  currentYear: "First" | "Second" | "Third" | number;
  technicalCareerName?: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  year: "First" | "Second" | "Third" | string;
  professorId?: string;
  professorName?: string;
  enrolledStudents?: EnrolledStudent[];
}

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
