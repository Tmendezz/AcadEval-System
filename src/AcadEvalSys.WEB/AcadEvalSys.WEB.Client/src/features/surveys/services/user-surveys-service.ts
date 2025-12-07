import { api } from '@/infrastructure/query/axios';

const baseUrl = '/survey-responses';

// Tipos para las encuestas del usuario (alineados al backend)
export interface UserSurveyDto {
  surveyId: string;
  title: string;
  description?: string;
  publishAt?: string;
  closeAt?: string;
  isCompleted: boolean;
  submittedAt?: string;
  status: number; // SurveyStatus enum value
  surveyType: number; // SurveyType enum value
}

// Detalle de encuesta para responder/revisar
export interface SurveyWithResponseDto {
  id: string; // surveyId
  title: string;
  description?: string;
  status: number;
  questions: SurveyQuestionDto[];
}

export interface SurveyQuestionDto {
  id: string;
  text: string;
  type: number; // QuestionType enum
  isRequired: boolean;
  allowComment?: boolean;
  options: SurveyQuestionOptionDto[];
}

export interface SurveyQuestionOptionDto {
  id?: string; // opcional si el backend lo provee
  value: number;
  text: string;
  allowOpenText?: boolean;
}

export interface SubmitSurveyResponseRequest {
  surveySubjectId: string;
  subjectAnswers: Array<{
    questionId: string;
    selectedValue?: number;
    selectedValues?: number[];
    text?: string;
  }>;
}

export interface UserSurveyFilters {
  status?: string;
}

export const userSurveysService = {
  async getMySurveys(filters?: UserSurveyFilters): Promise<UserSurveyDto[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', String(filters.status));
    const queryString = params.toString();
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    const response = await api.get(url);
    return response.data;
  },

  async getPendingSurveys(): Promise<UserSurveyDto[]> {
    const response = await api.get(`${baseUrl}?status=Published`);
    const items: UserSurveyDto[] = response.data;
    const now = Date.now();
    return items.filter(x => !x.isCompleted && (!x.closeAt || new Date(x.closeAt).getTime() >= now));
  },

  async getCompletedSurveys(): Promise<UserSurveyDto[]> {
    const response = await api.get(`${baseUrl}?status=Published`);
    const items: UserSurveyDto[] = response.data;
    const now = Date.now();
    return items.filter(x => x.isCompleted || (!!x.closeAt && new Date(x.closeAt).getTime() < now));
  },

  async getSurveyForResponse(surveyId: string, readOnly: boolean = false): Promise<SurveyWithResponseDto> {
    const params = new URLSearchParams();
    if (readOnly) params.append('readOnly', 'true');
    const queryString = params.toString();
    const url = queryString ? `${baseUrl}/${surveyId}?${queryString}` : `${baseUrl}/${surveyId}`;
    const response = await api.get(url);
    return response.data;
  },

  async submitSurveyResponse(surveyId: string, request: SubmitSurveyResponseRequest): Promise<void> {
    await api.post(`${baseUrl}/${surveyId}`, request);
  },

  async getSurveySubjectsForUser(surveyId: string): Promise<Array<{
    surveySubjectId: string;
    careerYear: string;
    subjectId: string;
    subjectName: string;
    professorId: string | null;
    professorName: string;
    questionsCount: number;
    hasResponded: boolean;
  }>> {
    const response = await api.get(`${baseUrl}/${surveyId}/subjects`);
    return response.data;
  },
};
