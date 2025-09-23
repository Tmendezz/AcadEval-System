import { api } from '@/infrastructure/query/axios';
import { Survey, CreateAcademicSurveyRequest, SurveyFilters } from '../models/survey-types';

export interface TechnicalCareer {
  id: string;
  name: string;
}

export interface SurveyListItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  publishAt?: string;
  closeAt?: string;
  createdAt: string;
  createdByUserName: string;
}

// DTOs para análisis de resultados
export interface SurveySubjectDto {
  id: string;
  subjectId?: string;
  subjectName?: string;
  academicSurveyId: string;
}
export interface SurveyResponsesOverviewDto {
  surveyId: string;
  title: string;
  subjectsCount: number;
  totalResponses: number;
  responses: SurveyUserResponseDto[];
}

export interface SurveyUserResponseDto {
  responseId: string;
  surveySubjectId: string;
  userId: string;
  submittedAt: string;
  answers: SurveyAnswerDto[];
}

export interface SurveyAnswerDto {
  questionId: string;
  selectedValue?: number;
  text?: string;
}

// DTOs para respuestas agregadas por audiencia
export interface AudienceResponsesDto {
  surveyId: string;
  careerId: string;
  year: number;
  subjects: SubjectAudienceResultDto[];
}

export interface SubjectAudienceResultDto {
  surveySubjectId: string;
  subjectId?: string;
  subjectName?: string;
  professorId?: string;
  professorName?: string;
  questions: QuestionAggregateDto[];
}

export interface QuestionAggregateDto {
  questionId: string;
  text: string;
  totalResponses: number;
  scaleCount: Record<number, number>;
  percentage: Record<number, number>;
  averageSelectedValue?: number;
  openTexts: string[];
}

const baseUrl = '/surveys';

export const surveyService = {
  // Obtener lista de encuestas
  async getSurveys(filters?: SurveyFilters): Promise<SurveyListItem[]> {
    const params = new URLSearchParams();
    
    if (filters?.status !== undefined) {
      params.append('status', filters.status.toString());
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.createdBy) {
      params.append('createdBy', filters.createdBy);
    }

    const queryString = params.toString();
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    
    const response = await api.get(url);
    return response.data;
  },

  // Obtener encuesta por ID
  async getSurveyById(id: string): Promise<Survey> {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
  },

  // Crear nueva encuesta
  async createSurvey(survey: CreateAcademicSurveyRequest): Promise<Survey> {
    const response = await api.post(baseUrl, survey);
    return response.data;
  },

  // Actualizar encuesta existente
  async updateSurvey(id: string, survey: CreateAcademicSurveyRequest): Promise<void> {
    await api.put(`${baseUrl}/${id}`, survey);
  },

  // Eliminar encuesta
  async deleteSurvey(id: string): Promise<void> {
    await api.delete(`${baseUrl}/${id}`);
  },

  // Duplicar encuesta
  async duplicateSurvey(id: string, newTitle: string): Promise<Survey> {
    const response = await api.post(`${baseUrl}/${id}/duplicate`, {
      title: newTitle,
    });
    return response.data;
  },

  // Publicar encuesta
  async publishSurvey(id: string, command?: { closeAt?: string; reopen?: boolean }): Promise<void> {
    await api.put(`${baseUrl}/${id}/publish`, command || {});
  },

  // Cerrar encuesta
  async closeSurvey(id: string, force: boolean = false): Promise<void> {
    await api.put(`${baseUrl}/${id}/close?force=${force}`, {});
  },

  // Archivar encuesta
  async archiveSurvey(id: string): Promise<Survey> {
    const response = await api.post(`${baseUrl}/${id}/archive`);
    return response.data;
  },

  // Obtener tecnicaturas
  async getTechnicalCareers(): Promise<TechnicalCareer[]> {
    const response = await api.get('/technical-careers');
    return response.data;
  },

  // Obtener encuestas del usuario actual
  async getUserSurveys(filters?: { status?: 'pending' | 'completed' | 'all' }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.status) {
      params.append('status', filters.status);
    }
    
    const queryString = params.toString();
    const url = queryString ? `${baseUrl}/my-surveys?${queryString}` : `${baseUrl}/my-surveys`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Obtener una encuesta específica para responder
  async getSurveyForResponse(surveyId: string): Promise<any> {
    const response = await api.get(`${baseUrl}/${surveyId}/for-response`);
    return response.data;
  },

  // Obtener respuestas de una encuesta (solo admin)
  async getSurveyResponses(surveyId: string): Promise<SurveyResponsesOverviewDto> {
    const response = await api.get(`${baseUrl}/${surveyId}/responses`);
    return response.data;
  },

  // Obtener survey subjects por audiencia (solo admin)
  async getSurveySubjectsByAudience(params: { surveyId: string; career: string; year: number; }): Promise<SurveySubjectDto[]> {
    const { surveyId, career, year } = params;
    const query = new URLSearchParams({ career, year: String(year) }).toString();
    const response = await api.get(`${baseUrl}/${surveyId}/subjects-by-audience?${query}`);
    return response.data;
  },

  // Obtener respuestas agregadas por audiencia (solo admin)
  async getAudienceResponses(params: { surveyId: string; careerId: string; year: number; }): Promise<AudienceResponsesDto> {
    const { surveyId, careerId, year } = params;
    const query = new URLSearchParams({ careerId, year: String(year) }).toString();
    const response = await api.get(`${baseUrl}/${surveyId}/analytics/audience?${query}`);
    return response.data;
  },

  // Enviar respuesta de encuesta
  async submitSurveyResponse(surveyId: string, responses: any[]): Promise<void> {
    await api.post(`${baseUrl}/${surveyId}/responses`, { responses });
  },

  // Obtener respuesta del usuario para una encuesta
  async getUserSurveyResponse(surveyId: string): Promise<any> {
    const response = await api.get(`${baseUrl}/${surveyId}/my-response`);
    return response.data;
  },
};

