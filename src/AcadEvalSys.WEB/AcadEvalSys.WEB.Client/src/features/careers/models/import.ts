export interface ImportStudentsResult {
  usersCreated: number;
  studentsEnrolled: number;
  studentsAlreadyEnrolled: number;
  errors: string[];
  generatedPasswords: GeneratedPassword[];
}

export interface GeneratedPassword {
  email: string;
  password: string;
}

export interface ImportStudentsRequest {
  file: File;
}

export interface ImportStudentsToCareerRequest {
  careerId: string;
  file: File;
}
