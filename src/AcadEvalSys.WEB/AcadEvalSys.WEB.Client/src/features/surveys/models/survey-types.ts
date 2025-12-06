// Enums
import {SurveyQuestion} from "@features/surveys/types/surveys.ts";

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
export interface SurveyAudience {
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
  audiences: SurveyAudience[];
}

export interface CreateAcademicSurveyRequest {
  title: string;
  description: string;
  publishAt?: string;
  closeAt?: string;
  audience: SurveyAudienceRequest[];
  questions: SurveyQuestion[];
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
  audiences: SurveyAudience[];
  questions: SurveyQuestion[];
}


export interface SurveyFilters {
  status?: SurveyStatus;
  search?: string;
  createdBy?: string;
}

   