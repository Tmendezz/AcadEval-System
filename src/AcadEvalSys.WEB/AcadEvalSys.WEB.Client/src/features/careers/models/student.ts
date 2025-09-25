export interface CreateStudentRequest {
  email: string;
  name: string;
  password: string;
  currentYear: "First" | "Second" | "Third";
}

// Tipo de estudiante usado en UI de carreras/asignaturas
export interface Student {
  id: string;
  name: string;
  email: string;
  currentYear: "First" | "Second" | "Third" | number;
  technicalCareerName?: string;
}

export interface CreateStudentToCareerRequest {
  careerId: string;
  student: CreateStudentRequest;
}

export interface UnenrollStudentsResult {
  studentsUnenrolled: number;
  studentsNotFound: number;
  errors: string[];
}

export interface BulkUnenrollRequest {
  studentIds: string[];
}
