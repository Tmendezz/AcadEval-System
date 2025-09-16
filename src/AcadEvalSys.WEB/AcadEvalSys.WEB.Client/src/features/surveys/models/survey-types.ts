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
  audience: SurveyAudienceRequest[];
}

export interface SurveyAudienceRequest {
  technicalCareerId: string;
  selectedYears: string[]; // ['First', 'Second', 'Third']
}

// Tipos para la gestión de encuestas
export interface Survey {
  id: string;
  title: string;
  description?: string;
  status: SurveyStatus;
  publishAt?: string;
  closeAt?: string;
  createdAt: string;
  updatedAt?: string;
  templateId: string;
  audiences: SurveyAudienceDto[];
}

export interface SurveyListItem {
  id: string;
  title: string;
  description?: string;
  status: SurveyStatus;
  publishAt?: string;
  closeAt?: string;
  createdAt: string;
  updatedAt?: string;
  questionCount: number;
  responseCount: number;
}

export interface SurveyFilters {
  status?: SurveyStatus;
  search?: string;
  createdBy?: string;
}

   