import { api } from '@infrastructure/query/axios';
import {
  SurveyTemplate,
  SurveyTemplateListItem,
  SurveyTemplateForm,
  SurveyTemplateFilters,
} from '../models/survey-template-types';

const SURVEY_TEMPLATES_API_URL = '/survey-templates';

// Función auxiliar para convertir tipo numérico a string
const convertTypeToString = (type: number | string): string => {
  if (typeof type === 'string') return type; // Ya es string
  switch (type) {
    case 0: return 'SingleChoice';
    case 1: return 'MultipleChoice';
    case 2: return 'OpenText';
    default: return 'SingleChoice';
  }
};

// Función auxiliar para mapear datos del frontend al formato esperado por el backend
const mapFormDataToBackend = (data: SurveyTemplateForm, id?: string, originalTemplate?: any) => {
  const payload = {
    id: id,
    title: data.title,
    description: data.description,
    surveyType: data.surveyType, // Mantener como string (Student/Professor)
    isDraft: data.isDraft,
    // Incluir campos adicionales del template original si estamos actualizando
    ...(originalTemplate && {
      version: originalTemplate.version,
      createdAt: originalTemplate.createdAt,
      updatedAt: originalTemplate.updatedAt
    }),
    questions: data.questions.map((question, questionIndex) => {
      // Buscar la pregunta original por índice o texto para obtener su ID
      const originalQuestion = originalTemplate?.questions?.[questionIndex];
      
      return {
        id: originalQuestion?.id || null, // Usar el ID del template original
        text: question.text,
        type: convertTypeToString(question.type),
        order: question.order || (questionIndex + 1),
        required: question.required,
        allowComment: question.allowComment || false,
        options: (question.options || []).map((option, optionIndex) => {
          // Buscar la opción original por índice para obtener su ID
          const originalOption = originalQuestion?.options?.[optionIndex];
          
          return {
            id: originalOption?.id || null, // Usar el ID de la opción original
            value: typeof option.value === 'number' ? option.value : (optionIndex + 1),
            text: option.text,
            order: option.order || (optionIndex + 1),
            allowOpenText: option.allowOpenText || false
          };
        })
      };
    })
  };

  // Remover id si es undefined para creación
  if (!id) {
    delete payload.id;
  }

  return payload;
};

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
    const mappedData = mapFormDataToBackend(data);
    
    try {
      const { data: response } = await api.post<string>(SURVEY_TEMPLATES_API_URL, mappedData);
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
    try {
      // Primero obtener el template original para incluir campos necesarios
      const originalTemplate = await this.getTemplateById(id);
      
      const mappedData = mapFormDataToBackend(data, id, originalTemplate);
      
      await api.put(`${SURVEY_TEMPLATES_API_URL}/${id}`, mappedData);
    } catch (error: any) {
      throw error;
    }
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
