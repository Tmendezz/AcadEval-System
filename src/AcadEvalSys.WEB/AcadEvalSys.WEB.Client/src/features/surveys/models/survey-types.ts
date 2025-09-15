// Enums
export enum SurveyStatus {
  Draft = 0,
  Scheduled = 1,
  Published = 2,
  Closed = 3,
  Archived = 4,
}

export enum CareerYear {
  First = 1,
  Second = 2,
  Third = 3,
}

// DTOs
export interface SurveyAudienceDto {
  TechnicalCareerId: string;
  TechnicalCareerName: string;
  Year: CareerYear;
  YearDisplayName: string;
}

export interface AcademicSurveyDto {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  publishAt?: string;
  closeAt?: string;
  createdAt: string;
  updatedAt?: string;
  audiences: SurveyAudienceDto[];
}

export interface CreateAcademicSurveyRequest {
  title: string;
  templateId: string;
  publishAt?: string;
  closeAt?: string;
  selectedCareerIds: string[];
  selectedYears: CareerYear[];
}

