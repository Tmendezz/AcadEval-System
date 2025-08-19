export interface CreateStudentRequest {
  email: string;
  name: string;
  password: string;
  currentYear: "First" | "Second" | "Third";
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
