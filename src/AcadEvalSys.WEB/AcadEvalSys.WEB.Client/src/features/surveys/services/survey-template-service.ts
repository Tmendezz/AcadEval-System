import { api } from '@infrastructure/query/axios';
import {
  SurveyTemplate,
  SurveyTemplateListItem,
  SurveyTemplateForm,
  SurveyTemplateFilters,
} from '../models/survey-template-types';

class SurveyTemplateService {
  private readonly baseUrl = '/survey-templates';

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
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    const response = await api.get<SurveyTemplateListItem[]>(url);
    return response.data;
  }

  // Obtener plantilla por ID
  async getTemplateById(id: string): Promise<SurveyTemplate> {
    const response = await api.get<SurveyTemplate>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Crear nueva plantilla
  async createTemplate(data: SurveyTemplateForm): Promise<string> {
    console.log('🚀 Enviando POST a /survey-templates con:', JSON.stringify(data, null, 2));
    
    try {
      const response = await api.post<{ id: string }>(this.baseUrl, data);
      console.log('✅ Respuesta exitosa:', response.data);
      return response.data.id;
    } catch (error: any) {
      console.error('❌ Error en createTemplate:', error);
      console.error('📄 Detalles del error:', error.response?.data);
      throw error;
    }
  }

  // Actualizar plantilla existente
  async updateTemplate(id: string, data: SurveyTemplateForm): Promise<void> {
    await api.put(`${this.baseUrl}/${id}`, data);
  }

  // Eliminar plantilla
  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  // Duplicar plantilla
  async duplicateTemplate(id: string, newName: string): Promise<string> {
    const originalTemplate = await this.getTemplateById(id);
    
    const duplicateData: SurveyTemplateForm = {
      name: newName,
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
          value: opt.value || opt.text, // Usar text como value si no existe
          order: opt.order,
          allowOpenText: opt.allowOpenText || false,
        })),
      })),
    };

    return await this.createTemplate(duplicateData);
  }

  // Publicar plantilla (cambiar de borrador a final)
  async publishTemplate(id: string): Promise<void> {
    const template = await this.getTemplateById(id);
    
    const updateData: SurveyTemplateForm = {
      name: template.title,
      description: template.description,
      surveyType: template.surveyType,
      isDraft: false,
      questions: template.questions,
    };

    await this.updateTemplate(id, updateData);
  }

  // Archivar plantilla
  async archiveTemplate(id: string): Promise<void> {
    // Nota: El backend no tiene endpoint específico para archivar
    // Esto podría implementarse como un soft delete o cambio de estado
    await this.deleteTemplate(id);
  }
}

export const surveyTemplateService = new SurveyTemplateService();
