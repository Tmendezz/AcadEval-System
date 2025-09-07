export interface TechnicalCareer {
  id: string;
  name: string;
  totalStudents?: number;
  totalProfessors?: number;
}

export type TechnicalCareerRequest = Pick<TechnicalCareer, "name">;
export type CreateTechnicalCareerRequest = TechnicalCareerRequest;
export type UpdateTechnicalCareerRequest = TechnicalCareerRequest;
