import { useQuery, useQueryClient } from '@tanstack/react-query';
import { surveyService } from '../services/survey-service';
import { userSurveysService, UserSurveyFilters } from '../services/user-surveys-service';
import { CreateAcademicSurveyRequest, SurveyFilters } from '../models/survey-types';
import { api } from '@/infrastructure/query/axios';
import {
  createQueryKeys,
  useOptimisticMutation,
  useEntityQuery,
} from '@/shared/lib/query-utils';

export interface TechnicalCareer {
  id: string;
  name: string;
}

// Query keys usando la factory
export const surveyKeys = createQueryKeys('surveys');

// Query keys para encuestas de usuario
export const userSurveysKeys = createQueryKeys('user-surveys');

// ============================================
// HOOKS DE CONSULTA
// ============================================

export function useSurveys(filters?: SurveyFilters) {
  return useQuery({
    queryKey: [...surveyKeys.lists(), { filters }],
    queryFn: () => surveyService.getSurveys(filters),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSurvey(id: string) {
  return useEntityQuery(
    surveyKeys.detail(id),
    () => surveyService.getSurveyById(id),
    id,
    { staleMinutes: 5 }
  );
}

// ============================================
// HOOKS DE MUTACIÓN
// ============================================

export function useCreateSurvey() {
  return useOptimisticMutation<string, CreateAcademicSurveyRequest>({
    mutationFn: async (survey) => {
      const result = await surveyService.createSurvey(survey);
      return result.id;
    },
    messages: {
      success: 'Encuesta creada exitosamente',
      error: 'Error al crear la encuesta',
    },
    invalidateKeys: [surveyKeys.lists()],
    showSuccessToast: false, // Silencioso para permitir lógica custom
  });
}

export function useUpdateSurvey() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<void, { id: string; survey: CreateAcademicSurveyRequest }>({
    mutationFn: ({ id, survey }) => surveyService.updateSurvey(id, survey),
    messages: {
      success: 'Encuesta actualizada exitosamente',
      error: 'Error al actualizar la encuesta',
    },
    invalidateKeys: [surveyKeys.lists()],
    onSuccessCallback: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: surveyKeys.detail(id) });
    },
    showSuccessToast: false,
  });
}

export function useDeleteSurvey() {
  return useOptimisticMutation<void, string>({
    mutationFn: surveyService.deleteSurvey,
    messages: {
      success: 'Encuesta eliminada exitosamente',
      error: 'Error al eliminar la encuesta',
    },
    invalidateKeys: [surveyKeys.lists()],
  });
}

export function useDuplicateSurvey() {
  return useOptimisticMutation<string, { id: string; newTitle: string }>({
    mutationFn: async ({ id, newTitle }) => {
      const result = await surveyService.duplicateSurvey(id, newTitle);
      return result.id;
    },
    messages: {
      success: 'Encuesta duplicada exitosamente',
      error: 'Error al duplicar la encuesta',
    },
    invalidateKeys: [surveyKeys.lists()],
  });
}

export function usePublishSurvey() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<void, { id: string; command?: { closeAt?: string; reopen?: boolean } }>({
    mutationFn: ({ id, command }) => surveyService.publishSurvey(id, command),
    messages: {
      success: 'Encuesta publicada exitosamente',
      error: 'Error al publicar la encuesta',
    },
    invalidateKeys: [surveyKeys.lists()],
    onSuccessCallback: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: surveyKeys.detail(id) });
    },
  });
}

export function useCloseSurvey() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<void, { id: string; force?: boolean }>({
    mutationFn: ({ id, force }) => surveyService.closeSurvey(id, force),
    messages: {
      success: 'Encuesta cerrada exitosamente',
      error: 'Error al cerrar la encuesta',
    },
    invalidateKeys: [surveyKeys.lists()],
    onSuccessCallback: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: surveyKeys.detail(id) });
    },
  });
}

export function useArchiveSurvey() {
  const queryClient = useQueryClient();

  return useOptimisticMutation<void, string>({
    mutationFn: async (id) => {
      await surveyService.archiveSurvey(id);
    },
    messages: {
      success: 'Encuesta archivada exitosamente',
      error: 'Error al archivar la encuesta',
    },
    invalidateKeys: [surveyKeys.lists()],
    onSuccessCallback: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: surveyKeys.detail(id) });
    },
  });
}

// Hook para obtener tecnicaturas
export function useTechnicalCareers() {
  return useQuery({
    queryKey: ['technical-careers'],
    queryFn: async (): Promise<TechnicalCareer[]> => {
      const response = await api.get('/technical-careers');
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
}

// Hook para obtener respuestas de encuesta (admin)
export function useSurveyResponses(surveyId: string) {
  return useQuery({
    queryKey: ['survey-responses', surveyId],
    queryFn: () => surveyService.getSurveyResponses(surveyId),
    enabled: !!surveyId,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useSurveySubjectsByAudience(
  surveyId: string,
  career: string,
  year: number
) {
  return useQuery({
    queryKey: ['survey-subjects-audience', surveyId, career, year],
    queryFn: () => surveyService.getSurveySubjectsByAudience({ surveyId, career, year }),
    enabled: !!surveyId && !!career && !!year,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAudienceResponses(
  surveyId: string,
  careerId: string,
  year: number
) {
  return useQuery({
    queryKey: ['audience-responses', surveyId, careerId, year],
    queryFn: () => surveyService.getAudienceResponses({ surveyId, careerId, year }),
    enabled: !!surveyId && !!careerId && !!year,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// ===========================================
// HOOKS PARA ENCUESTAS DEL USUARIO
// ===========================================

/**
 * Hook para obtener las encuestas del usuario autenticado
 */
export function useUserSurveys(filters?: UserSurveyFilters) {
  return useQuery({
    queryKey: userSurveysKeys.list(filters as Record<string, unknown>),
    queryFn: () => userSurveysService.getMySurveys(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para obtener solo las encuestas pendientes del usuario
 */
export function usePendingSurveys() {
  return useQuery({
    queryKey: userSurveysKeys.list({ status: 'pending' }),
    queryFn: () => userSurveysService.getPendingSurveys(),
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener solo las encuestas completadas del usuario
 */
export function useCompletedSurveys() {
  return useQuery({
    queryKey: userSurveysKeys.list({ status: 'completed' }),
    queryFn: () => userSurveysService.getCompletedSurveys(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Hook para obtener una encuesta específica para responder
 */
export function useSurveyForResponse(surveyId: string, readOnly: boolean = false) {
  return useQuery({
    queryKey: [...userSurveysKeys.all, 'survey-for-response', surveyId, readOnly],
    queryFn: () => userSurveysService.getSurveyForResponse(surveyId, readOnly),
    enabled: !!surveyId,
    staleTime: readOnly ? 10 * 60 * 1000 : 30 * 1000,
    gcTime: readOnly ? 30 * 60 * 1000 : 5 * 60 * 1000,
  });
}

/**
 * Hook para enviar respuestas de una encuesta
 */
export function useSubmitSurveyResponse() {
  return useOptimisticMutation<
    void,
    {
      surveyId: string;
      surveySubjectId: string;
      subjectAnswers: Array<{ questionId: string; selectedValue?: number; text?: string }>;
    }
  >({
    mutationFn: ({ surveyId, surveySubjectId, subjectAnswers }) =>
      userSurveysService.submitSurveyResponse(surveyId, { surveySubjectId, subjectAnswers }),
    messages: {
      success: 'Respuesta enviada exitosamente',
      error: 'Error al enviar la respuesta',
    },
    invalidateKeys: [userSurveysKeys.all],
    onSuccessCallback: async (_, { surveyId }) => {
      const { useQueryClient } = await import('@tanstack/react-query');
      const queryClient = useQueryClient();
      await queryClient.invalidateQueries({
        queryKey: [...userSurveysKeys.all, 'survey-for-response', surveyId],
      });
    },
    showSuccessToast: false, // Silencioso para permitir lógica custom
  });
}

/**
 * Hook para obtener todos los survey subjects de una encuesta específica para el usuario actual
 */
export function useSurveySubjectsForUser(surveyId: string) {
  return useQuery({
    queryKey: [...userSurveysKeys.all, 'survey-subjects', surveyId],
    queryFn: () => userSurveysService.getSurveySubjectsForUser(surveyId),
    enabled: !!surveyId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Re-exportar tipos necesarios
export type { UserSurveyDto, UserSurveyFilters } from '../services/user-surveys-service';

