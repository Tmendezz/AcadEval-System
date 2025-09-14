import { api } from '@infrastructure/query/axios';
import {
  SurveyTemplate,
  SurveyTemplateListItem,
  SurveyTemplateForm,
  SurveyTemplateFilters,
} from '../models/survey-template-types';

const SURVEY_TEMPLATES_API_URL = '/survey-templates';

export const surveyTemplateService = {
  // Obtener todas las plantillas con filtros
  async getTemplates(filters?: SurveyTemplateFilters): Promise<SurveyTemplateListItem[]> {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) {
      params.append('searchTerm', filters.searchTerm);
    }
    if (filters?.surveyType !== undefined) {
      params.append('surveyType', filters.surveyType.toString());
    }
    if (filters?.isDraft !== undefined) {
      params.append('isDraft', filters.isDraft.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `${SURVEY_TEMPLATES_API_URL}?${queryString}` : SURVEY_TEMPLATES_API_URL;
    
    const { data } = await api.get<SurveyTemplateListItem[]>(url);
    return data;
  },

  // Obtener plantilla por ID
  async getTemplateById(id: string): Promise<SurveyTemplate> {
    const { data } = await api.get<SurveyTemplate>(`${SURVEY_TEMPLATES_API_URL}/${id}`);
    return data;
  },

  // Crear nueva plantilla
  async createTemplate(data: SurveyTemplateForm): Promise<string> {
    try {
      const { data: response } = await api.post<string>(SURVEY_TEMPLATES_API_URL, data);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.title || 'Error al crear plantilla';
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        console.error('Errores de validación:', validationErrors);
        // Crear un error más descriptivo con los detalles de validación
        const errorDetails = Object.entries(validationErrors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        
        throw new Error(`${errorMessage}. Detalles: ${errorDetails}`);
      }
      
      throw new Error(errorMessage);
    }
  },

  // Actualizar plantilla existente
  async updateTemplate(id: string, data: SurveyTemplateForm): Promise<void> {
    await api.put(`${SURVEY_TEMPLATES_API_URL}/${id}`, data);
  },

  // Eliminar plantilla
  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`${SURVEY_TEMPLATES_API_URL}/${id}`);
  },

  // Duplicar plantilla
  async duplicateTemplate(id: string, newName: string): Promise<string> {
    
    try {
      const originalTemplate = await this.getTemplateById(id);
      
      const duplicateData: SurveyTemplateForm = {
        title: newName,
        description: originalTemplate.description,
        surveyType: originalTemplate.surveyType,
        isDraft: true, // Las copias siempre son borradores
        questions: originalTemplate.questions.map(q => ({
          text: q.text,
          type: q.type,
          order: q.order,
          required: q.required,
          options: q.options.map(opt => ({
            text: opt.text,
            value: typeof opt.value === 'string' ? opt.value : String(opt.value ?? 0),
            order: opt.order,
            allowOpenText: opt.allowOpenText || false,
          })),
        })),
      };

      const newId = await this.createTemplate(duplicateData);
      return newId;
    } catch (error) {
      throw error;
    }
  },

  // Publicar plantilla (cambiar de borrador a final)
  async publishTemplate(id: string): Promise<void> {
    
    try {
      const template = await this.getTemplateById(id);
      
      const updateData: SurveyTemplateForm = {
        title: template.title,
        description: template.description,
        surveyType: template.surveyType,
        isDraft: false,
        questions: template.questions,
      };

      await this.updateTemplate(id, updateData);
    } catch (error) {
      throw error;
    }
  },

  // Archivar plantilla
  async archiveTemplate(id: string): Promise<void> {
    
    try {
      // Nota: El backend no tiene endpoint específico para archivar
      // Esto podría implementarse como un soft delete o cambio de estado
      await this.deleteTemplate(id);
    } catch (error) {
      throw error;
    }
  },
};
