import { api } from '@/infrastructure/query/axios';
import { Survey, SurveyListItem, CreateAcademicSurveyRequest, SurveyFilters } from '../models/survey-types';
import { TechnicalCareer } from '../models/survey-audience-types';

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
  async updateSurvey(id: string, survey: CreateAcademicSurveyRequest): Promise<Survey> {
    const response = await api.put(`${baseUrl}/${id}`, survey);
    return response.data;
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
  async publishSurvey(id: string): Promise<Survey> {
    const response = await api.post(`${baseUrl}/${id}/publish`);
    return response.data;
  },

  // Cerrar encuesta
  async closeSurvey(id: string): Promise<Survey> {
    const response = await api.post(`${baseUrl}/${id}/close`);
    return response.data;
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

