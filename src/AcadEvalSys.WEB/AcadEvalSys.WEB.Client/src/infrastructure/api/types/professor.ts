export interface Professor {
  id: string;
  name: string;
  email: string;
  technicalCareerId?: string;
}

export type ProfessorRequest = Omit<Professor, "id">;

export interface CreateProfessorRequest extends ProfessorRequest {
  password: string;
}
export type UpdateProfessorRequest = ProfessorRequest;
