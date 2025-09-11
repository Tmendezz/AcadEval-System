// Enums
export enum SurveyStatus {
  Draft = 0,
  Published = 1,
  Closed = 2,
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
  audiences: SurveyAudienceDto[];
}

export interface SetSurveyAudienceRequest {
  surveyId: string;
  audiences: SurveyAudienceDto[];
}

// Helper types
export interface CareerOption {
  id: string;
  name: string;
}

export interface YearOption {
  value: CareerYear;
  label: string;
}