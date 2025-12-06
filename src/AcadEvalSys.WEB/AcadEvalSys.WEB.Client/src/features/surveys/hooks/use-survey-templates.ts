import { useQuery, useQueryClient } from '@tanstack/react-query';
import { surveyTemplateService } from '../services/survey-template-service';
import {
  SurveyTemplateForm,
  SurveyTemplateFilters,
} from '../models/survey-template-types';
import {
  createQueryKeys,
  useOptimisticMutation,
} from '@/shared/lib/query-utils';

// Query keys usando la factory
export const surveyTemplateKeys = createQueryKeys('survey-templates');

// Hook para obtener plantillas con filtros
export function useSurveyTemplates(filters?: SurveyTemplateFilters) {
  return useQuery({
    queryKey: surveyTemplateKeys.list(filters || {}),
    queryFn: () => surveyTemplateService.getTemplates(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

// Hook para obtener plantilla por ID
export function useSurveyTemplate(id: string, enabled = true) {
  return useQuery({
    queryKey: surveyTemplateKeys.detail(id),
    queryFn: () => surveyTemplateService.getTemplateById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
}

// Hook para crear plantilla
export function useCreateSurveyTemplate() {
  return useOptimisticMutation<string, SurveyTemplateForm>({
    mutationFn: surveyTemplateService.createTemplate,
    messages: {
      success: 'Plantilla creada exitosamente',
      error: 'Error al crear plantilla',
    },
    invalidateKeys: [surveyTemplateKeys.lists()],
  });
}

// Hook para actualizar plantilla
export function useUpdateSurveyTemplate() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<void, { id: string; data: SurveyTemplateForm }>({
    mutationFn: ({ id, data }) => surveyTemplateService.updateTemplate(id, data),
    messages: {
      success: 'Plantilla actualizada exitosamente',
      error: 'Error al actualizar plantilla',
    },
    invalidateKeys: [surveyTemplateKeys.lists()],
    onSuccessCallback: async (_, { id }) => {
      // Invalidar el detalle también
      await queryClient.invalidateQueries({ queryKey: surveyTemplateKeys.detail(id) });
    },
  });
}

// Hook para eliminar plantilla
export function useDeleteSurveyTemplate() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<void, string>({
    mutationFn: surveyTemplateService.deleteTemplate,
    messages: {
      success: 'Plantilla eliminada exitosamente',
      error: 'Error al eliminar plantilla',
    },
    invalidateKeys: [surveyTemplateKeys.lists()],
    onSuccessCallback: (_, id) => {
      // Remover del cache si existe
      queryClient.removeQueries({ queryKey: surveyTemplateKeys.detail(id) });
    },
  });
}

// Hook para duplicar plantilla
export function useDuplicateSurveyTemplate() {
  return useOptimisticMutation<string, { id: string; newName: string }>({
    mutationFn: ({ id, newName }) => surveyTemplateService.duplicateTemplate(id, newName),
    messages: {
      success: 'Plantilla duplicada exitosamente',
      error: 'Error al duplicar plantilla',
    },
    invalidateKeys: [surveyTemplateKeys.lists()],
  });
}

// Hook para publicar plantilla
export function usePublishSurveyTemplate() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<void, string>({
    mutationFn: surveyTemplateService.publishTemplate,
    messages: {
      success: 'Plantilla publicada exitosamente',
      error: 'Error al publicar plantilla',
    },
    invalidateKeys: [surveyTemplateKeys.lists()],
    onSuccessCallback: async (_, id) => {
      // Invalidar el detalle también
      await queryClient.invalidateQueries({ queryKey: surveyTemplateKeys.detail(id) });
    },
  });
}
