import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { surveyTemplateService } from '../services/survey-template-service';
import {
  SurveyTemplateForm,
  SurveyTemplateFilters,
} from '../models/survey-template-types';
import { toast } from 'sonner';

// Query keys
export const surveyTemplateKeys = {
  all: ['survey-templates'] as const,
  lists: () => [...surveyTemplateKeys.all, 'list'] as const,
  list: (filters?: SurveyTemplateFilters) => [...surveyTemplateKeys.lists(), filters] as const,
  details: () => [...surveyTemplateKeys.all, 'detail'] as const,
  detail: (id: string) => [...surveyTemplateKeys.details(), id] as const,
};

// Hook para obtener plantillas con filtros
export function useSurveyTemplates(filters?: SurveyTemplateFilters) {
  return useQuery({
    queryKey: surveyTemplateKeys.list(filters),
    queryFn: () => surveyTemplateService.getTemplates(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener plantilla por ID
export function useSurveyTemplate(id: string, enabled = true) {
  return useQuery({
    queryKey: surveyTemplateKeys.detail(id),
    queryFn: () => surveyTemplateService.getTemplateById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para crear plantilla
export function useCreateSurveyTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SurveyTemplateForm) => surveyTemplateService.createTemplate(data),
    onSuccess: (id, variables) => {
      // Invalidar la lista de plantillas
      queryClient.invalidateQueries({ queryKey: surveyTemplateKeys.lists() });
      
      toast.success('Plantilla creada exitosamente', {
        description: `La plantilla "${variables.name}" ha sido creada.`,
      });
    },
    onError: (error: any) => {
      toast.error('Error al crear plantilla', {
        description: error?.message || 'No se pudo crear la plantilla. Inténtalo de nuevo.',
      });
    },
  });
}

// Hook para actualizar plantilla
export function useUpdateSurveyTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SurveyTemplateForm }) =>
      surveyTemplateService.updateTemplate(id, data),
    onSuccess: (_, { id, data }) => {
      // Invalidar la lista y el detalle
      queryClient.invalidateQueries({ queryKey: surveyTemplateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: surveyTemplateKeys.detail(id) });
      
      toast.success('Plantilla actualizada exitosamente', {
        description: `La plantilla "${data.name}" ha sido actualizada.`,
      });
    },
    onError: (error: any) => {
      toast.error('Error al actualizar plantilla', {
        description: error?.message || 'No se pudo actualizar la plantilla. Inténtalo de nuevo.',
      });
    },
  });
}

// Hook para eliminar plantilla
export function useDeleteSurveyTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => surveyTemplateService.deleteTemplate(id),
    onSuccess: (_, id) => {
      // Invalidar la lista
      queryClient.invalidateQueries({ queryKey: surveyTemplateKeys.lists() });
      
      // Remover del cache si existe
      queryClient.removeQueries({ queryKey: surveyTemplateKeys.detail(id) });
      
      toast.success('Plantilla eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error('Error al eliminar plantilla', {
        description: error?.message || 'No se pudo eliminar la plantilla. Inténtalo de nuevo.',
      });
    },
  });
}

// Hook para duplicar plantilla
export function useDuplicateSurveyTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newName }: { id: string; newName: string }) =>
      surveyTemplateService.duplicateTemplate(id, newName),
    onSuccess: (newId, { newName }) => {
      // Invalidar la lista
      queryClient.invalidateQueries({ queryKey: surveyTemplateKeys.lists() });
      
      toast.success('Plantilla duplicada exitosamente', {
        description: `La plantilla "${newName}" ha sido creada.`,
      });
    },
    onError: (error: any) => {
      toast.error('Error al duplicar plantilla', {
        description: error?.message || 'No se pudo duplicar la plantilla. Inténtalo de nuevo.',
      });
    },
  });
}

// Hook para publicar plantilla
export function usePublishSurveyTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => surveyTemplateService.publishTemplate(id),
    onSuccess: (_, id) => {
      // Invalidar la lista y el detalle
      queryClient.invalidateQueries({ queryKey: surveyTemplateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: surveyTemplateKeys.detail(id) });
      
      toast.success('Plantilla publicada exitosamente', {
        description: 'La plantilla ya no es un borrador y puede ser utilizada.',
      });
    },
    onError: (error: any) => {
      toast.error('Error al publicar plantilla', {
        description: error?.message || 'No se pudo publicar la plantilla. Inténtalo de nuevo.',
      });
    },
  });
}
