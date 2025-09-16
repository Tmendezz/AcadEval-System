import { api } from '@/infrastructure/query/axios';

const baseUrl = '/my-surveys';

// Tipos para las encuestas del usuario
export interface UserSurveyDto {
  id: string;
  title: string;
  description: string;
  status: number; // SurveyStatus enum value
  publishedAt: string;
  closedAt?: string;
  responded: boolean;
  respondedAt?: string;
  questionsCount: number;
  surveySubjectId: string;
}

// Mantenemos solo los tipos que realmente usamos
export interface SurveyWithResponseDto {
  id: string;
  title: string;
  description: string;
  subjectName: string;
  status: number;
  publishedAt: string;
  closedAt?: string;
  respondedAt?: string;
  isReadOnly: boolean;
  questions: SurveyQuestionDto[];
}

export interface SurveyQuestionDto {
  id: string;
  text: string;
  type: number; // QuestionType enum
  isRequired: boolean;
  options: SurveyQuestionOptionDto[];
  response?: SurveyQuestionResponseDto;
}

export interface SurveyQuestionOptionDto {
  value: number;
  text: string;
}

export interface SurveyQuestionResponseDto {
  selectedValue?: number;
  text?: string;
}

export interface SubmitSurveyResponseRequest {
  answers: Array<{
    questionId: string;
    selectedValue?: number;
    text?: string;
  }>;
}

export interface UserSurveyFilters {
  status?: 'pending' | 'completed' | 'all';
}

export interface SurveySubjectForUserDto {
  surveySubjectId: string;
  subjectName: string;
  professorName: string;
  hasResponded: boolean;
  respondedAt?: string;
  questionsCount: number;
}

export const userSurveysService = {
  async getMySurveys(filters?: UserSurveyFilters): Promise<UserSurveyDto[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    const queryString = params.toString();
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    const response = await api.get(url);
    return response.data;
  },

  async getPendingSurveys(): Promise<UserSurveyDto[]> {
    const response = await api.get(`${baseUrl}?status=pending`);
    return response.data;
  },

  async getCompletedSurveys(): Promise<UserSurveyDto[]> {
    const response = await api.get(`${baseUrl}?status=completed`);
    return response.data;
  },

  async getSurveyForResponse(surveySubjectId: string, readOnly: boolean = false): Promise<SurveyWithResponseDto> {
    const params = new URLSearchParams();
    if (readOnly) params.append('readOnly', 'true');
    const queryString = params.toString();
    const url = queryString ? `${baseUrl}/subjects/${surveySubjectId}?${queryString}` : `${baseUrl}/subjects/${surveySubjectId}`;
    const response = await api.get(url);
    return response.data;
  },

  async submitSurveyResponse(surveySubjectId: string, request: SubmitSurveyResponseRequest): Promise<void> {
    await api.post(`${baseUrl}/subjects/${surveySubjectId}/responses`, request);
  },

  async getSurveySubjectsForUser(surveyId: string): Promise<SurveySubjectForUserDto[]> {
    const response = await api.get(`${baseUrl}/${surveyId}/subjects`);
    return response.data;
  },
};
